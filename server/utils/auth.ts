import type { JwtPayload } from 'jsonwebtoken'
import type { H3Event } from 'h3'

export async function requireAuth(event: H3Event): Promise<JwtPayload> {
  const authHeader = getRequestHeader(event, 'authorization')

  if (!authHeader?.startsWith('Bearer ')) {
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
  }

  const token = authHeader.substring(7)

  try {
    return await verifyToken(token)
  } catch {
    throw createError({ statusCode: 401, statusMessage: 'Invalid token' })
  }
}
