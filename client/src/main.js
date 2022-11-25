import Vue from "vue";
import VueRouter from "vue-router";
import App from "./App.vue";
import vuetify from "./plugins/vuetify";
import Keycloak from "keycloak-js";

Vue.use(VueRouter)
Vue.config.productionTip = false;

const router = new VueRouter({
  mode: 'history',
  routes: [{path: '/:room', component: App}]
})

const keycloak = new Keycloak("api/keycloak.json");

keycloak.init({onLoad: "login-required", checkLoginIframe: false}).then(() => {
  localStorage.setItem("vue-token", keycloak.token);
  localStorage.setItem("vue-refresh-token", keycloak.refreshToken);

  keycloak.loadUserProfile()
      .then(profile => {
        new Vue({
          vuetify,
          router,
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
}).catch(function() {
  alert("Did you configure CORS correctly?")
});
