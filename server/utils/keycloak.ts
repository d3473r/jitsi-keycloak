import { readFileSync } from 'node:fs'
import { resolve as resolvePath } from 'node:path'
import jwt from 'jsonwebtoken'
import jwksClient from 'jwks-rsa'

interface KeycloakConfig {
  realm: string
  'auth-server-url': string
  'ssl-required': string
  resource: string
  'public-client': boolean
  'confidential-port': number
}

let cachedConfig: KeycloakConfig | null = null
let cachedClient: ReturnType<typeof jwksClient> | null = null

export function getKeycloakConfig(): KeycloakConfig {
  if (cachedConfig) return cachedConfig

  const config = useRuntimeConfig()
  const configPath = resolvePath(config.keycloakConfigPath)
  const raw = readFileSync(configPath, 'utf-8')
  cachedConfig = JSON.parse(raw)
  return cachedConfig
}

function getJwksClient() {
  if (cachedClient) return cachedClient

  const kcConfig = getKeycloakConfig()
  const baseUrl = kcConfig['auth-server-url'].replace(/\/$/, '')
  const jwksUri = `${baseUrl}/realms/${kcConfig.realm}/protocol/openid-connect/certs`

  cachedClient = jwksClient({
    jwksUri,
    cache: true,
    cacheMaxAge: 600000,
  })

  return cachedClient
}

export async function verifyToken(token: string): Promise<jwt.JwtPayload> {
  const decoded = jwt.decode(token, { complete: true }) as jwt.JwtPayload | null
  if (!decoded?.header?.kid) {
    throw new Error('Invalid token: missing kid in header')
  }

  const client = getJwksClient()
  const key = await client.getSigningKey(decoded.header.kid)
  const signingKey = key.getPublicKey()

  return new Promise((resolve, reject) => {
    jwt.verify(token, signingKey, { algorithms: ['RS256'] }, (err, payload) => {
      if (err) {
        reject(err)
        return
      }
      resolve(payload as jwt.JwtPayload)
    })
  })
}
