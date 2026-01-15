"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Payline = void 0;
class Payline {
    constructor(options = {}) {
        this.baseUrl = options.baseUrl || 'http://localhost:3000';
        this.apiKey = options.apiKey;
    }
    async request(path, options = {}) {
        const url = `${this.baseUrl}${path}`;
        const headers = {
            'Content-Type': 'application/json',
            ...(this.apiKey ? { 'Authorization': `Bearer ${this.apiKey}` } : {}),
            ...options.headers,
        };
        const response = await fetch(url, { ...options, headers });
        if (!response.ok) {
            const error = await response.text();
            throw new Error(`Payline API Error: ${response.status} ${response.statusText} - ${error}`);
        }
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
            return response.json();
        }
        return response.text();
    }
    /**
     * Ingest a bank statement or raw CSV payload.
     * Maps to POST /statements/import
     */
    async ingestStatement(csvData) {
        return this.request('/statements/import', {
            method: 'POST',
            headers: {
                'Content-Type': 'text/csv' // or 'application/vnd.ms-excel' as per server check
            },
            body: csvData
        });
    }
    /**
     * Record an internal payment.
     * Maps to POST /payments
     */
    async createPayment(payment) {
        return this.request('/payments', {
            method: 'POST',
            body: JSON.stringify(payment)
        });
    }
    /**
     * Trigger the reconciliation engine.
     * Maps to POST /reconcile/run
     */
    async reconcile() {
        // In our strict API this is 'run', but exposing as 'reconcile' matches the narrative better
        return this.request('/reconcile/run', {
            method: 'POST'
        });
    }
    /**
     * Fetch the reconciliation report.
     * Maps to GET /reconciliation/report
     */
    async getReport(date) {
        const query = date ? `?date=${date}` : '';
        return this.request(`/reconciliation/report${query}`, {
            method: 'GET'
        });
    }
    /**
     * Fetch high-level summary stats.
     * Maps to GET /reconciliation/summary
     */
    async getSummary() {
        return this.request('/reconciliation/summary', {
            method: 'GET'
        });
    }
}
exports.Payline = Payline;
