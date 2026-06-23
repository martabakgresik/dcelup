import jwt from '@tsndr/cloudflare-worker-jwt'

interface Env {
  ADMIN_PASSWORD?: string;
  JWT_SECRET?: string;
}

export const onRequestPost: PagesFunction<Env> = async (context) => {
  try {
    const body = await context.request.json<any>();
    const { password } = body;
    const correctPassword = context.env.ADMIN_PASSWORD || 'dcelupadmin';
    const jwtSecret = context.env.JWT_SECRET || 'fallback-secret-for-dev';

    if (password === correctPassword) {
      // Generate a JWT valid for 24 hours
      const token = await jwt.sign({
        admin: true,
        exp: Math.floor(Date.now() / 1000) + (24 * (60 * 60)) // 24 hours
      }, jwtSecret);
      
      return Response.json({ success: true, token });
    }

    return Response.json({ success: false, error: 'Password salah' }, { status: 401 });
  } catch (err: any) {
    return Response.json({ success: false, error: err.message }, { status: 400 });
  }
};
