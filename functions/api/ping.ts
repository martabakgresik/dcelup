interface Env {
  DB: D1Database;
  STORAGE: R2Bucket;
}

export const onRequest: PagesFunction<Env> = async (context) => {
  return Response.json({
    message: "Pong from D'CELUP API!",
    d1_bound: !!context.env.DB,
    r2_bound: !!context.env.STORAGE,
  });
};
