import { sql, ensureTables } from '@/lib/db';

function checkAuth(request) {
  const cookie = request.headers.get('cookie') ?? '';
  const match = cookie.match(/admin_token=([^;]+)/);
  const token = match?.[1];
  const expected = Buffer.from(process.env.ADMIN_PASSWORD ?? '').toString('base64');
  return token === expected;
}

export async function GET(request) {
  if (!checkAuth(request)) return Response.json({ error: 'Non autorisé.' }, { status: 401 });

  try {
    await ensureTables();

    const [totalSessions] = await sql`SELECT COUNT(*) AS count FROM sessions`;
    const [totalMessages] = await sql`SELECT COUNT(*) AS count FROM messages`;
    const [todaySessions] = await sql`
      SELECT COUNT(*) AS count FROM sessions
      WHERE created_at >= NOW() - INTERVAL '24 hours'
    `;
    const [todayMessages] = await sql`
      SELECT COUNT(*) AS count FROM messages
      WHERE created_at >= NOW() - INTERVAL '24 hours'
    `;

    return Response.json({
      totalSessions: Number(totalSessions.count),
      totalMessages: Number(totalMessages.count),
      todaySessions: Number(todaySessions.count),
      todayMessages: Number(todayMessages.count),
    });
  } catch (err) {
    console.error('[admin/stats]', err);
    return Response.json({ error: err.message ?? 'Erreur base de données.' }, { status: 500 });
  }
}
