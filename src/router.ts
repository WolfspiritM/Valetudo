import Vue, { VueConstructor } from "vue";
import Router, { RouteConfig } from "vue-router";
import Main from "@/components/pages/Main.vue";
import Container from "@/components/Container.vue";

Vue.use(Router);

function lazyLoad(component: VueConstructor<Vue>) {
  return new Promise<VueConstructor<Vue>>((res, rej) => {
    setTimeout(() => {
      res(component);
    }, 1200);
  });
}


const settingsRoutes: RouteConfig[] = [
  {
    path: "infoSettings",
    name: "infoSettings",
    component: () => import("@/components/pages/settings/InfoSettings.vue"),
  },
  {
    path: "consumableSettings",
    name: "consumableSettings",
    component: () => import("@/components/pages/settings/ConsumableSettings.vue"),
  },
  {
    path: "soundSettings",
    name: "soundSettings",
    component: () => import("@/components/pages/settings/SoundSettings.vue"),
  },
  {
    path: "timerSettings",
    name: "timerSettings",
    component: () => import("@/components/pages/settings/TimerSettings.vue"),
  },
  {
    path: "tokenSettings",
    name: "tokenSettings",
    component: () => import("@/components/pages/settings/TokenSettings.vue"),
  },
  {
    path: "wifiSettings",
    name: "wifiSettings",
    component: () => import("@/components/pages/settings/WifiSettings.vue"),
  },

];

export default new Router({
  mode: "hash",
  base: process.env.BASE_URL,
  routes: [
    {path: "/", redirect: "/main"},
    {path: "/main", redirect: "/main/home"},
    {
      path: "/",
      name: "container",
      component: Container,
      children: [
        {
          path: "/main/:tab",
          name: "main",
          component: Main,
          children: [
            {
              path: "zoneConfig",
              name: "zoneConfig",
              component: () => import("@/components/pages/zones/ZonesConfiguration.vue"),
            },
            {
              path: "gotoConfig",
              name: "gotoConfig",
              component: () => import("@/components/pages/zones/GotoConfiguration.vue"),
            },
            ...settingsRoutes,
          ],
        },
      ],
    },
  ],
});
