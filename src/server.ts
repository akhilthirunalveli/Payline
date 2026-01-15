import Fastify, { FastifyInstance } from 'fastify';

const server: FastifyInstance = Fastify({
    logger: true
});

server.get('/health', async (request, reply) => {
    return { status: 'ok' };
});

import { paymentRoutes } from './routes/payment.routes';
import { statementRoutes } from './routes/statement.routes';
import { reconcileRoutes } from './routes/reconcile.routes';

server.register(paymentRoutes);
server.register(statementRoutes);
server.register(reconcileRoutes);

const start = async () => {
    try {
        await server.listen({ port: 3000, host: '0.0.0.0' });
        console.log('Server is running on port 3000');
    } catch (err) {
        server.log.error(err);
        process.exit(1);
    }
};

start();
