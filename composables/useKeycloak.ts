import type Keycloak from 'keycloak-js'
import type { KeycloakProfile } from 'keycloak-js'

export function useKeycloak() {
  const nuxtApp = useNuxtApp()
  const keycloak = nuxtApp.$keycloak as Keycloak | undefined
  const profile = nuxtApp.$profile as KeycloakProfile | undefined

  const avatar = computed(() => {
    const attr = profile?.attributes?.avatar
    return Array.isArray(attr) ? attr[0] : attr || null
  })

  return {
    keycloak,
    profile,
    token: keycloak?.token,
    avatar,
    logout: () => {
      keycloak?.logout({ redirectUri: window.location.origin })
    },
  }
}
