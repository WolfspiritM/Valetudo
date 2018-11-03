import { IWifiSettings, IValetudoSoundApi } from "@/api";
import { ServerApi } from "@/api/server";

export class ServerSoundApi implements IValetudoSoundApi {
    private parent: ServerApi;

    constructor(parent: ServerApi) {
      this.parent = parent;
    }

    public async GetVolume(): Promise<number> {
        const res = await this.parent.request("api/get_sound_volume");
        const data = await res.json();
        return data;
    }
    public async SetVolume(volume: number): Promise<boolean> {
        const res = await this.parent.request("api/set_sound_volume", {
            method: "PUT",
            body: JSON.stringify({
                volume,
            }),
            headers: {
                "Content-Type": "application/json; charset=utf-8",
            },
        });
        const data = await res.json();
        if (data === "ok") {
            return true;
        } else {
            return false;
        }
    }

    public async TestVolume() {
        const res = await this.parent.request("api/test_sound_volume", {
            method: "PUT",
        });
        const data = await res.json();
        if (data === "ok") {
            return true;
        } else {
            return false;
        }
    }

}
