<template>
  <v-ons-page :shown="this.active">
    <v-ons-progress-bar id="loading-bar-map" value="0" indeterminate="indeterminate" v-if="false"></v-ons-progress-bar>
    <div class="content"></div>
    <div ref="mapContainer" style="width: 100%; height: 100%; background-color: #000"></div>
  </v-ons-page>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from "vue-property-decorator";
import { namespace } from "vuex-class";
import { XiaomiMap } from "@/lib/map";
import { IMapAndPathData } from "@/api";

const map = namespace("map");
const config = namespace("config");


@Component
export default class Map extends Vue {

  public $refs!: {
    mapContainer: HTMLDivElement;
  };

  @map.Action public updateMapData: any;

  @config.Action public startMapRefresh: any;
  @config.Action public stopMapRefresh: any;
  @Prop() public active!: boolean;

  @map.State private data!: IMapAndPathData;

  private map!: XiaomiMap;



  @Watch("active")
  private activeStateChanged() {
      if (this.active) {
        this.startMapRefresh("map");
      } else {
        this.stopMapRefresh("map");
      }
  }

  @Watch("data")
  private dataChanged() {
    this.map.updateMapData(this.data);
  }

  private mounted() {
      this.activeStateChanged();
      this.map = new XiaomiMap(this.$refs.mapContainer);
  }

}
</script>
