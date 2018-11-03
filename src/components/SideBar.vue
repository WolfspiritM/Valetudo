<template>
<v-ons-page>
  <div class="profile-header">
          <span>Valetudo</span>
            </div>
            <v-ons-list>
                <v-ons-list-item @click="openPage('/main/home')">
                    <div class="left">
                        <v-ons-icon fixed-width class="list-item__icon" icon="ion-home, material:md-home"></v-ons-icon>
                    </div>
                    <div class="center">
                        Home
                    </div>
                    <div class="right">
                        <v-ons-icon icon="fa-link"></v-ons-icon>
                    </div>
                </v-ons-list-item>
                <v-ons-list-item @click="openPage('/main/map')">
                    <div class="left">
                        <v-ons-icon fixed-width class="list-item__icon" icon="fa-map-marker, material:fa-map-marker"></v-ons-icon>
                    </div>
                    <div class="center">
                        Map
                    </div>
                    <div class="right">
                        <v-ons-icon icon="fa-link"></v-ons-icon>
                    </div>
                </v-ons-list-item>
                <v-ons-list-item @click="openPage('/main/zones')">
                    <div class="left">
                        <v-ons-icon fixed-width class="list-item__icon" icon="fa-share-square, material:fa-share-square"></v-ons-icon>
                    </div>
                    <div class="center">
                        Zones
                    </div>
                    <div class="right">
                        <v-ons-icon icon="fa-link"></v-ons-icon>
                    </div>
                </v-ons-list-item>
                <v-ons-list-item @click="openPage('/main/manualcontrol')">
                        <div class="left">
                            <v-ons-icon fixed-width class="list-item__icon" icon="fa-gamepad, material:fa-gamepad"></v-ons-icon>
                        </div>
                        <div class="center">
                            Manual Control
                        </div>
                        <div class="right">
                            <v-ons-icon icon="fa-link"></v-ons-icon>
                        </div>
                    </v-ons-list-item>
                <v-ons-list-item @click="openPage('/main/settings')">
                    <div class="left">
                        <v-ons-icon fixed-width class="list-item__icon" icon="fa-cog, material: md-settings"></v-ons-icon>
                    </div>
                    <div class="center">
                        Settings
                    </div>
                    <div class="right">
                        <v-ons-icon icon="fa-link"></v-ons-icon>
                    </div>
                </v-ons-list-item>
            </v-ons-list>

            <v-ons-list-title style="margin-top: 10px">Links</v-ons-list-title>
            <v-ons-list>
                <v-ons-list-item @click="openLink('https://github.com/Hypfer/Valetudo')">
                    <div class="left">
                        <v-ons-icon fixed-width class="list-item__icon" icon="ion-social-github"></v-ons-icon>
                    </div>
                    <div class="center">
                        GitHub
                    </div>
                    <div class="right">
                        <v-ons-icon icon="fa-external-link"></v-ons-icon>
                    </div>
                </v-ons-list-item>
                <v-ons-list-item @click="openLink('https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=JQNCDGJ3FBCM6')">
                    <div class="left">
                        <v-ons-icon fixed-width class="list-item__icon" icon="fa-paypal"></v-ons-icon>
                    </div>
                    <div class="center">
                        Donate
                    </div>
                    <div class="right">
                        <v-ons-icon icon="fa-external-link"></v-ons-icon>
                    </div>
                </v-ons-list-item>
                <v-ons-list-item @click="openPage('/main/about')">
                    <div class="left">
                        <v-ons-icon fixed-width class="list-item__icon" icon="fa-info-circle"></v-ons-icon>
                    </div>
                    <div class="center">
                        About
                    </div>
                    <div class="right">
                        <v-ons-icon icon="fa-link"></v-ons-icon>
                    </div>
                </v-ons-list-item>
            </v-ons-list>
  </v-ons-page>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import { namespace } from "vuex-class";

const app = namespace("app");

@Component
export default class SideBar extends Vue {
    @app.Mutation private toggleSideBar!: () => any;

    public openPage(page: string) {
        this.$router.push(page);
        this.toggleSideBar();
    }


    public openLink(url: string) {
        window.open(url, "_blank");
    }

}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
 .profile-header {
      width: 200px;
      margin: 10px auto 10px;
      text-align: center;
      font-size: 2em;
      font-weight: bolder;
  }
  .profile-header > span {
      display: block;
      max-width: 100%;
  }
  ons-list-item {
      color: #444;
  }
</style>
