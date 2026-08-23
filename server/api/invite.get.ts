export default defineEventHandler(async (event) => {
  await requireAuth(event)
  const config = useEnvConfig()
  const query = getQuery(event)

  const name = (query.name as string) || ''
  const now = Math.floor(Date.now() / 1000)

  const token = signJitsiJwt({
    firstName: name,
    lastName: '',
    email: '',
    nbf: now,
    exp: now + 3600,
  }, config.jitsiSecret, config.allowedSub, config.allowedRoom)

  return { token }
})
