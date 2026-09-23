import { sql } from '@/lib/db';

function checkAuth(request) {
  const cookie = request.headers.get('cookie') ?? '';
  const match = cookie.match(/admin_token=([^;]+)/);
  const token = match?.[1];
  const expected = Buffer.from(process.env.ADMIN_PASSWORD ?? '').toString('base64');
  return token === expected;
}

export async function GET(request, { params }) {
  if (!checkAuth(request)) return Response.json({ error: 'Non autorisé.' }, { status: 401 });
  const { id } = await params;
  const messages = await sql`
    SELECT role, content, created_at FROM messages
    WHERE session_id = ${id} ORDER BY created_at ASC
  `;
  return Response.json({ messages });
}
