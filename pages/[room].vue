<template>
  <div class="flex min-h-screen items-center justify-center bg-gray-50">
    <div class="text-center">
      <div class="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-b-2 border-indigo-600"></div>
      <p class="text-gray-600">Redirecting to Jitsi...</p>
    </div>
  </div>
</template>

<script setup lang="ts">
interface JitsiConfig {
  token: string
  jitsiUrl: string
  defaultRoom: string
}

const { token, avatar } = useKeycloak()
const route = useRoute()

onMounted(async () => {
  const response = await $fetch<JitsiConfig>('/api/config', {
    headers: { Authorization: `Bearer ${token}` },
    params: avatar.value ? { avatar: avatar.value } : undefined,
  })

  const room = route.params.room as string
  const url = new URL(room, response.jitsiUrl)
  url.searchParams.append('jwt', response.token)
  window.location.href = encodeURI(url.href)
})
</script>
