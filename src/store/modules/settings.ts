
import { Module } from "vuex";
import { ITimer, IConsumables, IWifiSettings, IDeviceInfo } from "@/api";
import { activeApi as api } from "../index";

export interface SettingsState {
    wifi: IWifiSettings | null;
    info: IDeviceInfo | null;
    timers: ITimer[];
    fetching: boolean;
    fetchCount: number;
    consumables: IConsumables | null;
    token: string;
    sound: {
        volume: number | null;
    };
}

export const settings: Module<SettingsState, any> = {
    namespaced: true,
    state: {
        info: null,
        fetching: false,
        fetchCount: 0,
        timers: [],
        consumables: null,
        wifi: null,
        token: "????????????????????????????????",
        sound: {
            volume: null,
        },
    },
    mutations: {
        setFetchStatus(state, fetching: boolean) {
            if (fetching) {
                state.fetchCount++;
            } else {
                state.fetchCount--;
            }
            if (state.fetchCount < 0) { state.fetchCount = 0; }
            state.fetching = state.fetchCount > 0;
        },
        setTimer(state, timers: ITimer[]) {
            state.timers = [...timers];
        },
        setConsumables(state, consumables: IConsumables) {
            state.consumables = {...consumables};
        },
        setInfo(state, info: IDeviceInfo) {
            state.info = {...info};
        },
        setWifi(state, wifi: IWifiSettings) {
            state.wifi = {...wifi};
        },
        setToken(state, token: string) {
            state.token = token;
        },
        setVolume(state, volume: number) {
            state.sound.volume = volume;
        },
    },
    actions: {

        // INFO
        async updateInfo({ commit, state }) {
            try {
                commit("setFetchStatus", true);
                commit("setInfo", await api.GetDeviceInfo());
            } finally {
                commit("setFetchStatus", false);
            }
        },

        // TIMER

        async updateTimers({ commit, state }) {
            try {
                commit("setFetchStatus", true);
                commit("setTimer", await api.Timer.Get());
            } finally {
                commit("setFetchStatus", false);
            }
        },
        async createTimer({ commit, dispatch }, payload: {
            cron: string;
        }) {
            try {
                commit("setFetchStatus", true);
                await api.Timer.CreateTimer(payload.cron);
            } finally {
                commit("setFetchStatus", false);
                dispatch("updateTimers");
            }
        },
        async deleteTimer({ commit, dispatch }, payload: {
            id: string;
        }) {
            try {
                commit("setFetchStatus", true);
                await api.Timer.DeleteTimer(payload.id);
            } finally {
                commit("setFetchStatus", false);
                dispatch("updateTimers");
            }
        },
        async setTimerState({ commit, dispatch }, payload: {
            id: string;
            enabled: boolean;
        }) {
            try {
                commit("setFetchStatus", true);
                await api.Timer.SetTimerState(payload.id, payload.enabled);
            } finally {
                commit("setFetchStatus", false);
                dispatch("updateTimers");
            }
        },

        // CONSUMABLES:
        async updateConsumables({ commit, state }) {
            try {
                commit("setFetchStatus", true);
                commit("setConsumables", await api.Consumables.Get());
            } finally {
                commit("setFetchStatus", false);
            }
        },
        async resetConsumable({ commit, dispatch }, payload: {
            consumable: string,
        }) {
            try {
                commit("setFetchStatus", true);
                await api.Consumables.Reset(payload.consumable);
            } finally {
                commit("setFetchStatus", false);
                dispatch("updateConsumables");
            }
        },


        // WIFI
        async updateWifi({ commit, state }) {
            try {
                commit("setFetchStatus", true);
                commit("setWifi", await api.Wifi.Get());
            } finally {
                commit("setFetchStatus", false);
            }
        },
        async setWifi({ commit, dispatch }, payload: {
            ssid: string,
            password: string,
        }) {
            try {
                commit("setFetchStatus", true);
                const timers = await api.Wifi.Set(payload.ssid, payload.password);
            } finally {
                commit("setFetchStatus", false);
                dispatch("updateConsumables");
            }
        },

        // TOKEN
        async updateToken({ commit, state }) {
            try {
                commit("setFetchStatus", true);
                commit("setToken", await api.GetToken());
            } finally {
                commit("setFetchStatus", false);
            }
        },

        // Sound
        async updateVolume({ commit, state }) {
            try {
                commit("setFetchStatus", true);
                commit("setVolume", await api.Sound.GetVolume());
            } finally {
                commit("setFetchStatus", false);
            }
        },
        async setVolume({ commit, dispatch }, payload: {
            volume: number;
        }) {
            try {
                commit("setFetchStatus", true);
                await api.Sound.SetVolume(payload.volume);
            } finally {
                commit("setFetchStatus", false);
                dispatch("updateVolume");
            }
        },
        async testVolume({ commit, dispatch }, payload: {
            volume: number;
        }) {
            try {
                commit("setFetchStatus", true);
                await api.Sound.TestVolume();
            } finally {
                commit("setFetchStatus", false);
                dispatch("updateVolume");
            }
        },
    },
};
