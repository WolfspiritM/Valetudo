<template>
    <v-ons-page>
        <v-ons-toolbar>
            <div class="left">
                <v-ons-back-button>Settings</v-ons-back-button>
            </div>
            <div class="center">Timers</div>
            <div class="right">
                <v-ons-toolbar-button id="settings-timers-create-new-timer" @click="addNewTimer();">
                    <v-ons-icon icon="fa-plus"></v-ons-icon>
                </v-ons-toolbar-button>
            </div>
        </v-ons-toolbar>
        <div class="content">
            <v-ons-progress-bar indeterminate v-if="this.fetching"></v-ons-progress-bar>
            <v-ons-list-title style="margin-top:5px;">Timers</v-ons-list-title>
            <v-ons-list>
                <v-ons-list-item v-for="timer in localTimers" :key="timer.id">
                    <div class="left">{{timer.cron}}</div>
                    <div class="right">
                        <v-ons-switch :disabled="fetching" @click="doToggleTimer(timer)" v-model="timer.enabled" ></v-ons-switch>
                        <v-ons-button :disabled="fetching" @click="doDeleteTimer(timer)" modifier="quiet" class="button-margin timer-delete timer-enabled">
                            <v-ons-icon icon="fa-trash"></v-ons-icon>
                        </v-ons-button>
                    </div>
                </v-ons-list-item>

            </v-ons-list>
        </div>
    </v-ons-page>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from "vue-property-decorator";
import { namespace } from "vuex-class";
import { ITimer } from "@/api";
import { notification } from "onsenui";

const settings = namespace("settings");

@Component
export default class TimerSettings extends Vue {
    @Prop() public active!: boolean;

    @settings.State private timers!: ITimer[];
    @settings.State private fetching!: boolean;
    @settings.Action private updateTimers!: any;
    @settings.Action private setTimerState!: (payload: {
            id: string;
            enabled: boolean;
    }) => Promise<boolean>;
    @settings.Action private deleteTimer!: (payload: {
        id: string;
    }) => Promise<boolean>;
    @settings.Action private createTimer!: (payload: {
        cron: string;
    }) => Promise<boolean>;

    // Workaround cause checked for onsenui switch doesn't seem to work
    // and we shouldn't bind the switch to the store
    private localTimers: ITimer[] | null = null;

    public mounted() {
        this.updateTimers();
    }

    @Watch("timers")
    private timersChanged() {
        this.localTimers = [];
        // Clone the timers so we don't bind to the store
        for (const timer of this.timers) {
            this.localTimers.push({
                ...timer,
            });
        }
    }

    @Watch("active")
    private activeStateChanged() {
        if (this.active) {
            this.updateTimers();
        }
    }

    private doDeleteTimer(timer: ITimer) {
        this.deleteTimer({
            id: timer.id,
        });
    }

    private doToggleTimer(timer: ITimer) {
        const t = this.timers.find((a) => a.id === timer.id);
        if (t) {
            this.setTimerState({
                id: t.id,
                enabled: !t.enabled,
            });
        }
    }

    private async addNewTimer() {
        const input = await notification.prompt("Please enter the new timer in cron syntax.") as any;
        if (input && input !== "") {
            this.createTimer({
                cron: input,
            });
        }
    }
}
</script>

<style>
    .timer-delete {
        margin-left: 12px;
        font-size: 2em;
        color: #eb5959;
    }
</style>