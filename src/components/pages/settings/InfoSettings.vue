<template>
    <v-ons-page>
  <v-ons-toolbar>
                <div class="left">
                    <v-ons-back-button>Settings</v-ons-back-button>
                </div>
                <div class="center">Device Informations</div>
                <div class="right">
                </div>
            </v-ons-toolbar>
            <div class="content">
                <v-ons-progress-bar indeterminate v-if="fetching"></v-ons-progress-bar>
                <div v-if="info">
                    <v-ons-list-title style="margin-top:5px;">System</v-ons-list-title>
                    <v-ons-list>
                        <v-ons-list-item>
                            <div class="left">
                                Firmware version:
                            </div>
                            <div class="right">
                                {{ info.version }}
                            </div>
                        </v-ons-list-item>
                        <v-ons-list-item>
                            <div class="left">
                                Firmware build:
                            </div>
                            <div class="right">
                                {{ info.build }}
                            </div>
                        </v-ons-list-item>
                    </v-ons-list>
                </div>
            </div>
    </v-ons-page>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from "vue-property-decorator";
import { namespace } from "vuex-class";
import { IDeviceInfo } from "@/api";
import { notification } from "onsenui";

const settings = namespace("settings");

@Component
export default class InfoSettings extends Vue {
    @settings.State private info!: IDeviceInfo;
    @settings.State private fetching!: boolean;
    @settings.Action private updateInfo!: () => Promise<boolean>;

    public async mounted() {
        await this.updateInfo();
    }
}
</script>
