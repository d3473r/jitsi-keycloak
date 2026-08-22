import type Keycloak from 'keycloak-js'
import type { KeycloakProfile } from 'keycloak-js'

declare module '#app' {
  interface NuxtApp {
    $keycloak: Keycloak
    $profile: KeycloakProfile
  }
}

export {}
