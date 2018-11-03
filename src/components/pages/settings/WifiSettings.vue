<template>
    <v-ons-page>
  <v-ons-toolbar>
                <div class="left">
                    <v-ons-back-button>Settings</v-ons-back-button>
                </div>
                <div class="center">Wifi</div>
                <div class="right">
                </div>
            </v-ons-toolbar>
            <div class="content">
                <v-ons-progress-bar indeterminate v-if="fetching"></v-ons-progress-bar>
                <div v-if="wifi">
                    <v-ons-list-title style="margin-top:5px;">Current connection</v-ons-list-title>
                    <v-ons-list>
                        <v-ons-list-item>
                            <div class="left">
                                Status
                            </div>
                            <div class="right" id="settings-wifi-current-connection-status-connected">
                                {{ wifi.connected ? "connected":"disconnected" }}
                            </div>
                        </v-ons-list-item>
                        <v-ons-list-item>
                            <div class="left">
                                SSID
                            </div>
                            <div class="right" id="settings-wifi-current-connection-status-ssid">
                                {{ wifi.connection_info.ssid }}
                            </div>
                        </v-ons-list-item>
                        <v-ons-list-item>
                            <div class="left">
                                Signal
                            </div>
                            <div class="right" id="settings-wifi-current-connection-status-signal">
                                {{ wifi.connection_info.signal }} dBm
                            </div>
                        </v-ons-list-item>
                        <v-ons-list-item>
                            <div class="left">
                                TX Bitrate
                            </div>
                            <div class="right" id="settings-wifi-current-connection-status-tx-bitrate">
                                {{ wifi.connection_info.tx_bitrate }} MBit/s
                            </div>
                        </v-ons-list-item>

                    </v-ons-list>

                    <v-ons-list-title style="margin-top:20px;">Wifi Settings</v-ons-list-title>
                    <v-ons-list>
                        <v-ons-list-item>
                            <div class="left">
                                SSID:
                            </div>
                            <label class="right" style="width:75%">
                                <v-ons-input id="settings-wifi-input-ssid" v-model="ssid" float maxlength="32" placeholder="SSID" style="width:100%"></v-ons-input>
                            </label>
                        </v-ons-list-item>
                        <v-ons-list-item>
                            <div class="left">
                                Password:
                            </div>
                            <label class="right" style="width:75%">
                                <v-ons-input id="settings-wifi-input-password" v-model="password" type="password" float maxlength="63" placeholder="Password" style="width:100%;"></v-ons-input>
                            </label>
                        </v-ons-list-item>
                        <v-ons-list-item>
                            <div class="center">
                                <v-ons-button id="settings-wifi-input-save-button" modifier="large" class="button-margin" :disabled="fetching || ssid.length < 1 || password.length < 1" @click="handleWifiSettingsSaveButton();">Save new Wifi configuration</v-ons-button>
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
import { IConsumables, IWifiSettings } from "@/api";
import { notification } from "onsenui";

const settings = namespace("settings");

@Component
export default class WifiSettings extends Vue {
    @settings.State private wifi!: IWifiSettings;
    @settings.State private fetching!: boolean;
    @settings.Action private updateWifi!: () => Promise<boolean>;
    @settings.Action private setWifi!: (payload: {
            ssid: string;
            password: string;
    }) => Promise<boolean>;

    private ssid = "";
    private password = "";

    public async mounted() {
        await this.updateWifi();
        this.ssid = this.wifi.connection_info.ssid;
    }

    public async handleWifiSettingsSaveButton() {
        const answer = await notification.confirm("Are you sure you want to apply the new wifi settings?<br><br>" +
                        "<span style=\"font-weight: bold\">Hint:</span> You can always revert back to the " +
                        "integrated Wifi Hotspot by pressing the reset button located underneath the lid.",
                    ) as any;
        if (answer === 1) {
            this.setWifi({
                ssid: this.ssid,
                password: this.password,
            });
        }
    }

}
</script>
