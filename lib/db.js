import { neon } from '@neondatabase/serverless';

let _sql = null;
function getConn() {
  if (!_sql) _sql = neon(process.env.DATABASE_URL);
  return _sql;
}
export function sql(strings, ...values) { return getConn()(strings, ...values); }

let ready = false;

export async function ensureTables() {
  if (ready) return;
  try {
    await sql`
      CREATE TABLE IF NOT EXISTS sessions (
        id TEXT PRIMARY KEY,
        created_at TIMESTAMPTZ DEFAULT NOW(),
        updated_at TIMESTAMPTZ DEFAULT NOW(),
        message_count INTEGER DEFAULT 0
      )
    `;
    await sql`
      CREATE TABLE IF NOT EXISTS messages (
        id SERIAL PRIMARY KEY,
        session_id TEXT REFERENCES sessions(id) ON DELETE CASCADE,
        role TEXT NOT NULL CHECK (role IN ('user', 'assistant')),
        content TEXT NOT NULL,
        created_at TIMESTAMPTZ DEFAULT NOW()
      )
    `;
    await sql`CREATE INDEX IF NOT EXISTS idx_messages_session ON messages(session_id)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_sessions_updated ON sessions(updated_at DESC)`;
  } catch (err) {
    const msg = err.message ?? '';
    if (!msg.includes('already exists') && !msg.includes('duplicate key')) throw err;
  }
  ready = true;
}
