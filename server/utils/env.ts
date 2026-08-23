export function useEnvConfig() {
  return {
    jitsiSecret: process.env.JITSI_SECRET || 'JITSI_SECRET',
    defaultRoom: process.env.DEFAULT_ROOM || 'DEFAULT_ROOM',
    jitsiUrl: process.env.JITSI_URL || 'JITSI_URL',
    allowedSub: process.env.ALLOWED_SUB || '*',
    allowedRoom: process.env.ALLOWED_ROOM || '*',
    keycloakConfigPath: process.env.KEYCLOAK_CONFIG_PATH || './config/keycloak.json',
  }
}
