import { FastifyInstance } from 'fastify';
import knex from 'knex';
import config from '../../knexfile';
import { parseStatementCSV } from '../utils/csvParser';

const db = knex(config.development);

export async function statementRoutes(server: FastifyInstance) {
    server.post('/statements/import', async (request, reply) => {
        const contentType = request.headers['content-type'];
        if (contentType !== 'text/csv' && contentType !== 'application/vnd.ms-excel') {
            // Basic check, though usually we want multipart
            // proceeding with assumption that body is string/buffer of CSV
        }

        try {
            // Fastify parses body based on content type. We might need to handle raw body if not configured.
            // For now assuming we receive the raw buffer/string if content-type is text/csv
            // We might need to register content type parser
            const buffer = request.body as Buffer;

            if (!Buffer.isBuffer(buffer) && typeof buffer !== 'string') {
                return reply.status(400).send({ message: 'Invalid file format. Please upload text/csv.' });
            }

            const rows = await parseStatementCSV(Buffer.isBuffer(buffer) ? buffer : Buffer.from(buffer));

            // Batch insert with conflict handling
            let insertedRaw = 0;
            const params = rows.map(row => ({
                bank_reference: row.bank_reference,
                amount: row.amount,
                narration: row.narration,
                credited_at: row.credited_at,
                source: row.source,
                raw_payload: row
            }));

            // Knex batch insert or direct insert with onConflict
            // Note: 'bank_statements' has unique constraint on [bank_reference, source]
            const result = await db('bank_statements')
                .insert(params)
                .onConflict(['bank_reference', 'source'])
                .ignore() // Skip duplicates
                .returning('statement_id');

            return reply.send({
                message: 'Import processed',
                processed: rows.length,
                inserted: result ? result.length : 0
            });

        } catch (error) {
            request.log.error(error);
            return reply.status(500).send({ message: 'Failed to process statement' });
        }
    });
}
