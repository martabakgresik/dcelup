interface Env {
  DB: D1Database;
}

const checkAuth = (request: Request) => {
  return request.headers.get('Authorization') === 'Bearer dcelup-admin-token-123';
};

export const onRequestGet: PagesFunction<Env> = async (context) => {
  try {
    const { results } = await context.env.DB.prepare(
      "SELECT * FROM menus ORDER BY id ASC"
    ).all();

    return Response.json({ success: true, data: results });
  } catch (error: any) {
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
};

export const onRequestPost: PagesFunction<Env> = async (context) => {
  if (!checkAuth(context.request)) return Response.json({ error: 'Unauthorized' }, { status: 401 });
  const body = await context.request.json<any>();
  try {
    await context.env.DB.prepare(
      "INSERT INTO menus (category, name, price, image_url) VALUES (?, ?, ?, ?)"
    ).bind(body.category, body.name, body.price, body.image_url || null).run();
    return Response.json({ success: true });
  } catch (err: any) {
    return Response.json({ success: false, error: err.message }, { status: 500 });
  }
};

export const onRequestPut: PagesFunction<Env> = async (context) => {
  if (!checkAuth(context.request)) return Response.json({ error: 'Unauthorized' }, { status: 401 });
  const body = await context.request.json<any>();
  try {
    await context.env.DB.prepare(
      "UPDATE menus SET category = ?, name = ?, price = ?, image_url = ? WHERE id = ?"
    ).bind(body.category, body.name, body.price, body.image_url || null, body.id).run();
    return Response.json({ success: true });
  } catch (err: any) {
    return Response.json({ success: false, error: err.message }, { status: 500 });
  }
};

export const onRequestDelete: PagesFunction<Env> = async (context) => {
  if (!checkAuth(context.request)) return Response.json({ error: 'Unauthorized' }, { status: 401 });
  const url = new URL(context.request.url);
  const id = url.searchParams.get('id');
  if (!id) return Response.json({ error: 'Missing ID' }, { status: 400 });
  try {
    await context.env.DB.prepare("DELETE FROM menus WHERE id = ?").bind(id).run();
    return Response.json({ success: true });
  } catch (err: any) {
    return Response.json({ success: false, error: err.message }, { status: 500 });
  }
};
