import {
  cleaningResponse, pausedResponse, idleResponse, sleepingResponse,
  returnHomeResponse, chargingResponse, spotCleaningResponse,
} from "@/api/mock/fakeResponses";
import { IValetudoMapApi, IMapAndPathData } from "@/api";
import { MockApi } from "@/api/mock";

function base64toArrayBuffer(data: string) {
  const raw = window.atob(data);
  const rawLength = raw.length;
  const buffer = new ArrayBuffer(rawLength);
  const array = new Uint8Array(buffer);
  for (let i = 0; i < rawLength; i++) {
    array[i] = raw.charCodeAt(i);
  }
  return buffer;
}

async function createMapData() {
  const res = await fetch("http://localhost/api/map/latest");
  const resdata = await res.json();
  const mapBuffer = base64toArrayBuffer(resdata.map);
  // tslint:disable-next-line:no-console
  console.log(mapBuffer);

  const data: IMapAndPathData = {
      map : base64toArrayBuffer(resdata.map),
      path: base64toArrayBuffer(resdata.path),
  };

  /*const buffer = new ArrayBuffer(1024 * 1024 * (4 + 3));
  const data = new DataView(buffer);
  let position = 0;

  for (let i = 0; i < 1024 * 1024; i += 1) {
    let color = 255;

    const x = Math.floor(i % (1024 * 4));
    const y = i % (1024 * 4);

    if ( y === 0 || x === 0) {
      color = 0;
    }
    binary.push(i, color, color, color);
    data.setUint32(position++, i);
    position += 3;
    data.setUint8(position++, color);
    data.setUint8(position++, color);
    data.setUint8(position++, color);
  }*/


  return data;
}

export class MockMapApi implements IValetudoMapApi {
  private parent: MockApi;

  constructor(parent: MockApi) {
    this.parent = parent;
  }

  public async GetLatestMapData(): Promise<IMapAndPathData> {
    // tslint:disable-next-line:no-console
    console.log("Getting map data...");
    const data: IMapAndPathData = await createMapData();
    return data;
  }

}
