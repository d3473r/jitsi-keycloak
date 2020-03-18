<template>
  <v-app>
    <v-app-bar
        app
        color="primary"
        dark
    >
      <v-toolbar-title>Jitsi Keycloak</v-toolbar-title>
    </v-app-bar>

    <v-content>
      {{info}}
    </v-content>
  </v-app>
</template>

<script>
  import axios from "axios";

  export default {
    name: 'App',

    data: () => ({
      info: null
    }),
    mounted() {
      axios
          .get('/api/test', {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem("vue-token")}`
            }
          })
          .then(response => (this.info = response.data))
    },
  };
</script>
