interface Env {
  ADMIN_PASSWORD?: string;
}

export const onRequestPost: PagesFunction<Env> = async (context) => {
  try {
    const body = await context.request.json<any>();
    const { password } = body;
    const correctPassword = context.env.ADMIN_PASSWORD || 'dcelupadmin';

    if (password === correctPassword) {
      // In a real app, generate a JWT. For this demo, we use a simple static token.
      return Response.json({ success: true, token: 'dcelup-admin-token-123' });
    }

    return Response.json({ success: false, error: 'Password salah' }, { status: 401 });
  } catch (err: any) {
    return Response.json({ success: false, error: err.message }, { status: 400 });
  }
};
