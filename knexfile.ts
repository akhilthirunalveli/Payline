import type { Knex } from "knex";

// Update with your local postgres config or use env vars
const config: { [key: string]: Knex.Config } = {
    development: {
        client: "postgresql",
        connection: {
            database: "payline_db",
            user: "postgres",
            password: "password"
        },
        pool: {
            min: 2,
            max: 10
        },
        migrations: {
            tableName: "knex_migrations",
            directory: "./src/db/migrations"
        }
    },
    test: {
        client: "postgresql",
        connection: {
            database: "payline_test_db",
            user: "postgres",
            password: "password"
        },
        migrations: {
            directory: "./src/db/migrations"
        }
    }
};

export default config;
