<template>
    <v-ons-page>
        <v-ons-toolbar>
                <div class="left">
                    <v-ons-back-button>Settings</v-ons-back-button>
                </div>
                <div class="center">Consumables</div>
                <div class="right">
                </div>
        </v-ons-toolbar>
        <div class="content">
            <v-ons-progress-bar indeterminate="indeterminate" v-if="fetching"></v-ons-progress-bar>

            <div style="text-align: center" v-if="!consumables"><br/><ons-progress-circular indeterminate></ons-progress-circular></div>
            <div v-if="consumables">
                <v-ons-list-title style="margin-top:5px;">Consumables</v-ons-list-title>
                <v-ons-list>
                    <v-ons-list-item>
                        <div class="left">
                            Main Brush
                        </div>
                        <div class="center" id="settings-consumables-status-main-brush" style="margin-left:5%">
                            {{ formatTimeRemaining(300, consumables.consumables.main_brush_work_time) }} hours left
                        </div>
                        <div class="right">
                            <v-ons-icon icon="fa-undo" class="list-item__icon" style="color: #eb5959;" @click="handleConsumableResetButton('main_brush_work_time', 'Main Brush');"></v-ons-icon>
                        </div>
                    </v-ons-list-item>
                    <v-ons-list-item>
                        <div class="left">
                            Side Brush
                        </div>
                        <div class="center" id="settings-consumables-status-side-brush" style="margin-left:5%">
                            {{ formatTimeRemaining(200, consumables.consumables.side_brush_work_time) }} hours left
                        </div>
                        <div class="right">
                            <v-ons-icon icon="fa-undo" class="list-item__icon" style="color: #eb5959;" @click="handleConsumableResetButton('side_brush_work_time', 'Side Brush');"></v-ons-icon>
                        </div>
                    </v-ons-list-item>
                    <v-ons-list-item>
                        <div class="left">
                            Filter
                        </div>
                        <div class="center" id="settings-consumables-status-filter" style="margin-left:5%">
                            {{ formatTimeRemaining(150, consumables.consumables.filter_work_time) }} hours left
                        </div>
                        <div class="right">
                            <v-ons-icon icon="fa-undo" class="list-item__icon" style="color: #eb5959;" @click="handleConsumableResetButton('filter_work_time', 'Filter');"></v-ons-icon>
                        </div>
                    </v-ons-list-item>
                    <v-ons-list-item>
                        <div class="left">
                            Sensor
                        </div>
                        <div class="center" id="settings-consumables-status-sensor" style="margin-left:5%">
                            {{ formatTimeRemaining(30, consumables.consumables.sensor_dirty_time) }} hours left
                        </div>
                        <div class="right">
                            <v-ons-icon icon="fa-undo" class="list-item__icon" style="color: #eb5959;" @click="handleConsumableResetButton('sensor_dirty_time', 'Sensor');"></v-ons-icon>
                        </div>
                    </v-ons-list-item>
                </v-ons-list>

                <v-ons-list-title style="margin-top:20px;">All-time statistics</v-ons-list-title>
                <v-ons-list>
                    <v-ons-list-item>
                        <div class="left">
                            Total cleaned area:
                        </div>
                        <div class="right" id="settings-consumables-status-statistics-area">
                            {{ formatArea(consumables.summary[1]) }} m²
                        </div>
                    </v-ons-list-item>
                    <v-ons-list-item>
                        <div class="left">
                            Total cleaning hours:
                        </div>
                        <div class="right" id="settings-consumables-status-statistics-hours">
                            {{ formatTime(consumables.summary[0]) }} hours
                        </div>
                    </v-ons-list-item>
                    <v-ons-list-item>
                        <div class="left">
                            Total cleaning count:
                        </div>
                        <div class="right" id="settings-consumables-status-statistics-count">
                            {{ consumables.summary[2] }}
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
import { IConsumables } from "@/api";
import { notification } from "onsenui";

const settings = namespace("settings");

@Component
export default class ConsumableSettings extends Vue {
    @settings.State private consumables!: IConsumables;
    @settings.State private fetching!: boolean;
    @settings.Action private updateConsumables!: () => Promise<boolean>;
    @settings.Action private resetConsumable!: (payload: {
            consumable: string;
    }) => Promise<boolean>;

    public mounted() {
        this.updateConsumables();
    }

    private formatTimeRemaining(start: number, input: number) {
        const timeLeft = Math.max(0, (start - (input / 60 / 60)));
        return timeLeft.toFixed(1);
    }

    private formatTime(input: number) {
        return (input / 60 / 60).toFixed(1);
    }

    private formatArea(input: number) {
        return (input / 1000000).toFixed(1);
    }

    private async handleConsumableResetButton(consumable: string, consumableHumanFriendly: string) {
        const answer = await notification.confirm(`Do you really want to reset ${consumableHumanFriendly}?`) as any;
        if (answer === 1) {
            this.resetConsumable({
                consumable,
            });
        }
    }


}
</script>
