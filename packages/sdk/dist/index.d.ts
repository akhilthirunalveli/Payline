export interface PaylineOptions {
    baseUrl?: string;
    apiKey?: string;
}
export interface PaymentInput {
    amount: number;
    currency: string;
    method: 'CARD' | 'BANK_TRANSFER';
    order_id: string;
    user_id: string;
    gateway_reference: string;
}
export declare class Payline {
    private baseUrl;
    private apiKey?;
    constructor(options?: PaylineOptions);
    private request;
    /**
     * Ingest a bank statement or raw CSV payload.
     * Maps to POST /statements/import
     */
    ingestStatement(csvData: string): Promise<any>;
    /**
     * Record an internal payment.
     * Maps to POST /payments
     */
    createPayment(payment: PaymentInput): Promise<any>;
    /**
     * Trigger the reconciliation engine.
     * Maps to POST /reconcile/run
     */
    reconcile(): Promise<any>;
    /**
     * Fetch the reconciliation report.
     * Maps to GET /reconciliation/report
     */
    getReport(date?: string): Promise<any>;
    /**
     * Fetch high-level summary stats.
     * Maps to GET /reconciliation/summary
     */
    getSummary(): Promise<any>;
}
