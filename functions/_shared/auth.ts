import jwt from '@tsndr/cloudflare-worker-jwt'

export async function verifyAuth(request: Request, secret: string): Promise<boolean> {
  const authHeader = request.headers.get('Authorization')
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return false
  }

  const token = authHeader.split(' ')[1]
  try {
    const isValid = await jwt.verify(token, secret)
    return isValid
  } catch (e) {
    return false
  }
}
