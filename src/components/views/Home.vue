<template>
  <v-ons-page :shown="this.active">
    <v-ons-progress-bar indeterminate="indeterminate" v-if='!this.vacuumState.connected || this.vacuumState.fetching'></v-ons-progress-bar>
    <div class="content">
      <template v-if="this.vacuumState.connected">
            <section>
                <p class="robot-state" v-if='!this.hasError()'>
                    {{this.getCurrentStatus()}}
                </p>
                <p class="robot-state" v-if='this.hasError()'>
                    <span class="robot-error">
                        <v-ons-icon icon="fa-exclamation-triangle"></v-ons-icon>
                            {{this.vacuum.human_error()}}
                        <v-ons-icon icon="fa-exclamation-triangle"></v-ons-icon>
                    </span>
                </p>
                <div style='width:100%; text-align:center;'>
                    <p id="robot-state-details">
                        <span class='robot-state-details-m2'>Area: {{this.formatCleanArea(this.vacuumState.clean_area)}} m²</span>
                        <span class="robot-state-details-time">Time: {{this.convertTimeToString(this.vacuumState.clean_time)}}</span>
                    </p>
                </div>
            </section>
            <hr style='width:98%; opacity: 0.3'/>
            <section class="robot-control-buttons">
                <v-ons-button v-for='button of this.buttons' :key="button.command" class="button-margin" @click='handleControlButton(button.command)' :disabled='!button.enabled' style='width:40%'>
                    <v-ons-icon :icon="button.icon"></v-ons-icon> {{button.label}}
                </v-ons-button>
            </section>
            <hr style='width:98%; opacity: 0.3'>

            <section style='margin: 10px 16px'>
                <p class="battery-status-text">
                    Battery: {{this.vacuumState.battery}}%
                </p>

                <p>
                    <v-ons-progress-bar id="battery-status-bar" :value="this.vacuumState.battery" secondary-value='100'></v-ons-progress-bar>
                </p>
            </section>
      </template>
    </div>
  </v-ons-page>
</template>

<script lang="ts">
import { Component, Vue, Watch, Prop } from "vue-property-decorator";
import { VacuumState } from "@/store/modules/vacuum";
import { VacuumStateEnum, FanSpeeds, IZoneGroup, IGotoSpot } from "@/api";
import padStart from "lodash-es/padStart";
import { setTimeout } from "timers";
import { openActionSheet } from "onsenui";

import { namespace } from "vuex-class";
const vacuum = namespace("vacuum");
const config = namespace("config");
const zones = namespace("zones");


interface IControlButton {
  label: string;
  icon: string;
  enabled: boolean;
  command: string;
}

@Component
export default class Home extends Vue {
  @vacuum.State((state) => state) public vacuumState!: VacuumState;
  @vacuum.Action public executeCommand: any;

  @config.Action public startStatusRefresh: any;
  @config.Action public stopStatusRefresh: any;

  @zones.Action public gotoSpot!: ( payload: {point: [number, number] }) => any;

  @zones.State public zones!: IZoneGroup[];
  @zones.State public gotos!: IGotoSpot[];
  @zones.Action public updateZonesAndGoto!: any;

  @Prop() public active!: boolean;

  public buttons: IControlButton[] = [
    { label: "Start", command: "start", enabled: false, icon: "fa-play" },
    { label: "Pause", command: "pause", enabled: false, icon: "fa-pause" },
    { label: "Stop", command: "stop", enabled: false, icon: "fa-stop" },
    { label: "Home", command: "home", enabled: false, icon: "fa-home" },
    { label: "Spot", command: "spot", enabled: false, icon: "fa-caret-down" },
    { label: "Find", command: "find", enabled: false, icon: "fa-map-marker" },
    { label: "Go to", command: "goto", enabled: false, icon: "fa-map-signs" },
    { label: "Area", command: "area", enabled: false, icon: "fa-map" },
    { label: "Unknown power", command: "fanspeed", enabled: false, icon: "fa-superpowers" },
  ];

  public getFanSpeed() {
      return FanSpeeds[this.vacuumState.fan_power];
  }


  public getCurrentStatus() {
      return VacuumStateEnum[this.vacuumState.state];
  }

  public hasError() {
      return this.vacuumState.state === VacuumStateEnum.Error;
  }


  @Watch("zones")
  @Watch("gotos")
  public setGotoAndZoneButtonState() {
      const areaButton = this.buttons.find((a) => a.command === "area");
      const gotoButton = this.buttons.find((a) => a.command === "goto");
      if (!areaButton || !gotoButton) { return; }

      areaButton.enabled = false;
      gotoButton.enabled = false;
      if (this.zones.length > 0) {
          areaButton.enabled = true;
      }
      if (this.gotos.length > 0) {
          gotoButton.enabled = true;
      }
  }


  @Watch("vacuumState.in_cleaning")
  @Watch("vacuumState.state")
  @Watch("vacuumState.connected")
  @Watch("vacuumState.fan_power")
  public setButtonState() {
    if (this.vacuumState.connected) {
        this.buttons
            .filter((button) => button.command !== "goto" && button.command !== "area")
            .forEach((button) => button.enabled = true);
    } else {
        this.buttons
            .filter((button) => button.command !== "goto" && button.command !== "area")
            .forEach((button) => button.enabled = false);
        return;
    }
    const pauseButton = this.buttons.find((a) => a.command === "pause");
    const startButton = this.buttons.find((a) => a.command === "start");
    const spotButton = this.buttons.find((a) => a.command === "spot");
    const fanPowerButton = this.buttons.find((a) => a.command === "fanspeed");
    const stopButton = this.buttons.find((a) => a.command === "stop");
    const homeButton = this.buttons.find((a) => a.command === "home");
    if (!pauseButton || !startButton || !spotButton || !fanPowerButton || !stopButton || !homeButton) { return; }
    if (this.vacuumState.in_cleaning) {
        switch (this.vacuumState.state) {
            case VacuumStateEnum.Sleeping:
            case VacuumStateEnum.Idle:
            case VacuumStateEnum.Paused: {
                pauseButton.enabled = false;
                startButton.enabled = true;
                break;
            }
            default: {
                pauseButton.enabled = true;
                startButton.enabled = false;
            }
        }
        spotButton.enabled = false;
    } else {
        pauseButton.enabled = false;
        spotButton.enabled = true;
        if (this.vacuumState.state !== VacuumStateEnum["Returning home"]) {
            startButton.enabled = true;
        } else {
            startButton.enabled = false;
            pauseButton.enabled = true;
        }
    }

    switch (this.vacuumState.state) {
        case VacuumStateEnum.Charging:
        case VacuumStateEnum.Docking:
        case VacuumStateEnum.Paused:
        case VacuumStateEnum.Sleeping:
        case VacuumStateEnum.Idle:
        case VacuumStateEnum["Returning home"]: {
            stopButton.enabled = false;
            break;
        }
        default: {
            stopButton.enabled = true;
        }
    }

    switch (this.vacuumState.state) {
        case VacuumStateEnum.Cleaning:
        case VacuumStateEnum["Returning home"]:
        case VacuumStateEnum.Charging:
        case VacuumStateEnum["Charging problem"]: {
            homeButton.enabled = false;
            break;
        }
        default: {
            homeButton.enabled = true;
        }
    }

    if (this.vacuumState.state === VacuumStateEnum["Spot cleaning"] ) {
        pauseButton.enabled = true;
        stopButton.enabled = false;
    }

    fanPowerButton.label = FanSpeeds[this.vacuumState.fan_power] || `Fan Power: ${this.vacuumState.fan_power}%`;
  }

  public async handleGotoButton() {
    const buttons = [];
    for (const gotoSpot of this.gotos) {
        buttons.push({
            label: gotoSpot.name,
            data: gotoSpot,
        });
    }

    buttons.push({
        label: "Cancel",
        icon: "md-close",
    });

    const result = await openActionSheet({
        title: "Go to",
        cancelable: true,
        buttons,
    });

    if (result < buttons.length - 1) {
        const point = buttons[result].data as IGotoSpot;
        await this.gotoSpot({ point: point.Point});
    }
  }

  public async handleAreaButton() {
    const buttons = [];
    for (const zone of this.zones) {
        buttons.push(zone.name);
    }

    buttons.push({
        label: "Cancel",
        icon: "md-close",
    });

    const result = await openActionSheet({
        title: "Clean area",
        cancelable: true,
        buttons,
    });

    // TODO
  }


  public async handleControlButton(command: string) {
      if (command === "goto") { return this.handleGotoButton(); }
      if (command === "area") { return this.handleAreaButton(); }

      if (command !== "fanspeed") {
        this.executeCommand({ command });
        return;
      }

      const speeds = Object.keys(FanSpeeds).filter((key) => typeof FanSpeeds[key as any]  === "number");

      if (command === "fanspeed") {
        const result = await openActionSheet({
                title: "Select fan speed",
                cancelable: true,
                buttons: [
                    ...speeds,
                    {
                        label: "Cancel",
                        icon: "md-close",
                    },
                ],
        });
        const speed = FanSpeeds[speeds[result] as any];

        if (typeof speed === "undefined") {
            return;
        }
        this.executeCommand({command, speed});
      }
    /* this.$ons.notification.confirm("Not yet implemented: " + command)
      .then((response: any) => {
        // Handle response.
        this.executeCommand(command);
      }); */
  }

  public formatCleanArea(area: number) {
      return (area / 1000000).toFixed(2);
  }

  public convertTimeToString(time: number) {
      const hours = padStart(Math.floor(time / 3600).toString(), 2, "0");
      const minutes = padStart(Math.floor(time % 3600 / 60).toString(), 2, "0");
      const seconds = padStart(Math.floor(time % 3600 % 60).toString(), 2, "0");

      return `${hours}:${minutes}:${seconds}`;
  }

  @Watch("active")
  private activeStateChanged() {
      if (this.active) {
        this.updateZonesAndGoto();
        this.startStatusRefresh("home");
      } else {
        this.stopStatusRefresh("home");
      }
  }

  private mounted() {
      this.setButtonState();
      this.setGotoAndZoneButtonState();
      this.activeStateChanged();
  }

  private destroyed() {
      this.stopStatusRefresh("home");
  }

}
</script>

<style scoped>
 .robot-state {
    text-align: center;
    font-size: 1.2em;
    font-weight: 500;
}
.robot-error {
    color: #eb5959;
}
.robot-control-buttons {
    text-align: center;
}
.robot-control-buttons > ons-button {
    margin: 5px;
    font-size: 1.2em;
}
.robot-state-details-m2 {
    margin-right: 5%;
}
.robot-state-details-time {
    text-align: right;
}
</style>

