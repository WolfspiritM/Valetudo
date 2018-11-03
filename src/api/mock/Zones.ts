import {
  cleaningResponse, pausedResponse, idleResponse, sleepingResponse,
  returnHomeResponse, chargingResponse, spotCleaningResponse,
} from "@/api/mock/fakeResponses";
import { IValetudoCommandApi, IValetudoZonesApi, IZone, IGotoSpot, IValetudoGotoApi, IZoneGroup } from "@/api";
import { MockApi } from "@/api/mock";

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

let spots = parseGotoSpots(response.spots);
let areas = parseZoneData(response.areas);


export class MockZonesAndGotoApi implements IValetudoZonesApi, IValetudoGotoApi {
  private parent: MockApi;

  constructor(parent: MockApi) {
    this.parent = parent;
  }

  public GetZones(): Promise<IZoneGroup[]> {
    return new Promise((res) => {
      setTimeout(() => {
        const zonegroups: IZoneGroup[] = areas;
        res(zonegroups);
      }, this.parent.fakeDelay);
    });
  }
  public GetGotoSpots(): Promise<IGotoSpot[]> {
    return new Promise((res) => {
      setTimeout(() => {
        const gotospots: IGotoSpot[] = spots;
        res(gotospots);
      }, this.parent.fakeDelay);
    });
  }

  public SaveZones(zones: IZoneGroup[]): Promise<boolean> {
    return new Promise((res, rej) => {
      setTimeout(() => {
        areas = zones;
        res(true);
      }, this.parent.fakeDelay);
    });
  }

  public SaveGotoSpots(spotsconfig: IGotoSpot[]): Promise<boolean> {
    return new Promise((res, rej) => {
      setTimeout(() => {
        spots = spotsconfig;
        res(true);
      }, this.parent.fakeDelay);
    });
  }

  public ZoneClean(zones: IZone[]): Promise<boolean> {
    return new Promise((res) => {
      setTimeout(() => {
        // tslint:disable-next-line:no-console
        console.log("Starting zone cleanup", zones);
        res(true);
      }, this.parent.fakeDelay);
    });
  }

  public Goto(spot: [number, number]): Promise<boolean> {
    return new Promise((res) => {
      setTimeout(() => {
        // tslint:disable-next-line:no-console
        console.log("Starting goto", spot);
        res(true);
      }, this.parent.fakeDelay);
    });
  }

}
