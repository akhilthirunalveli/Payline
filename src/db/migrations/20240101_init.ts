import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
    // Internal Payments Table
    await knex.schema.createTable("internal_payments", (table) => {
        table.uuid("payment_id").primary().defaultTo(knex.raw("gen_random_uuid()"));
        table.string("order_id").notNullable();
        table.string("user_id").notNullable();
        table.decimal("amount", 14, 2).notNullable(); // supports large amounts
        table.string("currency", 3).notNullable();
        table.string("method").notNullable(); // UPI, CARD, etc
        table.string("status").notNullable(); // SUCCESS, FAILED, PENDING, REFUNDED
        table.string("gateway_reference").nullable();
        table.string("idempotency_key").nullable().unique();
        table.timestamp("created_at").defaultTo(knex.fn.now());

        table.index(["order_id"]);
        table.index(["gateway_reference"]);
    });

    // Bank/Gateway Statements Table
    await knex.schema.createTable("bank_statements", (table) => {
        table.uuid("statement_id").primary().defaultTo(knex.raw("gen_random_uuid()"));
        table.string("bank_reference").notNullable();
        table.decimal("amount", 14, 2).notNullable();
        table.text("narration").nullable();
        table.timestamp("credited_at").notNullable();
        table.string("source").notNullable(); // BANK, GATEWAY
        table.jsonb("raw_payload").nullable(); // Store original row for audit

        table.unique(["bank_reference", "source"]); // Prevent duplicate imports of same txn
    });

    // Reconciliation Table
    await knex.schema.createTable("reconciliations", (table) => {
        table.uuid("reconciliation_id").primary().defaultTo(knex.raw("gen_random_uuid()"));
        table.uuid("payment_id").references("payment_id").inTable("internal_payments").onDelete("CASCADE");
        table.uuid("statement_id").references("statement_id").inTable("bank_statements").onDelete("CASCADE");
        table.string("status").notNullable(); // MATCHED, MISSING_IN_BANK, MISSING_IN_APP, AMOUNT_MISMATCH
        table.text("reason").nullable();
        table.timestamp("reconciled_at").defaultTo(knex.fn.now());

        table.unique(["payment_id", "statement_id"]); // One-to-one match
    });
}

export async function down(knex: Knex): Promise<void> {
    await knex.schema.dropTableIfExists("reconciliations");
    await knex.schema.dropTableIfExists("bank_statements");
    await knex.schema.dropTableIfExists("internal_payments");
}
