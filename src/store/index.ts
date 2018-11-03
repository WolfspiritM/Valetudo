import Vue from "vue";
import Vuex from "vuex";


import { IValetudoApi, Api, IMapAndPathData } from "@/api";

const api: IValetudoApi = new Api();

export { api as activeApi };


Vue.use(Vuex);

const debug = process.env.NODE_ENV !== "production";

import { app } from "./modules/app";
import { vacuum } from "./modules/vacuum";
import { config } from "./modules/config";
import { map } from "./modules/map";
import { manualControl } from "./modules/manualControl";
import { zones } from "./modules/zones";
import { settings } from "./modules/settings";

export default new Vuex.Store({
  strict: debug,
  modules: {
    app,
    vacuum,
    config,
    map,
    manualControl,
    zones,
    settings,
  },
});
