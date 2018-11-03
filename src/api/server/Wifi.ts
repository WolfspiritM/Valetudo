import { IWifiSettings, IValetudoWifiApi } from "@/api";
import { ServerApi } from "@/api/server";

export class ServerWifiApi implements IValetudoWifiApi {
    private parent: ServerApi;

    constructor(parent: ServerApi) {
      this.parent = parent;
    }

    public async Get(): Promise<IWifiSettings> {
        const res = await this.parent.request("api/wifi_status");
        return await res.json() as IWifiSettings;
    }
    public async Set(ssid: string, password: string): Promise<boolean> {
        await this.parent.request("api/wifi_configuration", {
            method: "PUT",
            body: JSON.stringify({
                ssid,
                password,
            }),
            headers: {
              "Content-Type": "application/json; charset=utf-8",
            },
        });
        return true;
    }

}
