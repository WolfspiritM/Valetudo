<template>
    <v-ons-page>
        <v-ons-toolbar>
        <div class="left">
            <v-ons-back-button>Zones</v-ons-back-button>
        </div>
        <div class="center">Go to configuration</div>
        </v-ons-toolbar>

        <v-ons-progress-bar id="loading-bar-zones-go-to" value="0"></v-ons-progress-bar>

        <v-ons-list-title style="margin-top:20px;">Go to setup</v-ons-list-title>
        <v-ons-list>
            <v-ons-list-item>
                <div class="left">
                    Go to x:
                </div>
                <label class="right" style="width:75%">
                    <v-ons-input id="zones-config-go-to-x" :disabled="fetching" float type="number" style="width:100%" v-model.number="pointX"></v-ons-input>
                </label>
            </v-ons-list-item>
            <v-ons-list-item>
                <div class="left">
                    Go to y:
                </div>
                <label class="right" style="width:75%">
                    <v-ons-input id="zones-config-go-to-y" :disabled="fetching" float type="number" style="width:100%" v-model.number="pointY"></v-ons-input>
                </label>
            </v-ons-list-item>
            <v-ons-list-item>
                <div class="center">
                    <v-ons-button id="zones-config-go-to-button" :disabled="fetching" modifier="large" class="button-margin" @click="startGoto();">Go To</v-ons-button>
                </div>
            </v-ons-list-item>
        </v-ons-list>

        <v-ons-list-title style="margin-top:20px;">Save Go To spot as</v-ons-list-title>
        <v-ons-list>
            <v-ons-list-item>
                <div class="left">
                    Save as:
                </div>
                <label class="right" style="width:75%">
                    <v-ons-input id="zones-config-go-to-name" :disabled="fetching"  float style="width:100%" v-model="gotoName"></v-ons-input>
                </label>
            </v-ons-list-item>
            <v-ons-list-item>
                <div class="center">
                    <v-ons-button id="zones-config-go-to-save-button" :disabled="fetching" modifier="large" class="button-margin" @click="saveGoto();">Save Go To spot</v-ons-button>
                </div>
            </v-ons-list-item>
        </v-ons-list>

        <v-ons-list-title style="margin-top:20px;">Delete Go To spot</v-ons-list-title>
        <v-ons-list>
            <v-ons-list-item>
                <div class="center">
                    <v-ons-button modifier="large" :disabled="fetching" class="button-margin" @click="deleteGoto();">Select Go To spot to delete</v-ons-button>
                </div>
            </v-ons-list-item>
        </v-ons-list>
    </v-ons-page>
</template>

<script lang="ts">

import { Component, Vue } from "vue-property-decorator";
import { namespace } from "vuex-class";
import { IZoneGroup, IGotoSpot } from "@/api";
import { openActionSheet, notification } from "onsenui";
const zones = namespace("zones");

@Component
export default class ZonesConfiguration extends Vue {
    @zones.State public fetching!: boolean;
    @zones.State public gotos!: IGotoSpot[];
    @zones.Action public addGotoSpot!: (payload: {spot: IGotoSpot}) => any;
    @zones.Action public removeGotoSpot!: (payload: {spot: IGotoSpot}) => any;
    @zones.Action public gotoSpot!: (payload: { point: [number, number]}) => any;
    private pointX = 100;
    private pointY = 100;
    private gotoName = "My go to point";

    private async startGoto() {
        this.gotoSpot({
            point: [this.pointX, this.pointY],
        });
    }

    private async selectExistingSpot(title: string) {
        const options: any[] = [];

        for (const spot of this.gotos) {
            options.push({label: spot.name, spot});
        }
        options.push({ label: "Cancel", icon: "md-close" });
        const result = await openActionSheet({
            title,
            cancelable: true,
            buttons: options,
        });

        if (result > -1 && result < this.gotos.length) {
            return options[result].spot as IGotoSpot;
        }
        return null;
    }

    private async saveGoto() {
        const existing = this.gotos.find((a) => a.name === this.gotoName);
        if (existing) {
            notification.alert("A point with that name already exists.");
            return;
        }
        this.addGotoSpot({
            spot: {
                name: this.gotoName,
                Point: [this.pointX, this.pointY],
            },
        });
    }


    private async deleteGoto() {
        const spot = await this.selectExistingSpot("Select go to spot to delete");
        if (spot) {
            await this.removeGotoSpot({
                spot,
            });
        }
    }

}
</script>
