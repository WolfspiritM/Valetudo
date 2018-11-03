
import { Module } from "vuex";
import { IMapAndPathData } from "@/api";
import { activeApi as api } from "../index";


export interface MapState {
    data: IMapAndPathData | null;
    fetching: boolean;
}

export const map: Module<MapState, any> = {
    namespaced: true,
    state: {
        data: null,
        fetching: false,
    },
    mutations: {
        setStateFromApi(state, data: IMapAndPathData) {
            state.data = data;
        },
        setFetchStatus(state, fetching: boolean) {
            state.fetching = fetching;
        },
    },
    actions: {
        async updateMapData({ commit, state }) {
            commit("setFetchStatus", true);
            const status = await api.Map.GetLatestMapData();
            // status.freeze();
            Object.freeze(status);
            commit("setFetchStatus", false);
            commit("setStateFromApi", status);
        },
    },
};
