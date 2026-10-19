<template>
  <div class="mx-auto max-w-md">
    <div class="rounded-2xl bg-white p-8 shadow-xl ring-1 ring-gray-200/50 dark:bg-gray-900 dark:ring-gray-800">
      <h2 class="mb-6 text-2xl font-bold text-gray-900 dark:text-white">Login</h2>
      <div class="space-y-4">
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">First Name</label>
            <input
              :value="profile?.firstName"
              disabled
              class="w-full cursor-not-allowed rounded-lg border border-gray-300 bg-gray-50 px-3 py-2 text-sm text-gray-500 dark:border-gray-700 dark:bg-gray-800"
            />
          </div>
          <div>
            <label class="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Last Name</label>
            <input
              :value="profile?.lastName"
              disabled
              class="w-full cursor-not-allowed rounded-lg border border-gray-300 bg-gray-50 px-3 py-2 text-sm text-gray-500 dark:border-gray-700 dark:bg-gray-800"
            />
          </div>
        </div>
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
            <input
              :value="profile?.email"
              disabled
              class="w-full cursor-not-allowed rounded-lg border border-gray-300 bg-gray-50 px-3 py-2 text-sm text-gray-500 dark:border-gray-700 dark:bg-gray-800"
            />
          </div>
          <div>
            <label class="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Room</label>
            <input
              v-model="room"
              @keyup.enter="openJitsi"
              class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:focus:border-indigo-400 dark:focus:ring-indigo-400/20"
              placeholder="Enter room name"
            />
          </div>
        </div>
        <button
          @click="openJitsi"
          :disabled="!room"
          class="w-full rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-gray-400 dark:hover:bg-indigo-500 dark:disabled:bg-gray-700"
        >
          Open Jitsi
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface JitsiConfig {
  token: string
  jitsiUrl: string
  defaultRoom: string
}

const props = defineProps<{
  config: JitsiConfig
}>()

const { profile } = useKeycloak()
const room = ref(props.config.defaultRoom || '')

function buildLink(roomName: string, token: string): string {
  const url = new URL(roomName, props.config.jitsiUrl)
  url.searchParams.append('jwt', token)
  return encodeURI(url.href)
}

function openJitsi() {
  if (!room.value) return
  window.location.href = buildLink(room.value, props.config.token)
}
</script>
