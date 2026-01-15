import { FastifyInstance } from 'fastify';
import knex from 'knex';
import config from '../../knexfile';
import { ReconciliationService } from '../services/reconciliation.service';

const db = knex(config.development);
const service = new ReconciliationService();

export async function reconcileRoutes(server: FastifyInstance) {
    server.post('/reconcile/run', async (request, reply) => {
        try {
            const stats = await service.runReconciliation();
            return reply.send({ message: 'Reconciliation run completed', stats });
        } catch (error) {
            request.log.error(error);
            return reply.status(500).send({ message: 'Reconciliation failed' });
        }
    });

    server.get('/reconciliation/report', async (request, reply) => {
        try {
            const { date } = request.query as { date?: string };
            // Default to today if not provided, or all time? Prompt says ?date=YYYY-MM-DD
            const query = db('reconciliations')
                .join('internal_payments', 'reconciliations.payment_id', 'internal_payments.payment_id')
                .join('bank_statements', 'reconciliations.statement_id', 'bank_statements.statement_id')
                .select(
                    'reconciliations.*',
                    'internal_payments.order_id',
                    'internal_payments.amount as internal_amount',
                    'bank_statements.bank_reference',
                    'bank_statements.amount as bank_amount'
                );

            if (date) {
                query.whereRaw('DATE(reconciliations.reconciled_at) = ?', [date]);
            }

            const data = await query;
            return reply.send(data);
        } catch (error) {
            request.log.error(error);
            return reply.status(500).send({ message: 'Failed to fetch report' });
        }
    });

    server.get('/reconciliation/summary', async (request, reply) => {
        try {
            const summary = await db('reconciliations')
                .select('status')
                .count('* as count')
                .groupBy('status');
            return reply.send(summary);
        } catch (error) {
            request.log.error(error);
            return reply.status(500).send({ message: 'Failed to fetch summary' });
        }
    });
}
