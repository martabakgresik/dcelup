import { verifyAuth } from '../_shared/auth';

interface Env {
  STORAGE: R2Bucket;
  JWT_SECRET?: string;
}

export const onRequestPost: PagesFunction<Env> = async (context) => {
  const isAuth = await verifyAuth(context.request, context.env.JWT_SECRET || 'fallback-secret-for-dev');
  if (!isAuth) return Response.json({ error: 'Unauthorized' }, { status: 401 });
  
  try {
    const formData = await context.request.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return Response.json({ error: 'No file provided' }, { status: 400 });
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      return Response.json({ error: 'Invalid file type. Only images are allowed.' }, { status: 400 });
    }

    // Validate file size (max 5MB)
    const MAX_SIZE = 5 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      return Response.json({ error: 'File size exceeds 5MB limit.' }, { status: 400 });
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
