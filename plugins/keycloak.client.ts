import Keycloak from 'keycloak-js'

export default defineNuxtPlugin(async (nuxtApp) => {
  try {
    const keycloak = new Keycloak('/api/keycloak.json')

    await keycloak.init({ onLoad: 'login-required', checkLoginIframe: false })

    sessionStorage.setItem('vue-token', keycloak.token!)
    sessionStorage.setItem('vue-refresh-token', keycloak.refreshToken!)

    const profile = await keycloak.loadUserProfile()

    setInterval(() => {
      keycloak.updateToken(70).then((refreshed) => {
        if (refreshed) {
          sessionStorage.setItem('vue-token', keycloak.token!)
          sessionStorage.setItem('vue-refresh-token', keycloak.refreshToken!)
          console.debug('Token refreshed')
        }
      }).catch(() => {
        console.error('Failed to refresh token')
      })
    }, 60000)

    nuxtApp.provide('keycloak', keycloak)
    nuxtApp.provide('profile', profile)
  } catch {
    console.error('Failed to initialize Keycloak')
    alert('Did you configure CORS correctly?')
  }
})
