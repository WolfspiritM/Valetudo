import { IWifiSettings, IValetudoWifiApi } from "@/api";
import { MockApi } from "@/api/mock";

export class MockWifiApi implements IValetudoWifiApi {
    private parent: MockApi;

    constructor(parent: MockApi) {
      this.parent = parent;
    }

    public Get(): Promise<IWifiSettings> {
        return new Promise((res, rej) => {
            setTimeout(() => res({
                connected: true,
                connection_info: {
                    bssid: "aa:bb:cc:dd:ee:ff",
                    ssid: "Wifi SSID",
                    freq: "1234",
                    signal: "-45 dBm",
                    tx_bitrate: "50.0 MBit/s",
                }}), this.parent.fakeDelay);
        });
    }
    public Set(ssid: string, password: string): Promise<boolean> {
        // tslint:disable-next-line:no-console
        console.log(`Saving wifi setting: SSID: '${ssid}' Pass: '${password}'`);
        return new Promise((res, rej) => {
            setTimeout(() => res(true), this.parent.fakeDelay);
        });
    }

}
