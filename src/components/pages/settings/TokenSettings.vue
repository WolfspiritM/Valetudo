<template>
    <v-ons-page>
    <v-ons-toolbar>
        <div class="left">
            <v-ons-back-button>Settings</v-ons-back-button>
        </div>
        <div class="center">Token</div>
        <div class="right">
        </div>
    </v-ons-toolbar>
    <div class="content">
        <v-ons-progress-bar indeterminate v-if="fetching"></v-ons-progress-bar>

        <v-ons-list-title style="margin-top:5px;">Current Token</v-ons-list-title>
        <v-ons-list>
            <v-ons-list-item>
                <div class="left">
                    Token
                </div>
                <div class="right">
                    <span id="settings-token-label" style="text-align:right;user-select:text;">{{ token }}</span>
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
export default class TokenSettings extends Vue {
    @settings.State private token!: string;
    @settings.State private fetching!: boolean;
    @settings.Action private updateToken!: () => Promise<boolean>;

    public mounted() {
        this.updateToken();
    }

}
</script>
