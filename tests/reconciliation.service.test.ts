import { ReconciliationService } from '../src/services/reconciliation.service';
import knex from 'knex';

// Define the mock factory
jest.mock('knex', () => {
    // mockDb must be a function because it's called as db('table')
    // It should return itself to allow chaining off the table call
    const mockDb: any = jest.fn(() => mockDb);

    // Main function returns the mockDb instance
    const mockKnexFn = jest.fn(() => mockDb);
    (mockKnexFn as any).fn = { now: jest.fn() };

    return {
        __esModule: true,
        default: mockKnexFn,
    };
});

describe('ReconciliationService', () => {
    let service: ReconciliationService;
    let mockDb: any;

    beforeEach(() => {
        jest.clearAllMocks();

        // Retrieve the mocked DB instance
        mockDb = knex({ client: 'pg' });

        // Enforce chaining for all methods used
        const returnSelf = () => mockDb;

        // Attach methods to the callable function
        mockDb.insert = jest.fn(returnSelf);
        mockDb.where = jest.fn(returnSelf);
        mockDb.whereNotExists = jest.fn(returnSelf);
        mockDb.whereIn = jest.fn(returnSelf);
        mockDb.whereBetween = jest.fn(returnSelf);
        mockDb.whereRaw = jest.fn(returnSelf);
        mockDb.orderBy = jest.fn(returnSelf);
        mockDb.limit = jest.fn(returnSelf);
        mockDb.from = jest.fn(returnSelf);
        mockDb.returning = jest.fn(returnSelf);

        // mockDb.select behavior
        mockDb.select = jest.fn().mockResolvedValue([]);

        service = new ReconciliationService();
    });

    test('should reconcile payments with strong matches', async () => {
        const mockPayment = {
            payment_id: 'p1',
            amount: 100,
            gateway_reference: 'ref_123',
            created_at: new Date('2024-01-01')
        };

        const mockStatement = {
            statement_id: 's1',
            amount: 100,
            bank_reference: 'ref_123',
            credited_at: new Date('2024-01-01')
        };

        mockDb.select
            .mockResolvedValueOnce([mockPayment])
            .mockResolvedValueOnce([mockStatement])
            .mockResolvedValueOnce([]);

        const result = await service.runReconciliation();

        expect(result.matched).toBe(1);
        expect(mockDb.insert).toHaveBeenCalledWith({
            payment_id: 'p1',
            statement_id: 's1',
            status: 'MATCHED',
            reason: null
        });
    });

    test('should handle amount mismatch', async () => {
        const mockPayment = {
            payment_id: 'p1',
            amount: 100,
            gateway_reference: 'ref_123',
            created_at: new Date('2024-01-01')
        };

        const mockStatement = {
            statement_id: 's1',
            amount: 50, // Mismatch
            bank_reference: 'ref_123'
        };

        mockDb.select
            .mockResolvedValueOnce([mockPayment])
            .mockResolvedValueOnce([mockStatement])
            .mockResolvedValueOnce([]);

        const result = await service.runReconciliation();

        expect(result.amountMismatch).toBe(1);
        expect(mockDb.insert).toHaveBeenCalledWith(expect.objectContaining({
            status: 'AMOUNT_MISMATCH'
        }));
    });

    test('should attempt fuzzy match if strong match fails', async () => {
        const mockPayment = {
            payment_id: 'p1',
            amount: 100,
            gateway_reference: 'ref_missing',
            created_at: new Date('2024-01-01')
        };

        const mockFuzzyMatch = {
            statement_id: 's1',
            amount: 100,
            bank_reference: 'ref_other',
            credited_at: new Date('2024-01-01')
        };

        mockDb.select
            .mockResolvedValueOnce([mockPayment]) // 1. Payments
            .mockResolvedValueOnce([])            // 2. Strong Matches
            .mockResolvedValueOnce([mockFuzzyMatch]) // 3. Fuzzy match query
            .mockResolvedValueOnce([]);           // 4. Next Batch

        const result = await service.runReconciliation();

        expect(result.matched).toBe(1);
        expect(mockDb.insert).toHaveBeenCalledWith(expect.objectContaining({
            statement_id: 's1',
            status: 'MATCHED'
        }));
    });
});
