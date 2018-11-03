<template>
  <v-ons-page :shown="this.active">
      <v-ons-progress-bar indeterminate="indeterminate" v-if="this.loading"></v-ons-progress-bar>
    <div class="content">
        <div class="aspect-ratio" style="text-align: center; position: relative; height: 99%;" id="notouchmovementsarea">
                <canvas ref="manualControlArea"
                        class="fit-img fit-img-tight"
                        style="background-color: #9ea7b833; height: 90%; width: 90%; position:relative; touch-action: none"
                        @mousedown="startManualControlTimer"
                        @mouseenter="startManualControlTimer"
                        @mouseup="stopManualControlTimer"
                        @mouseleave="stopManualControlTimer"
                        @mouseout="stopManualControlTimer"
                        @mousemove="updatePosition"
                ></canvas>
                <div>
                    <v-ons-button class="button-margin" @click="startManualControl()" :disabled="this.controlActive || this.loading">Start Manual Control</v-ons-button>
                    <v-ons-button class="button-margin" @click="stopManualControl()"  :disabled="!this.controlActive || this.loading">Stop Manual Control</v-ons-button>
                </div>
        </div>
      </div>
  </v-ons-page>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import { namespace } from "vuex-class";

const manualControl = namespace("manualControl");

const MAX_VELOCITY = 0.3;
const MIN_VELOCITY = 0.02;  // below this abs limit robot will not move
const MIN_OMEGA = 0.1;      // below this abs limit (currentAngle) robot will not turn
const MIN_OMEGA_DISTANCE = 10;      // below this abs limit (currentAngle) robot will not turn
const UPDATE_INTERVAL_MS = 100;


@Component
export default class ManualControl extends Vue {
    @Prop() public active!: boolean;

    @manualControl.Action public startManualControl: any;
    @manualControl.Action public stopManualControl: any;
    @manualControl.Action public setManualControl: any;


    @manualControl.State public controlActive!: boolean;
    @manualControl.State public loading!: boolean;

    public $refs!: {
        manualControlArea: HTMLCanvasElement;
    };

    private currentYDistance: number = 0;
    private currentXYDistance: number = 0;
    private currentAngle: number = 0;
    private currentVelocity: number = 0;
    private currentOmega: number = 0;

    private timedManualControlLoop: number = 0;

    private mounted() {
        this.init();
    }

    private init() {
        const canvas = this.$refs.manualControlArea;
        this.updateCanvasDimensions();

        const ctx = canvas.getContext("2d");
        if (ctx == null) { return; }

        ctx.fillStyle = "#ff0044";
        ctx.arc(canvas.width / 2, canvas.height / 2, 5, 0, 360, false);
        ctx.fill();
    }

    private getMousePos(canvasDom: HTMLCanvasElement, mouseEvent: MouseEvent) {
        const rect = canvasDom.getBoundingClientRect();
        return {
            x: mouseEvent.clientX - rect.left,
            y: mouseEvent.clientY - rect.top,
        };
    }

    private updateCanvasDimensions() {
        const canvas = this.$refs.manualControlArea;
        canvas.width = canvas.clientWidth;
        canvas.height = canvas.clientHeight;
    }

    private startManualControlTimer(event: MouseEvent) {
        event.preventDefault();
        event.stopPropagation();
        if (!this.timedManualControlLoop && this.controlActive) {
            this.sendManualControl();
            this.timedManualControlLoop = window.setInterval(() => {
                if (!this.controlActive) {
                    this.stopManualControlTimer();
                    return;
                }
                this.sendManualControl();
            }, UPDATE_INTERVAL_MS);
        }
    }

    private stopManualControlTimer() {
        if (this.timedManualControlLoop) {
            window.clearInterval(this.timedManualControlLoop);
            this.timedManualControlLoop = 0;
        }
    }

    private updatePosition(event: MouseEvent) {
        event.preventDefault();
        const m = this.getMousePos(this.$refs.manualControlArea, event);
        this.calculateAngleAndDistance(m);
    }

    private sendManualControl() {
        const cX = this.$refs.manualControlArea.width / 2;
        const cY = this.$refs.manualControlArea.height / 2;
        // limit velocity to square (up, bottom, left, right are to be equal!)
        if (this.currentYDistance > cY) {
            this.currentYDistance = cY;
        }
        this.currentVelocity = (this.currentYDistance / cY) * MAX_VELOCITY;
        // center deadzone
        if (Math.abs(this.currentVelocity) < MIN_VELOCITY) {
            this.currentVelocity = 0;
        }
        if (Math.abs(this.currentAngle) < MIN_OMEGA  || Math.abs(this.currentXYDistance) < MIN_OMEGA_DISTANCE) {
            this.currentOmega = 0;
        } else {
            this.currentOmega = this.currentAngle;
        }
        this.drawValuesToCanvas();
        this.manualMoveRobot(this.currentOmega, this.currentVelocity);
    }

    private manualMoveRobot(angle: number, velocity: number) {
        this.setManualControl({
            angle,
            velocity,
            duration: UPDATE_INTERVAL_MS * 2,
        });
    }

    private drawValuesToCanvas() {
        const ctx = this.$refs.manualControlArea.getContext("2d");
        if (ctx === null) { return; }

        // delete old values / draw background
        ctx.fillStyle = "#FFFFFF"; // #9ea7b833
        ctx.fillRect(0, 0, 200, 50);
        // draw values
        ctx.font = "12px Helvetica";
        ctx.textAlign = "left";
        ctx.fillStyle = "#8A8A8A";
        ctx.fillText(
                "Velocity:\t" + this.currentVelocity.toPrecision(2)
                + "\tOmega:\t" + this.currentOmega.toPrecision(2), 30, 30);
    }

    private calculateAngleAndDistance(m: {x: number, y: number}) {
        const cX = this.$refs.manualControlArea.width / 2;
        const cY = this.$refs.manualControlArea.height / 2;

        const tX = Math.abs(cX - m.x);
        const tY = Math.abs(cY - m.y);
        this.currentYDistance = cY - m.y;
        this.currentXYDistance = Math.floor(Math.sqrt(tX * tX + tY * tY));
        if (m.x < cX) {
            if (m.y < cY) {
                // upper left
                this.currentAngle = - Math.atan((cX - m.x) / (m.y - cY));
            } else {
                // lower left
                if (m.y === cY) {
                    this.currentAngle = 0;
                } else {
                    this.currentAngle = - Math.atan((m.x - cX) / (m.y - cY));
                }
            }
        } else {
            if (m.y < cY) {
                // upper right
                this.currentAngle = Math.atan((cX - m.x) / (cY - m.y));
            } else {
                // lower right
                if (cY === m.y ) {
                    this.currentAngle = 0;
                } else {
                    this.currentAngle = Math.atan( (m.x - cX) / (cY - m.y));
                }
            }
        }
    }


}
</script>
