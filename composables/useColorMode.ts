export type ColorMode = 'light' | 'dark'

const STORAGE_KEY = 'color-mode'

const colorMode = ref<ColorMode>('light')
const isDark = computed(() => colorMode.value === 'dark')

function getStoredMode(): ColorMode | null {
  const stored = localStorage.getItem(STORAGE_KEY)
  return stored === 'light' || stored === 'dark' ? stored : null
}

function getSystemMode(): ColorMode {
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

function applyMode(mode: ColorMode) {
  document.documentElement.classList.toggle('dark', mode === 'dark')
  document.documentElement.style.colorScheme = mode
}

/**
 * Initializes the color mode before the app mounts.
 * Uses the stored preference if present, otherwise follows the system preference.
 */
export function initColorMode() {
  colorMode.value = getStoredMode() ?? getSystemMode()
  applyMode(colorMode.value)

  watch(colorMode, (mode) => {
    applyMode(mode)
    localStorage.setItem(STORAGE_KEY, mode)
  })

  // Follow system changes as long as the user has no explicit preference
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (event) => {
    if (!getStoredMode()) colorMode.value = event.matches ? 'dark' : 'light'
  })
}

export function useColorMode() {
  const toggle = () => {
    colorMode.value = colorMode.value === 'dark' ? 'light' : 'dark'
  }

  return {
    colorMode,
    isDark,
    toggle,
  }
}
