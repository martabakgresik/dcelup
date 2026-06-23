import { verifyAuth } from '../_shared/auth';

interface Env {
  DB: D1Database;
  JWT_SECRET?: string;
}

export const onRequestGet: PagesFunction<Env> = async (context) => {
  const { results } = await context.env.DB.prepare("SELECT * FROM settings").all();
  // Convert array of {key, value} to an object
  const settingsObj = results.reduce((acc: any, row: any) => {
    acc[row.key] = row.value;
    return acc;
  }, {});
  return Response.json({ success: true, data: settingsObj });
};

export const onRequestPut: PagesFunction<Env> = async (context) => {
  const isAuth = await verifyAuth(context.request, context.env.JWT_SECRET || 'fallback-secret-for-dev');
  if (!isAuth) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await context.request.json<any>();
    const statements = Object.keys(body).map(key => 
      context.env.DB.prepare("UPDATE settings SET value = ? WHERE key = ?").bind(String(body[key]), key)
    );
    
    await context.env.DB.batch(statements);
    return Response.json({ success: true });
  } catch (err: any) {
    return Response.json({ success: false, error: err.message }, { status: 500 });
  }
};
