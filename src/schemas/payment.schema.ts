import { z } from 'zod';

export const createPaymentSchema = z.object({
    amount: z.number().positive(),
    currency: z.string().length(3),
    method: z.enum(['UPI', 'CARD', 'NETBANKING']),
    order_id: z.string(),
    user_id: z.string(),
    gateway_reference: z.string().optional(),
});

export type CreatePaymentInput = z.infer<typeof createPaymentSchema>;
