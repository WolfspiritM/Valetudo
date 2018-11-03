<template>
    <v-ons-page>
        <v-ons-toolbar>
            <div class="left">
                <v-ons-back-button>Settings</v-ons-back-button>
            </div>
            <div class="center">Sound Volume</div>
            <div class="right">
            </div>
        </v-ons-toolbar>
        <div class="content">
            <v-ons-progress-bar indeterminate v-if="fetching"></v-ons-progress-bar>
            
            <v-ons-list-title style="margin-top:20px;">Sound Volume Settings</v-ons-list-title>
            <v-ons-list>
                <v-ons-list-item>
                    <div class="left">
                        Volume:
                    </div>
                    <label class="right" style="width:75%">
                        <v-ons-row>
                                <v-ons-col width="40px" style="text-align: center; line-height: 31px;">
                                    <v-ons-icon icon="md-volume-down"></v-ons-icon>
                                </v-ons-col>
                                <v-ons-col>
                                    <v-ons-range :disabled="fetching" style="width: 100%;" v-model="volume" id="settings-sound-volume-input-volume"></v-ons-range>
                                </v-ons-col>
                                <v-ons-col width="40px" style="text-align: center; line-height: 31px;">
                                    <v-ons-icon icon="md-volume-up"></v-ons-icon>
                                </v-ons-col>
                            </v-ons-row>
                    </label>
                </v-ons-list-item>
                <v-ons-list-item>
                    <div class="center">
                        <v-ons-button id="settings-sound-volume-input-save-button" :disabled="fetching" modifier="large" class="button-margin" @click="doSaveVolume();">Save sound volume</v-ons-button>
                    </div>
                </v-ons-list-item>
                <v-ons-list-item>
                    <div class="center">
                        <v-ons-button id="settings-sound-volume-input-test-button" :disabled="fetching" modifier="large" class="button-margin" @click="testVolume();">Test sound volume</v-ons-button>
                    </div>
                </v-ons-list-item>
            </v-ons-list>
        </div>
    </v-ons-page>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from "vue-property-decorator";
import { namespace } from "vuex-class";
import { IConsumables, IWifiSettings } from "@/api";
import { notification } from "onsenui";

const settings = namespace("settings");

@Component
export default class SoundSettings extends Vue {
    @settings.State private sound!: {
        volume: number | null;
    };
    @settings.State private fetching!: boolean;
    @settings.Action private updateVolume!: () => Promise<boolean>;
    @settings.Action private testVolume!: () => Promise<boolean>;
    @settings.Action private setVolume!: (payload: {
        volume: number;
    }) => Promise<boolean>;

    private volume: number = 0;

    public async mounted() {
        await this.updateVolume();
        this.volumeUpdated();
    }

    @Watch("sound.volume")
    private volumeUpdated() {
        if (!this.sound.volume) { return; }
        this.volume = this.sound.volume;
    }

    private doSaveVolume() {
        this.setVolume({
            volume: this.volume,
        });
    }

}
</script>
