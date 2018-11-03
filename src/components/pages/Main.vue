<template>
  <v-ons-page>
    <v-ons-splitter>
        <v-ons-splitter-side swipeable side="left" collapse="" width="260px" :open="sideBarOpen" @update:open="this.setSideBar"><SideBar/></v-ons-splitter-side>
        <v-ons-splitter-content>
          <v-ons-page>
              <v-ons-toolbar>
                <div class="left">
                    <v-ons-toolbar-button>
                        <v-ons-icon icon="ion-navicon, material:md-menu" @click="toggleLeftMenu"></v-ons-icon>
                    </v-ons-toolbar-button>
                </div>
                <div class="center">{{this.tabs[this.activeIndex].label}}</div>
            </v-ons-toolbar>
            <v-ons-tabbar swipeable position="auto" :index.sync="activeIndex" :tabs="tabs" @prechange="changeTab">
                <template slot="pages">
                  <component v-for="(tab, index) in tabs" :is="tab.page" :key="tab.label" :active="activeIndex === index"></component>
                </template>
            </v-ons-tabbar>
          </v-ons-page>
        </v-ons-splitter-content>
    </v-ons-splitter>
  </v-ons-page>
</template>

<script lang="ts">
import { Component, Vue, Watch } from "vue-property-decorator";
import SideBar from "@/components/SideBar.vue";
import {Home, Map, ManualControl, Zones, Settings} from "../views/index";
import { namespace } from "vuex-class";
import { VacuumState } from "@/store/modules/vacuum";

const app = namespace("app");
const vacuum = namespace("vacuum");

interface ITabButton {
  label: string;
  icon: string;
  route: string;
  page: any;
}

@Component({
  components: {
    SideBar,
  },
})
export default class Main extends Vue {
  public tabs: ITabButton[] = [
    { label: "Home", icon: "ion-home", route: "home", page: Home},
    { label: "Map", icon: "fa-map-marker", route: "map", page: Map},
    { label: "Zones", icon: "fa-share-square", route: "zones", page: Zones},
    { label: "ManualControl", icon: "fa-gamepad", route: "manualcontrol", page: ManualControl},
    { label: "Settings", icon: "fa-cog", route: "settings", page: Settings},
  ];
  public activeIndex = 0;
  @app.State public sideBarOpen!: boolean;
  @app.Mutation public toggleSideBar: any;
  @app.Mutation public setSideBar: any;

  public changeTab(event: any) {
    const tab = this.tabs[event.index];
    this.$router.push({name: this.$route.name, params: { tab: tab.route }});
  }

  public toggleLeftMenu() {
    this.toggleSideBar();
  }

  private created() {
    this.onTabChanged();
  }

  @Watch("$route")
  private onTabChanged() {
    const tab = this.$route.params.tab;
    const tabindex = this.tabs.findIndex((item) => item.route === tab);
    this.activeIndex = tabindex >= 0 ? tabindex : 0;
  }

}
</script>
