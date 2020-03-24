import Vue from "vue"
import App from "./App.vue"
import vuetify from "./plugins/vuetify";
import axios from "axios"
import * as Keycloak from "keycloak-js";

Vue.config.productionTip = false;

axios.get("api/keycloak.json").then(response => {
  const keycloak = Keycloak({
    url: response.data["auth-server-url"],
    realm: response.data["realm"],
    clientId: response.data["resource"]
  });

  keycloak.init({onLoad: "login-required", promiseType: "native", checkLoginIframe: false}).then(auth => {
    if (!auth) {
      window.location.reload();
    } else {
      console.info("Authenticated");
    }

    localStorage.setItem("vue-token", keycloak.token);
    localStorage.setItem("vue-refresh-token", keycloak.refreshToken);

    keycloak.loadUserProfile()
      .then(profile => {
        new Vue({
          vuetify,
          render: h => h(App, {props: {keycloak: keycloak, profile: profile}})
        }).$mount("#app");

        setTimeout(() => {
          keycloak.updateToken(70).then(refreshed => {
            if (refreshed) {
              console.debug("Token refreshed" + refreshed);
            } else {
              console.warn("Token not refreshed, valid for "
                + Math.round(keycloak.tokenParsed.exp + keycloak.timeSkew - new Date().getTime() / 1000) + " seconds");
            }
          }).catch(() => {
            console.error("Failed to refresh token");
          });
        }, 60000)
      }).catch(function () {
      console.error("Failed to load user profile");
    });
  }).catch(() => {
    console.error("Authenticated Failed");
  });
});





