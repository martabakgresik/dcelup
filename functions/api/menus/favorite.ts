interface Env {
  DB: D1Database;
}

export const onRequestPost: PagesFunction<Env> = async (context) => {
  try {
    const body = await context.request.json<any>();
    const id = body.id;
    const action = body.action;

    if (!id || (action !== 'add' && action !== 'remove')) {
      return Response.json({ error: 'Invalid request' }, { status: 400 });
    }

    if (action === 'add') {
      await context.env.DB.prepare(
        "UPDATE menus SET favorites_count = COALESCE(favorites_count, 0) + 1 WHERE id = ?"
      ).bind(id).run();
    } else {
      await context.env.DB.prepare(
        "UPDATE menus SET favorites_count = MAX(COALESCE(favorites_count, 0) - 1, 0) WHERE id = ?"
      ).bind(id).run();
    }

    return Response.json({ success: true });
  } catch (err: any) {
    return Response.json({ success: false, error: err.message }, { status: 500 });
  }
};
