<template>
  <header class="sticky top-0 z-50 bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg">
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div class="flex h-16 items-center justify-between">
        <h1 class="text-lg font-semibold tracking-tight">Jitsi Keycloak</h1>
        <div class="flex items-center gap-3">
          <img
            v-if="avatar"
            :src="avatar"
            alt="Avatar"
            class="h-9 w-9 rounded-full border-2 border-white/30 object-cover"
          />
          <span class="hidden text-sm font-medium sm:inline">{{ profile?.firstName }} {{ profile?.lastName }}</span>
          <button
            @click="logout"
            class="rounded-lg p-2 transition-colors hover:bg-white/20"
            title="Logout"
          >
            <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
const { profile, avatar, logout } = useKeycloak()
</script>
