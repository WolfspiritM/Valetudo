<template>
  <v-ons-page>
    <div class="content">
        <v-ons-card @click="openSettings('infoSettings')">
            <div class="title"><v-ons-icon icon="fa-info"></v-ons-icon> Info</div>
            <div class="content">View device information</div>
        </v-ons-card>
        <v-ons-card @click="openSettings('timerSettings')">
            <div class="title"><v-ons-icon icon="fa-clock-o"></v-ons-icon> Timers</div>
            <div class="content">Manage timers</div>
        </v-ons-card>
        <v-ons-card @click="openSettings('consumableSettings')">
            <div class="title"><v-ons-icon icon="fa-wrench"></v-ons-icon> Consumables</div>
            <div class="content">View and/or reset consumable usage counters</div>
        </v-ons-card>
        <v-ons-card @click="openSettings('wifiSettings')">
            <div class="title"><v-ons-icon icon="fa-wifi"></v-ons-icon> Wifi</div>
            <div class="content">View/change wifi details and settings</div>
        </v-ons-card>
        <v-ons-card @click="openSettings('tokenSettings')">
            <div class="title"><v-ons-icon icon="fa-key"></v-ons-icon> Token</div>
            <div class="content">View the current token</div>
        </v-ons-card>
        <v-ons-card @click="openSettings('soundSettings')">
            <div class="title"><v-ons-icon icon="fa-volume-up"></v-ons-icon> Sound Volume</div>
            <div class="content">Change the sound volume</div>
        </v-ons-card>
    </div>
  </v-ons-page>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

@Component
export default class ManualControl extends Vue {
    public openSettings(page: string) {
        this.$router.push({name : page});
    }
}
</script>
