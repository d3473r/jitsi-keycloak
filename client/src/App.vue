<template>
  <v-app>
    <v-app-bar
        app
        color="primary"
        dark
    >
      <v-toolbar-title>Jitsi Keycloak</v-toolbar-title>
      <v-spacer></v-spacer>
      <span>{{profile.firstName}} {{profile.lastName}}</span>
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
                    <v-text-field label="Room" v-model="room"></v-text-field>
                  </v-col>
                </v-row>
                <v-btn color="primary" v-on:click="openJitsi">Open Jitsi</v-btn>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>

        <v-row>
          <v-col>
            <v-card>
              <v-card-title>Invite</v-card-title>
              <v-card-text>
                <v-row>
                  <v-col md="4">
                    <v-text-field label="Invite Room Prefix" :value="inviteRoomPrefix" disabled></v-text-field>
                  </v-col>
                  <v-col md="8">
                    <v-text-field label="Invite Room Id" v-model="inviteRoomId"></v-text-field>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col>
                    <v-list dense>
                      <v-list-item
                          v-for="(invite, i) in invites"
                          :key="i"
                      >
                        <v-list-item-content>
                          <v-text-field label="Name" v-model="invite.name"></v-text-field>
                        </v-list-item-content>

                        <v-list-item-action>
                          <v-row>
                            <v-tooltip bottom>
                              <template v-slot:activator="{ on }">
                                <v-btn icon v-on:click="copyInviteLink(invite.name)" v-on="on"
                                       v-bind:disabled="invite.name.length < 3">
                                  <v-icon>mdi-content-copy</v-icon>
                                </v-btn>
                              </template>
                              <span>Copy invite link</span>
                            </v-tooltip>
                            <v-tooltip bottom>
                              <template v-slot:activator="{ on }">
                                <v-btn icon v-on:click="$delete(invites, i)" v-on="on">
                                  <v-icon>mdi-delete</v-icon>
                                </v-btn>
                              </template>
                              <span>Delete invite</span>
                            </v-tooltip>
                          </v-row>
                        </v-list-item-action>
                      </v-list-item>
                    </v-list>
                  </v-col>
                </v-row>
                <v-row justify="end">
                  <v-col md="1">
                    <v-tooltip bottom>
                      <template v-slot:activator="{ on }">
                        <v-btn icon v-on:click="invites.push({name: ''})" v-on="on">
                          <v-icon>mdi-plus</v-icon>
                        </v-btn>
                      </template>
                      <span>Add invite</span>
                    </v-tooltip>
                  </v-col>
                </v-row>
                <v-btn color="primary" v-on:click="joinInvite">Join Invite</v-btn>
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
  import crypto from "crypto";

  axios.defaults.headers.common["Authorization"] = `Bearer ${localStorage.getItem("vue-token")}`;

  export default {
    name: "App",

    props: ["keycloak", "profile"],
    computed: {
      inviteRoom: function () {
        return `${this.inviteRoomPrefix}${this.inviteRoomId}`;
      },
      url() {
        return window.location.href;
      }
    },
    methods: {
      openJitsi: function () {
        window.open(this.buildLink(this.room, this.config.token), "_blank");
      },
      copyInviteLink: async function (name) {
        const invite = (await axios.get("/api/invite", {params: {name: name, room: this.inviteRoom}})).data;
        await navigator.clipboard.writeText(this.buildLink(this.inviteRoom, invite.token));
      },
      joinInvite: function () {
        window.open(this.buildLink(this.inviteRoom, this.config.token), "_blank");
      },
      buildLink: function (room, token) {
        return encodeURI(`${this.config.jitsiUrl}${room}?jwt=${token}`)
      }
    },
    data: () => ({
      config: null,
      room: null,
      inviteRoomPrefix: null,
      inviteRoomId: crypto.randomBytes(24).toString("hex"),
      invites: []
    }),
    async mounted() {
      this.config = (await axios.get("/api/config")).data;
      this.room = this.config.defaultRoom;
      this.inviteRoomPrefix = this.config.inviteRoomPrefix;
    },
  };
</script>

<style>
  html {
    overflow-y: auto !important;
  }
</style>
