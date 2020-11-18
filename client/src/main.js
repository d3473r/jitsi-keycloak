import Vue from "vue";
import VueRouter from "vue-router";
import App from "./App.vue";
import vuetify from "./plugins/vuetify";
import axios from "axios";
import * as Keycloak from "keycloak-js";

Vue.use(VueRouter)
Vue.config.productionTip = false;

(async () => {
  try {
    const response = await axios.get("api/keycloak.json");
    const keycloak = Keycloak({
      url: response.data["auth-server-url"],
      realm: response.data["realm"],
      clientId: response.data["resource"]
    });


    const router = new VueRouter({
      mode: "history",
      routes: [{path: "/:room", component: App}]
    });

    const auth = await keycloak.init({onLoad: "login-required", promiseType: "native", checkLoginIframe: false});
    if (!auth) {
      window.location.reload();
    } else {
      console.info("Authenticated");
    }

    localStorage.setItem("vue-token", keycloak.token);
    localStorage.setItem("vue-refresh-token", keycloak.refreshToken);

    const profile = await keycloak.loadUserProfile();
    new Vue({
      vuetify,
      router,
      render: h => h(App, {props: {keycloak: keycloak, profile: profile}})
    }).$mount("#app");

    setTimeout(async () => {
      const refreshed = await keycloak.updateToken(70);
      if (refreshed) {
        console.debug("Token refreshed" + refreshed);
      } else {
        console.warn("Token not refreshed, valid for "
            + Math.round(keycloak.tokenParsed.exp + keycloak.timeSkew - new Date().getTime() / 1000) + " seconds");
      }
    }, 60000)
  } catch(e) {
    console.error("Authenticated Failed: ", e);
  }
})();
