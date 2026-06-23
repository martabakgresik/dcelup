interface Env {
  DB: D1Database;
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
  // Simple auth check
  const authHeader = context.request.headers.get('Authorization');
  if (authHeader !== 'Bearer dcelup-admin-token-123') {
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
