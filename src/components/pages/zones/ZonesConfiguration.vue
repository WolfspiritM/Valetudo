<template>
    <v-ons-page>
        <v-ons-toolbar>
        <div class="left">
            <v-ons-back-button>Zones</v-ons-back-button>
        </div>
        <div class="center">Zone configuration</div>
        </v-ons-toolbar>
        <div class="content">
            <v-ons-progress-bar indeterminate v-if="fetching"></v-ons-progress-bar>

            <v-ons-list-title style="margin-top:20px;">Cleanup area {{fetching}} definition</v-ons-list-title>
            <v-ons-list>
                <v-ons-list-item>
                    <div class="left">
                        x1:
                    </div>
                    <label class="right" style="width:75%">
                        <v-ons-input v-model.number="pointX1" :disabled="fetching" float type="number" style="width:100%"></v-ons-input>
                    </label>
                </v-ons-list-item>
                <v-ons-list-item>
                    <div class="left">
                        y1:
                    </div>
                    <label class="right" style="width:75%">
                        <v-ons-input v-model.number="pointY1" :disabled="fetching" float type="number" style="width:100%"></v-ons-input>
                    </label>
                </v-ons-list-item>
                <v-ons-list-item>
                    <div class="left">
                        x2:
                    </div>
                    <label class="right" style="width:75%">
                        <v-ons-input v-model.number="pointX2" :disabled="fetching" float type="number" style="width:100%"></v-ons-input>
                    </label>
                </v-ons-list-item>
                <v-ons-list-item>
                    <div class="left">
                        y2:
                    </div>
                    <label class="right" style="width:75%">
                        <v-ons-input v-model.number="pointY2" :disabled="fetching" float type="number" style="width:100%"></v-ons-input>
                    </label>
                </v-ons-list-item>
                <v-ons-list-item>
                    <div class="left">
                        Iterations:
                    </div>
                    <label class="right" style="width:75%">
                        <v-ons-input v-model.number="iterations" :disabled="fetching" float type="number" style="width:100%"></v-ons-input>
                    </label>
                </v-ons-list-item>
                <v-ons-list-item>
                    <div class="center">
                        <v-ons-button id="zones-config-zone-areabutton" :disabled="fetching" modifier="large" class="button-margin" @click="startZoneCleanup();">Clean zone</v-ons-button>
                    </div>
                </v-ons-list-item>
            </v-ons-list>

            <v-ons-list-title style="margin-top:20px;">Save area as new Zone</v-ons-list-title>
            <v-ons-list>
                <v-ons-list-item>
                    <div class="left">
                        Save as:
                    </div>
                    <label class="right" style="width:75%">
                        <v-ons-input v-model="zoneName" float style="width:100%"></v-ons-input>
                    </label>
                </v-ons-list-item>
                <v-ons-list-item>
                    <div class="center">
                        <v-ons-button modifier="large" class="button-margin" :disabled="fetching" @click="save();">Save new zone</v-ons-button>
                    </div>
                </v-ons-list-item>
            </v-ons-list>

            <v-ons-list-title style="margin-top:20px;">Add area to existing Zone</v-ons-list-title>
            <v-ons-list>
                <v-ons-list-item>
                    <div class="center">
                        <v-ons-button modifier="large" class="button-margin" :disabled="fetching" @click="addToExisting();">Select a zone to add</v-ons-button>
                    </div>
                </v-ons-list-item>
            </v-ons-list>

            <v-ons-list-title style="margin-top:20px;">Delete Zone</v-ons-list-title>
            <v-ons-list>
                <v-ons-list-item>
                    <div class="center">
                        <v-ons-button modifier="large" class="button-margin" :disabled="fetching" @click="deleteZone();">Select a zone to delete</v-ons-button>
                    </div>
                </v-ons-list-item>
            </v-ons-list>
        </div>
    </v-ons-page>
</template>

<script lang="ts">
import { Component, Vue, Watch } from "vue-property-decorator";
import { namespace } from "vuex-class";
import { IZoneGroup, IZone } from "@/api";
import { openActionSheet, notification } from "onsenui";
const zones = namespace("zones");

@Component
export default class ZonesConfiguration extends Vue {
    @zones.State public zones!: IZoneGroup[];
    @zones.State public fetching!: boolean;
    @zones.Action public addZone!: (payload: {zone: IZoneGroup}) => any;
    @zones.Action public removeZone!: (payload: {zone: IZoneGroup}) => any;
    @zones.Action public zoneCleanup!: (payload: {zones: IZone[]}) => any;

    private pointX1 = 500;
    private pointY1 = 500;
    private pointX2 = 1000;
    private pointY2 = 1000;
    private iterations = 2;

    private zoneName = "My zone";

    private startZoneCleanup() {
        const zone = this.getCurrentZone();
        this.zoneCleanup({ zones: zone.zones });
    }

    private getCurrentZone(): IZoneGroup {
        return {
                    name: this.zoneName,
                    zones: [
                        {
                            iterations: this.iterations,
                            Point1: [this.pointX1, this.pointY1],
                            Point2: [this.pointX2, this.pointY2],
                        },
                    ],
                };
    }

    private save() {
        const existing = this.zones.find((a) => a.name === this.zoneName);
        if (existing) {
            notification.alert("A zone with that name already exists.");
        } else {
            this.addZone({ zone: this.getCurrentZone() });
            notification.toast("Saved!", {
                timeout: 2000,
            });
        }
    }

    private async selectExistingZone(title: string) {
        const options: any[] = [];

        for (const zone of this.zones) {
            options.push({label: zone.name, zone});
        }
        options.push({ label: "Cancel", icon: "md-close" });
        const result = await openActionSheet({
            title,
            cancelable: true,
            buttons: options,
        });

        if (result > -1 && result < this.zones.length) {
            return options[result].zone as IZoneGroup;
        }
        return null;
    }

    private async deleteZone() {
        const zone = await this.selectExistingZone("Select a zone to delete");
        if (zone) {
            await this.removeZone({ zone });

            notification.toast("Zone removed!", {
                timeout: 2000,
            });
        }
    }


    private async addToExisting() {
        const zone = await this.selectExistingZone("Add area to Zone");
        if (zone) {
            this.addZone({
            zone: {
                name: zone.name,
                zones: [
                    {
                        iterations: this.iterations,
                        Point1: [this.pointX1, this.pointY1],
                        Point2: [this.pointX2, this.pointY2],
                    },
                ],
            }});

            notification.toast("Saved to zone!", {
                timeout: 2000,
            });
        }
    }
}
</script>
