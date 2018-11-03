<template>
  <div v-if="pageStack.length > 0">
    <v-ons-navigator :page-stack="pageStack" :pop-page="goBack" swipeable swipe-target-width="80px">
    </v-ons-navigator>
  </div>
</template>

<script lang="ts">
import { Component, Watch, Vue } from "vue-property-decorator";
import {VueConstructor} from "vue";
import { Route, RouteRecord } from "vue-router";
import { Component as ComponentType } from "vue-router/types/router";
import {
  State,
  namespace,
} from "vuex-class";


const appModule = namespace("app");

@Component
export default class App extends Vue {
  public pageStack: ComponentType[] = [];

  public goBack() {
    this.$router.push({ name: this.$route.matched[this.$route.matched.length - 2].name, params: this.$route.params });
  }

  private created() {
    const mapRouteStack = async (route: Route) => {
      if (route.matched.length <= 0) { return true; }
      this.pageStack = route.matched.filter((m) => m.name !== "container").map((m) => m.components.default);
      return true;
    };
    mapRouteStack(this.$route);
    this.$router.beforeResolve((to, from, next) => mapRouteStack(to) && next());
  }
}
</script>


<style>
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
#nav {
  padding: 30px;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: #42b983;
}
</style>
