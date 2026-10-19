export default defineNuxtConfig({
  ssr: false,
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  devServer: {
    port: 3000,
  },
  modules: ['@nuxtjs/tailwindcss'],
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
      script: [
        {
          // Apply dark mode before the app mounts to avoid a flash of the wrong theme
          innerHTML: `(function(){try{var m=localStorage.getItem('color-mode');var d=m?m==='dark':window.matchMedia('(prefers-color-scheme: dark)').matches;var r=document.documentElement;r.classList.toggle('dark',d);r.style.colorScheme=d?'dark':'light'}catch(e){}})()`,
        },
      ],
    },
  },
})
