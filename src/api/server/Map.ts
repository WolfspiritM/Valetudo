import { IValetudoMapApi, IMapAndPathData } from "@/api";
import { ServerApi } from "@/api/server";

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

export class ServerMapApi implements IValetudoMapApi {
  private parent: ServerApi;

  constructor(parent: ServerApi) {
    this.parent = parent;
  }

  public async GetLatestMapData(): Promise<IMapAndPathData> {
    const res = await this.parent.request("api/map/latest");
    const resdata = await res.json();
    const data: IMapAndPathData = {
        map : base64toArrayBuffer(resdata.map),
        path: base64toArrayBuffer(resdata.path),
    };
    return data;
  }

}
