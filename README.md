# Payment Reconciliation System

A production-grade backend system to reconcile internal payment records with bank/payment-gateway statements.

## Features
- **Payment Recording**: Idempotent API to record internal payments via `POST /payments`.
- **Statement Ingestion**: Upload CSV bank/gateway statements via `POST /statements/import`.
- **Reconciliation Engine**: Matches payments by Reference (strong) or Amount + Time (fuzzy). **Scalable batch processing** handles large datasets via cursors.
- **Reporting**: Generate daily reports and mismatch lists.

## Architecture
- **Language**: Node.js + TypeScript
- **Framework**: Fastify
- **Database**: PostgreSQL
- **Query Builder**: Knex.js
- **Validation**: Zod
- **Time**: Day.js

### Database Schema
- `internal_payments`: Stores application-side payment records.
- `bank_statements`: Stores rows from imported bank CSVs.
- `reconciliations`: Stores match results (1-to-1 link between payment and statement).

## Prerequisities
- Node.js >= 18
- PostgreSQL (or run via Docker)

## Getting Started

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Start Database**
   ```bash
   docker-compose up -d
   ```
   Or configure `knexfile.ts` with your local Postgres credentials.

3. **Run Migrations**
   ```bash
   npm run migrate:latest
   ```

4. **Start Server**
   ```bash
   npm run dev
   ```

## API Usage

### 1. Create Payment
```http
POST /payments
Idempotency-Key: unique-req-123
Content-Type: application/json

{
  "order_id": "ORD-1001",
  "user_id": "user_55",
  "amount": 500.00,
  "currency": "USD",
  "method": "CARD",
  "gateway_reference": "ref_12345"
}
```

### 2. Import Statement
```http
POST /statements/import
Content-Type: text/csv

bank_reference,amount,narration,credited_at,source
ref_12345,500.00,Payment for ORD-1001,2024-01-01T10:00:00Z,GATEWAY
```

### 3. Run Reconciliation
```http
POST /reconcile/run
```

### 4. Get Report
```http
GET /reconciliation/report?date=2024-01-01
```

```bash
npm test
```
The project includes a comprehensive test suite using **Jest**:
- **Unit Tests**: Cover the core reconciliation logic (Strong match, Fuzzy match, Amount mismatch).
- **API Tests**: Verify route availability and validation.
