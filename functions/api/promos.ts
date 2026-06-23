import { verifyAuth } from '../_shared/auth';

interface Env {
  DB: D1Database;
  JWT_SECRET?: string;
}

export const onRequestGet: PagesFunction<Env> = async (context) => {
  const { results } = await context.env.DB.prepare("SELECT * FROM promos ORDER BY id DESC").all();
  return Response.json({ success: true, data: results });
};

export const onRequestPost: PagesFunction<Env> = async (context) => {
  const isAuth = await verifyAuth(context.request, context.env.JWT_SECRET || 'fallback-secret-for-dev');
  if (!isAuth) return Response.json({ error: 'Unauthorized' }, { status: 401 });
  const body = await context.request.json<any>();
  try {
    await context.env.DB.prepare(
      "INSERT INTO promos (title, description, discount_value, valid_until, is_active, discount_type) VALUES (?, ?, ?, ?, ?, ?)"
    ).bind(body.title, body.description, body.discount_value, body.valid_until, body.is_active ? 1 : 0, body.discount_type || 'nominal').run();
    return Response.json({ success: true });
  } catch (err: any) {
    return Response.json({ success: false, error: err.message }, { status: 500 });
  }
};

export const onRequestDelete: PagesFunction<Env> = async (context) => {
  const isAuth = await verifyAuth(context.request, context.env.JWT_SECRET || 'fallback-secret-for-dev');
  if (!isAuth) return Response.json({ error: 'Unauthorized' }, { status: 401 });
  const url = new URL(context.request.url);
  const id = url.searchParams.get('id');
  if (!id) return Response.json({ error: 'Missing ID' }, { status: 400 });
  
  try {
    await context.env.DB.prepare("DELETE FROM promos WHERE id = ?").bind(id).run();
    return Response.json({ success: true });
  } catch (err: any) {
    return Response.json({ success: false, error: err.message }, { status: 500 });
  }
};
