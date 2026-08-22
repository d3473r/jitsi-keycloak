export default defineNuxtConfig({
  ssr: false,
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  devServer: {
    port: 3000,
  },
  modules: ['@nuxtjs/tailwindcss'],
  runtimeConfig: {
    jitsiSecret: process.env.JITSI_SECRET || 'JITSI_SECRET',
    defaultRoom: process.env.DEFAULT_ROOM || 'DEFAULT_ROOM',
    jitsiUrl: process.env.JITSI_URL || 'JITSI_URL',
    allowedSub: process.env.ALLOWED_SUB || '*',
    allowedRoom: process.env.ALLOWED_ROOM || '*',
    keycloakConfigPath: process.env.KEYCLOAK_CONFIG_PATH || './config/keycloak.json',
  },
  app: {
    head: {
      title: 'Jitsi Keycloak',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      ],
    },
  },
})
