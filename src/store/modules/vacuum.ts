
import { Module } from "vuex";
import { IStatusResponse } from "@/api";
import { activeApi as api } from "../index";

export interface VacuumState extends IStatusResponse {
    connected: boolean;
    fetching: boolean;
}

export const vacuum: Module<VacuumState, any> = {
    namespaced: true,
    state: {
        connected: false,
        fetching: false,
        battery: 0,
        in_cleaning: false,
        state: 0,
        human_error: "",
        dnd_enabled: false,
        map_present: false,
        clean_area: 0,
        clean_time: 0,
        fan_power: 0,
    },
    mutations: {
        setStateFromApi(state, response: IStatusResponse) {
            state.connected = true;
            for (const test in response) {
                if (response.hasOwnProperty(test)) {
                    (state as any)[test] = (response as any)[test];
                }
            }
        },
        setFetchStatus(state, fetching: boolean) {
            state.fetching = fetching;
        },
    },
    actions: {
        async updateVacuumStatus({ commit, state }) {
            commit("setFetchStatus", true);
            const status = await api.GetCurrentStatus();
            commit("setFetchStatus", false);
            commit("setStateFromApi", status);
        },
        async executeCommand({ dispatch }, command:
            { command: "start" | "pause" | "stop" | "home" | "find" | "spot" } |
            { command: "fanspeed", speed: number }) {
            switch (command.command) {
                case "start": {
                    await api.Command.StartCleaning();
                    break;
                }
                case "pause": {
                    await api.Command.Pause();
                    break;
                }
                case "stop": {
                    await api.Command.Stop();
                    break;
                }
                case "home": {
                    await api.Command.Home();
                    break;
                }
                case "find": {
                    await api.Command.Find();
                    break;
                }
                case "spot": {
                    await api.Command.SpotClean();
                    break;
                }
                case "fanspeed": {
                    const test = command.speed;
                    await api.Command.setFanSpeed(command.speed);
                    break;
                }
            }
            await dispatch("updateVacuumStatus");
        },
    },
};
