<template>
  <v-app>
    <v-app-bar
        app
        color="primary"
        dark
    >
      <v-toolbar-title>Jitsi Keycloak</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-img v-if="avatar" :src=avatar max-height="40" max-width="40" class="mx-2"></v-img>
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
    <v-main>
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
                  <v-btn color="primary" v-on:click="openJitsi" :disabled="!roomValid">Open Jitsi</v-btn>
                </v-form>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
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
      avatar: null,
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
    if (this.profile.attributes?.avatar) {
      this.avatar = this.profile.attributes.avatar[0];
    }

    const response = await fetch(`/api/config${this.avatar ? "?avatar=" + encodeURIComponent(this.avatar): ""}`, {
      headers: {Authorization: `Bearer ${sessionStorage.getItem("vue-token")}`}
    })

    this.config = await response.json()

    const roomQuery = this.$route.params.room;
    if (roomQuery) {
      this.room = roomQuery;
      this.openJitsi();
    } else {
      this.room = this.config.defaultRoom;
    }

    const _this = this;
    window.addEventListener('keyup', function(event) {
      if (event.key === "Enter") {
        _this.openJitsi();
      }
    });
  },
};
</script>

<style>
html {
  overflow-y: auto !important;
}
</style>
