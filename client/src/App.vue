<template>
  <v-app>
    <v-app-bar
        app
        color="primary"
        dark
    >
      <v-toolbar-title>Jitsi Keycloak</v-toolbar-title>
      <v-spacer></v-spacer>
      <span>{{ profile.firstName }} {{ profile.lastName }}</span>
      <v-tooltip bottom>
        <template v-slot:activator="{ on }">
          <v-btn icon v-on:click="keycloak.logout({redirectUri: url})" v-on="on">
            <v-icon>mdi-logout</v-icon>
          </v-btn>
        </template>
        <span>Logout</span>
      </v-tooltip>
    </v-app-bar>
    <v-content>
      <v-container>
        <v-row>
          <v-col>
            <v-card>
              <v-card-title>Login</v-card-title>
              <v-card-text>
                <v-form v-model="roomValid">
                  <v-row>
                    <v-col>
                      <v-text-field label="First Name" :value="profile.firstName" disabled></v-text-field>
                    </v-col>
                    <v-col>
                      <v-text-field label="Last Name" :value="profile.lastName" disabled></v-text-field>
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col>
                      <v-text-field label="Email" :value="profile.email" disabled></v-text-field>
                    </v-col>
                    <v-col>
                      <v-text-field label="Room" v-model="room" :rules="roomRules"></v-text-field>
                    </v-col>
                  </v-row>
                  <v-btn color="primary" v-on:click="openJitsi" v-on:keyup.enter="openJitsi" :disabled="!roomValid">Open Jitsi</v-btn>
                </v-form>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-content>
  </v-app>
</template>

<script>
import axios from "axios";
import { v4 as uuidv4 } from "uuid";

export default {
  name: "App",

  props: ["keycloak", "profile"],
  computed: {
    url() {
      return window.location.href;
    }
  },
  methods: {
    openJitsi: function () {
      window.location.href = this.buildLink(this.room, this.config.token);
    },
    buildLink: function (room, token) {
      const url = new URL(room, this.config.jitsiUrl);
      url.searchParams.append("jwt", token);
      return encodeURI(url.href);
    },
    generateUuid: () => {
      return uuidv4();
    },
    validateUuid: uuid => {
      return /^[a-fA-F0-9]{8}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{12}$/.test(uuid);
    },
  },
  data() {
    return {
      config: null,
      room: null,
      roomValid: true,
      roomRules: [
        v => !!v || "Room is required"
      ],
      uuidRules: [
        v => !!v || "UUID is required",
        v => this.validateUuid(v) || "Must be a valid uuid",
      ]
    }
  },
  async mounted() {
    axios.defaults.headers.common["Authorization"] = `Bearer ${localStorage.getItem("vue-token")}`;
    this.config = (await axios.get("/api/config")).data;

    const roomQuery = this.$route.params.room;
    if (roomQuery) {
      this.room = roomQuery;
      this.openJitsi();
    } else {
      this.room = this.config.defaultRoom;
    }
  },
};
</script>

<style>
html {
  overflow-y: auto !important;
}
</style>
