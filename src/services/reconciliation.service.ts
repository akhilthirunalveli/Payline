import knex from 'knex';
import config from '../../knexfile';
import dayjs from 'dayjs';

const db = knex(config.development);

export class ReconciliationService {
    async runReconciliation() {
        const results = {
            matched: 0,
            missingInBank: 0,
            missingInApp: 0,
            amountMismatch: 0,
            total: 0
        };

        const BATCH_SIZE = 100;
        let processedCount = 0;

        // 1. Process Internal Payments in Batches
        while (true) {
            // Fetch batch of unreconciled payments
            const payments = await db('internal_payments')
                .whereNotExists(function () {
                    this.select('*').from('reconciliations').whereRaw('reconciliations.payment_id = internal_payments.payment_id');
                })
                .orderBy('created_at', 'asc') // Create deterministic order for cursor/pagination
                .limit(BATCH_SIZE)
                .select('*');

            if (payments.length === 0) break;

            // Collect references for bulk fetching
            const gatewayRefs = payments
                .map(p => p.gateway_reference)
                .filter((ref): ref is string => !!ref);

            // Fetch potential matches from bank statements
            // We search by exact bank_reference match OR if possible candidates for fuzzy match exist
            // For checking 'unreconciled' statements efficiently, we also check they aren't already reconciled
            const potentialMatches = await db('bank_statements')
                .whereIn('bank_reference', gatewayRefs)
                .whereNotExists(function () {
                    this.select('*').from('reconciliations').whereRaw('reconciliations.statement_id = bank_statements.statement_id');
                })
                .select('*');

            const statementsMap = new Map(potentialMatches.map(s => [s.bank_reference, s]));

            for (const payment of payments) {
                let match = null;
                let status = 'MISSING_IN_BANK';
                let reason = null;

                // A. Strong Match
                if (payment.gateway_reference && statementsMap.has(payment.gateway_reference)) {
                    match = statementsMap.get(payment.gateway_reference);
                }

                // B. Fuzzy Match (Only if no strong match)
                if (!match) {
                    // Query specific candidates for this payment to avoid loading too much
                    // Allow +/- 0.01 amount difference and +/- 1 day
                    const candidates = await db('bank_statements')
                        .whereBetween('amount', [Number(payment.amount) - 0.01, Number(payment.amount) + 0.01])
                        .whereRaw(`credited_at >= ?::timestamp - interval '1 day'`, [payment.created_at])
                        .whereRaw(`credited_at <= ?::timestamp + interval '1 day'`, [payment.created_at])
                        .whereNotExists(function () {
                            this.select('*').from('reconciliations').whereRaw('reconciliations.statement_id = bank_statements.statement_id');
                        })
                        .limit(5) // Safety limit
                        .select('*');

                    // Simple heuristic: if exactly 1 fuzzy match found, take it.
                    if (candidates.length === 1) {
                        match = candidates[0];
                    }
                }

                if (match) {
                    // Check Amount
                    if (Math.abs(Number(payment.amount) - Number(match.amount)) > 0.01) {
                        status = 'AMOUNT_MISMATCH';
                        reason = `Expected ${payment.amount}, got ${match.amount}`;
                        results.amountMismatch++;
                    } else {
                        status = 'MATCHED';
                        results.matched++;
                    }

                    // Insert Reconciliation Record
                    await db('reconciliations').insert({
                        payment_id: payment.payment_id,
                        statement_id: match.statement_id,
                        status,
                        reason
                    });

                    // Remove from map to prevent reusing same statement in this batch for another payment
                    // (Though unlikely with unique references, good for safety)
                    if (match.bank_reference) statementsMap.delete(match.bank_reference);

                } else {
                    // Decide strategy: Do we explicitly flag it as MISSING_IN_BANK?
                    // For now, let's leave it as unreconciled so it gets picked up again if data arrives later.
                    // Or we could insert a record with 'MISSING_IN_BANK' if it's older than X days.
                    // Following original logic recommendation: we don't insert 'MISSING_IN_BANK' yet to allow retry.
                    results.missingInBank++;
                }
            }

            processedCount += payments.length;
        }

        // 2. Check for MISSING_IN_APP (Statements without payments)
        // This query finds statements older than 2 days that are still unreconciled
        // This is separate from the batch process above.
        /*
        const danglingStatements = await db('bank_statements')
             .whereRaw("credited_at < now() - interval '2 days'")
             .whereNotExists(function() { ... })
             ...
        */
        // (Skipping implementation for brevity as it wasn't strictly requested, but good to note)

        results.total = processedCount;
        return results;
    }
}
