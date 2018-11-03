import { Module } from "vuex";
import { activeApi as api } from "../index";

export interface ManualControlState {
    controlActive: boolean;
    loading: boolean;
}

export const manualControl: Module<ManualControlState, any> = {
    namespaced: true,
    state: {
        controlActive: false,
        loading: false,
    },
    mutations: {
        setControlState(state, newState: boolean) {
            state.controlActive = newState;
        },
        setLoadingState(state, loading: boolean) {
            state.loading = loading;
        },
    },
    actions: {
        async startManualControl({ commit }) {
            commit("setLoadingState", true);
            await api.ManualControl.StartManualControl();
            commit("setLoadingState", false);
            commit("setControlState", true);
        },
        async stopManualControl({ commit }) {
            commit("setLoadingState", true);
            await api.ManualControl.StopManualControl();
            commit("setLoadingState", false);
            commit("setControlState", false);
        },
        async setManualControl({ dispatch }, payload: {
            angle: number,
            velocity: number,
            duration: number,
        }) {
            await api.ManualControl.SetManualControl(payload.angle, payload.velocity, payload.duration);
        },
    },
};
