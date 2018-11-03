
import { Module } from "vuex";
import { IZoneGroup, IGotoSpot, IZone } from "@/api";
import { activeApi as api } from "../index";

export interface ZoneState {
    zones: IZoneGroup[];
    gotos: IGotoSpot[];
    fetching: boolean;
    fetchCount: number;
}

export const zones: Module<ZoneState, any> = {
    namespaced: true,
    state: {
        zones: [],
        gotos: [],
        fetching: false,
        fetchCount: 0,
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
        setGotoPoints(state, gotos: IGotoSpot[]) {
            state.gotos = [...gotos];
        },
        setZones(state, newZones: IZoneGroup[]) {
            state.zones = [...newZones];
        },
        addZone(state, newZone: IZoneGroup) {
            const zonegroup = state.zones.find((a) => a.name === newZone.name);
            if (zonegroup) {
                zonegroup.zones.push(newZone.zones[0]);
            } else {
                state.zones.push(newZone);
            }
        },
        removeZone(state, removeZone: IZoneGroup) {
            const newgroups = state.zones.filter((a) => a.name !== removeZone.name);
            state.zones = newgroups;
        },
        addGoto(state, newSpot: IGotoSpot) {
            state.gotos.push(newSpot);
        },
        removeGoto(state, removeSpot: IGotoSpot) {
            const newspots = state.gotos.filter((a) => a.name !== removeSpot.name);
            state.gotos = newspots;
        },
    },
    actions: {
        async updateZonesAndGoto({ commit, state }) {
            commit("setFetchStatus", true);
            const gotoPromise = api.Goto.GetGotoSpots();
            const zonePromise = api.Zones.GetZones();
            const results = await Promise.all([gotoPromise, zonePromise]);
            commit("setFetchStatus", false);
            commit("setGotoPoints", results[0]);
            commit("setZones", results[1]);
        },
        async addZone({commit, dispatch, state}, payload: {
            zone: IZoneGroup;
        }) {
            try {
                commit("setFetchStatus", true);
                commit("addZone", payload.zone);
                await api.Zones.SaveZones(state.zones);
            } finally {
                commit("setFetchStatus", false);
                dispatch("updateZonesAndGoto");
            }
        },
        async removeZone({commit, dispatch, state}, payload: {
            zone: IZoneGroup;
        }) {
            try {
                commit("setFetchStatus", true);
                commit("removeZone", payload.zone);
                await api.Zones.SaveZones(state.zones);
            } finally {
                commit("setFetchStatus", false);
                dispatch("updateZonesAndGoto");
            }
        },
        async addGotoSpot({commit, dispatch, state}, payload: {
            spot: IGotoSpot,
        }) {
            try {
                commit("setFetchStatus", true);
                commit("addGoto", payload.spot);
                await api.Goto.SaveGotoSpots(state.gotos);
            } finally {
                commit("setFetchStatus", false);
                dispatch("updateZonesAndGoto");
            }
        },
        async removeGotoSpot({commit, dispatch, state}, payload: {
            spot: IGotoSpot,
        }) {
            try {
                commit("setFetchStatus", true);
                commit("removeGoto", payload.spot);
                await api.Goto.SaveGotoSpots(state.gotos);
            } finally {
                commit("setFetchStatus", false);
                dispatch("updateZonesAndGoto");
            }
        },
        async zoneCleanup({ commit, dispatch}, payload: { zones: IZone[]}) {
            await api.Zones.ZoneClean(payload.zones);
        },
        async gotoSpot({ commit, dispatch}, payload: { point: [number, number]}) {
            await api.Goto.Goto(payload.point);
        },
    },
};
