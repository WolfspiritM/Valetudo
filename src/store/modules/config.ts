
import { Module } from "vuex";

export interface ConfigState {
    statusRefreshInstances: string[];
    mapRefreshInstances: string[];
    updateInterval: number;
    refreshId: number;
    mapRefreshId: number;
}

export const config: Module<ConfigState, any> = {
    namespaced: true,
    state: {
        statusRefreshInstances: [],
        mapRefreshInstances: [],
        updateInterval: 5000,
        refreshId: 0,
        mapRefreshId: 0,
    },
    mutations: {
        incrementStatusRefreshCounter(state, instance: string) {
            state.statusRefreshInstances.push(instance);
        },
        decrementStatusRefreshCounter(state, instance: string) {
            state.statusRefreshInstances = state.statusRefreshInstances.filter((a) => a !== instance);
            if (state.statusRefreshInstances.length <= 0) { state.refreshId++; }
        },
        incrementMapRefreshCounter(state, instance: string) {
            state.mapRefreshInstances.push(instance);
        },
        decrementtMapRefreshCounter(state, instance: string) {
            state.mapRefreshInstances = state.mapRefreshInstances.filter((a) => a !== instance);
            if (state.mapRefreshInstances.length <= 0) { state.mapRefreshId++; }
        },
    },
    actions: {
        async startStatusRefresh({commit, state, dispatch}, instance: string) {
            const currentCounter = state.statusRefreshInstances.length;
            commit("incrementStatusRefreshCounter", instance);
            if (currentCounter === 0) {
                const currentRefreshId = state.refreshId;
                const update = async () => {
                    if (state.statusRefreshInstances.length <= 0 || state.refreshId !== currentRefreshId) { return; }
                    try {
                        await dispatch("vacuum/updateVacuumStatus", null,  {root: true});
                    } finally {
                        setTimeout(update, state.updateInterval);
                    }
                };
                update();
            }
        },
        async startMapRefresh({commit, state, dispatch}, instance: string) {
            const currentCounter = state.mapRefreshInstances.length;
            commit("incrementMapRefreshCounter", instance);
            if (currentCounter === 0) {
                const currentRefreshId = state.mapRefreshId;
                const update = async () => {
                    if (state.mapRefreshInstances.length <= 0 || state.mapRefreshId !== currentRefreshId) { return; }
                    try {
                        await dispatch("map/updateMapData", null,  {root: true});
                    } finally {
                        setTimeout(update, state.updateInterval);
                    }
                };
                update();
            }
        },
        async stopStatusRefresh({commit, state, dispatch}, instance: string) {
            commit("decrementStatusRefreshCounter", instance);
        },
        async stopMapRefresh({commit, state, dispatch}, instance: string) {
            commit("decrementtMapRefreshCounter", instance);
        },
    },
};
