interface Env {
  STORAGE: R2Bucket;
}

const checkAuth = (request: Request) => {
  return request.headers.get('Authorization') === 'Bearer dcelup-admin-token-123';
};

export const onRequestPost: PagesFunction<Env> = async (context) => {
  if (!checkAuth(context.request)) return Response.json({ error: 'Unauthorized' }, { status: 401 });
  
  try {
    const formData = await context.request.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return Response.json({ error: 'No file provided' }, { status: 400 });
    }

    // Generate a unique filename using timestamp and a random string
    const ext = file.name.split('.').pop() || 'jpg';
    const filename = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${ext}`;
    
    // Put the file into R2 bucket
    await context.env.STORAGE.put(filename, await file.arrayBuffer(), {
      httpMetadata: {
        contentType: file.type || 'application/octet-stream',
      }
    });

    const url = `/api/images/${filename}`;
    
    return Response.json({ success: true, url });
  } catch (err: any) {
    return Response.json({ success: false, error: err.message }, { status: 500 });
  }
};
