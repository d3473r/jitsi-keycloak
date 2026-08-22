export default defineEventHandler(async (event) => {
  const profile = await requireAuth(event)
  const config = useRuntimeConfig()
  const query = getQuery(event)

  const avatar = query.avatar as string | undefined

  const token = signJitsiJwt({
    firstName: profile.given_name,
    lastName: profile.family_name,
    email: profile.email,
    avatar,
    nbf: profile.auth_time,
    exp: profile.exp,
  }, config.jitsiSecret, config.allowedSub, config.allowedRoom)

  return {
    token,
    jitsiUrl: config.jitsiUrl,
    defaultRoom: config.defaultRoom,
  }
})
