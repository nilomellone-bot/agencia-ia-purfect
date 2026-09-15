export type SqlPrimitive = string | number | boolean | null | Date;
export type QueryResult<T> = { rows: T[]; rowCount: number };

/**
 * Minimal database contract for Agencia IA Purfect.
 * Business services depend on this interface, never on Neon/Supabase/etc.
 * This keeps the provider replaceable without rewriting the application.
 */
export interface Database {
  query<T = Record<string, unknown>>(sql: string, params?: SqlPrimitive[]): Promise<QueryResult<T>>;
  transaction<T>(work: (db: Database) => Promise<T>): Promise<T>;
}

export class DatabaseNotConfiguredError extends Error {
  constructor() {
    super('La base PostgreSQL todavía no está conectada. La app puede seguir funcionando en modo demo.');
    this.name = 'DatabaseNotConfiguredError';
  }
}

export function hasDatabaseConfiguration(env: NodeJS.ProcessEnv = process.env) {
  return Boolean(env.DATABASE_URL);
}
