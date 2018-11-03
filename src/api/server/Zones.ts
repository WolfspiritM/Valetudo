import {
  cleaningResponse, pausedResponse, idleResponse, sleepingResponse,
  returnHomeResponse, chargingResponse, spotCleaningResponse,
} from "@/api/mock/fakeResponses";
import { IValetudoCommandApi, IValetudoZonesApi, IZone, IGotoSpot, IValetudoGotoApi, IZoneGroup } from "@/api";
import { ServerApi } from "@/api/server";

const response = {
  spots: [
    [
      "My go to point",
      100,
      100,
    ],
  ],
  areas: [
    [
      "test",
      [
        [
          500,
          500,
          1000,
          1000,
          2,
        ],
      ],
    ],
  ],
};

function parseGotoSpots(data: any) {
  const gotospots: IGotoSpot[] = [];
  for (const spot of data) {
    const spotdata = spot as [string, number, number];
    gotospots.push({
      name: spotdata[0],
      Point: [spotdata[1], spotdata[2]],
    });
  }
  return gotospots;
}

function parseZoneData(zoneData: any) {
  const zonegroups: IZoneGroup[] = [];
  for (const area of zoneData) {
    const zonegroup: IZoneGroup = {
      name: area[0] as string,
      zones: [],
    };
    for (const data of area[1]) {
      const zonedata = data as [number, number, number, number, number];
      zonegroup.zones.push({
        Point1: [zonedata[0], zonedata[1]],
        Point2: [zonedata[2], zonedata[3]],
        iterations: zonedata[4],
      });
    }
    zonegroups.push(zonegroup);
  }
  return zonegroups;
}

let latestConfig: any = null;

export class ServerZonesAndGotoApi implements IValetudoZonesApi, IValetudoGotoApi {
  private parent: ServerApi;

  constructor(parent: ServerApi) {
    this.parent = parent;
  }

  public async GetZones(): Promise<IZoneGroup[]> {
    const res = await this.parent.request("api/get_config");
    const data = await res.json();
    latestConfig = data;
    const zones = parseZoneData(data.areas);
    return zones;
  }

  public async GetGotoSpots(): Promise<IGotoSpot[]> {
    const res = await this.parent.request("api/get_config");
    const data = await res.json();
    latestConfig = data;
    const gotospots = parseGotoSpots(data.spots);
    return gotospots;
  }

  public async SaveZones(zonesconfig: IZoneGroup[]): Promise<boolean> {
    const config = latestConfig;
    config.areas = [];
    for (const zonegroup of zonesconfig) {
      const zonedata = [];
      for (const zone of zonegroup.zones) {
        zonedata.push([zone.Point1[0], zone.Point1[1], zone.Point2[0], zone.Point2[1], zone.iterations]);
      }
      config.areas.push([zonegroup.name, zonedata]);
    }

    await this.parent.request("api/set_config", {
      method: "PUT",
      body: JSON.stringify({
        config,
      }),
      headers: {
        "Content-Type": "application/json; charset=utf-8",
      },
    });
    return true;
  }

  public async SaveGotoSpots(spots: IGotoSpot[]): Promise<boolean> {
    const config = latestConfig;
    config.spots = [];
    for (const spot of spots) {
      config.spots.push([spot.name, spot.Point[0], spot.Point[1]]);
    }

    await this.parent.request("api/set_config", {
      method: "PUT",
      body: JSON.stringify({
        config,
      }),
      headers: {
        "Content-Type": "application/json; charset=utf-8",
      },
    });
    return true;
  }

  public async ZoneClean(zones: IZone[]): Promise<boolean> {
    const cleanZones = [];
    for (const zone of zones) {
      cleanZones.push([zone.Point1[0], zone.Point1[1],
                       zone.Point2[0], zone.Point2[1],
                       zone.iterations]);
    }

    await this.parent.request("api/start_cleaning_zone", {
      method: "PUT",
      body: JSON.stringify(cleanZones),
      headers: {
        "Content-Type": "application/json; charset=utf-8",
      },
    });
    return true;
  }

  public async Goto(spot: [number, number]): Promise<boolean> {
    await this.parent.request("api/go_to", {
      method: "PUT",
      body: JSON.stringify({
        x: spot[0],
        y: spot[1],
      }),
      headers: {
        "Content-Type": "application/json; charset=utf-8",
      },
    });
    return true;
  }

}
