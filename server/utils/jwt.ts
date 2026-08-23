import jwt from 'jsonwebtoken'

interface JitsiSignOptions {
  firstName: string
  lastName: string
  email: string
  avatar?: string
  nbf?: number
  exp?: number
}

export function signJitsiJwt(
  options: JitsiSignOptions,
  secret: string,
  allowedSub: string,
  allowedRoom: string,
): string {
  return jwt.sign({
    context: {
      user: {
        name: `${options.firstName} ${options.lastName}`.trim(),
        email: options.email,
        avatar: options.avatar,
        lobby_bypass: true,
      },
    },
    aud: 'jitsi',
    iss: 'jitsi',
    nbf: options.nbf,
    exp: options.exp,
    sub: allowedSub,
    room: allowedRoom,
  }, String(secret))
}
