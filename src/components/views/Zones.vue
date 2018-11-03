<template>
  <v-ons-page>
    <div class="content">
      <v-ons-list-title style="margin-top:20px;">Clean zones</v-ons-list-title>
      <v-ons-list id="zones-list">
          <v-ons-list-item v-if="zones.length === 0 && !fetching">No zones are configured yet.</v-ons-list-item>
          <v-ons-list-item v-if="fetching">Loading...</v-ons-list-item>
          <v-ons-list-item tappable="true" v-for="(zone, key) of zones" :key="zone.name">
            <label class="left">
              <v-ons-checkbox :input-id="'zones-index'+key" @click="toggleSelect(zone)" :checked="isSelected(zone) > -1"></v-ons-checkbox>
            </label>
            <label :for="'zones-index'+key" class="center">
              {{zone.name}} ({{zone.zones.length}})
            </label>
          </v-ons-list-item>
          <v-ons-list-item>
            <div class="center">
              <v-ons-button modifier="large" :disabled="fetching" class="button-margin" @click="handleZonesCleanButton">Clean zone</v-ons-button>
            </div>
          </v-ons-list-item>
      </v-ons-list>

      <v-ons-card @click="openGotoConfiguration">
          <div class="title"><v-ons-icon icon="fa-wrench"></v-ons-icon> Go to configuration</div>
          <div class="content">Configure go to spots / Check coordinate system</div>
      </v-ons-card>

      <v-ons-card @click="openZoneConfiguration">
          <div class="title"><v-ons-icon icon="fa-wrench"></v-ons-icon> Zone configuration</div>
          <div class="content">Configure the different zones</div>
      </v-ons-card>
    </div>
  </v-ons-page>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from "vue-property-decorator";
import { IGotoSpot, IZoneGroup, IZone } from "@/api";
import { namespace } from "vuex-class";
const zones = namespace("zones");

@Component
export default class Zones extends Vue {
  @Prop() public active!: boolean;

  @zones.State public fetching!: boolean;
  @zones.State public gotos!: IGotoSpot[];
  @zones.State public zones!: IZoneGroup[];
  @zones.Action public updateZonesAndGoto: any;
  @zones.Action public zoneCleanup: any;

  private selectedZones: IZoneGroup[] = [];

  @Watch("zones")
  private zonesChanged() {
    // Make sure we won't have any zones selected that don't exist
    this.selectedZones = [];
  }

  private isSelected(zone: IZoneGroup) {
    const index = this.selectedZones.indexOf(zone);

    return index;
  }

  private toggleSelect(zone: IZoneGroup) {
    const index = this.selectedZones.indexOf(zone);
    if (this.selectedZones.indexOf(zone) >= 0) {
      this.selectedZones.splice(index, 1);
    } else {
      this.selectedZones.push(zone);
    }
  }

  private async handleZonesCleanButton() {
    const allAreas: IZone[] = [];

    for (const zone of this.selectedZones) {
      for (const area of zone.zones) {
        allAreas.push(area);
      }
    }


    await this.zoneCleanup({ zones: allAreas});
    this.selectedZones = [];
  }

  private openZoneConfiguration() {
    this.$router.push({name: "zoneConfig"});
  }
  private openGotoConfiguration() {
    this.$router.push({name: "gotoConfig"});
  }

  private mounted() {
    if (this.active) {
      this.activeStateChanged();
    }
  }

  @Watch("active")
  private activeStateChanged() {
      if (this.active) {
        this.updateZonesAndGoto();
      }
  }

}
</script>
