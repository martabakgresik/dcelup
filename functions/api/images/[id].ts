interface Env {
  STORAGE: R2Bucket;
}

export const onRequestGet: PagesFunction<Env> = async (context) => {
  try {
    const id = context.params.id as string;
    
    if (!id) {
      return new Response('Bad Request', { status: 400 });
    }

    const object = await context.env.STORAGE.get(id);

    if (object === null) {
      return new Response('Not Found', { status: 404 });
    }

    const headers = new Headers();
    object.writeHttpMetadata(headers);
    headers.set('etag', object.httpEtag);
    // Add cache control for better performance (cache for 1 hour)
    headers.set('Cache-Control', 'public, max-age=3600');

    return new Response(object.body, {
      headers,
    });
  } catch (err: any) {
    return new Response(err.message, { status: 500 });
  }
};
