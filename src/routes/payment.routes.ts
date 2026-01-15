import { FastifyInstance } from 'fastify';
import knex from 'knex';
import config from '../../knexfile';
import { createPaymentSchema, CreatePaymentInput } from '../schemas/payment.schema';

const db = knex(config.development); // In real app, inject this

export async function paymentRoutes(server: FastifyInstance) {
    server.post<{ Body: CreatePaymentInput }>('/payments', async (request, reply) => {
        const result = createPaymentSchema.safeParse(request.body);

        if (!result.success) {
            return reply.status(400).send(result.error);
        }

        const { amount, currency, method, order_id, user_id, gateway_reference } = result.data;
        const idempotencyKey = request.headers['idempotency-key'] as string;

        if (idempotencyKey) {
            const existing = await db('internal_payments').where('idempotency_key', idempotencyKey).first();
            if (existing) {
                return reply.status(200).send(existing);
            }
        }

        try {
            const [payment] = await db('internal_payments').insert({
                amount,
                currency,
                method,
                order_id,
                user_id,
                gateway_reference,
                status: 'PENDING',
                idempotency_key: idempotencyKey
            }).returning('*');

            return reply.status(201).send(payment);
        } catch (error) {
            request.log.error(error);
            return reply.status(500).send({ message: 'Internal Server Error' });
        }
    });
}
