<template>
  <div>
    <AppHeader />
    <main class="min-h-[calc(100vh-4rem)] bg-gradient-to-b from-gray-50 to-gray-100 py-12">
      <JitsiLoginForm
        v-if="config"
        :config="config"
      />
      <div v-else class="flex justify-center">
        <div class="h-12 w-12 animate-spin rounded-full border-b-2 border-indigo-600"></div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
interface JitsiConfig {
  token: string
  jitsiUrl: string
  defaultRoom: string
}

const { token, avatar } = useKeycloak()

const config = ref<JitsiConfig | null>(null)

onMounted(async () => {
  const response = await $fetch<JitsiConfig>('/api/config', {
    headers: { Authorization: `Bearer ${token}` },
    params: avatar.value ? { avatar: avatar.value } : undefined,
  })
  config.value = response
})
</script>
