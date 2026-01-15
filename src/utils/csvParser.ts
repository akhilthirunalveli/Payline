import { parse } from 'csv-parse';
import { Readable } from 'stream';

export interface BankStatementRow {
    bank_reference: string;
    amount: number;
    narration: string;
    credited_at: string;
    source: 'BANK' | 'GATEWAY';
}

export async function parseStatementCSV(buffer: Buffer): Promise<BankStatementRow[]> {
    const records: BankStatementRow[] = [];
    const validSources = ['BANK', 'GATEWAY'];

    const parser = parse({
        columns: true,
        skip_empty_lines: true,
        trim: true,
        cast: (value, context) => {
            if (context.column === 'amount') {
                return parseFloat(value);
            }
            return value;
        }
    }) as any;

    return new Promise((resolve, reject) => {
        parser.on('readable', () => {
            let record;
            while ((record = parser.read()) !== null) {
                // Basic validation
                if (!record.bank_reference || !record.amount || !record.credited_at) {
                    continue; // Skip invalid rows or throw
                }
                records.push({
                    bank_reference: record.bank_reference,
                    amount: record.amount,
                    narration: record.narration || '',
                    credited_at: record.credited_at,
                    source: validSources.includes(record.source) ? record.source : 'BANK' // Default or validate strict
                });
            }
        });
        parser.on('error', (err: Error) => {
            reject(err);
        });
        parser.on('end', () => {
            resolve(records);
        });

        // Write buffer to parser
        parser.write(buffer);
        parser.end();
    });
}
