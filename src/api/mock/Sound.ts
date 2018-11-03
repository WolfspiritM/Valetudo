import { IWifiSettings, IValetudoSoundApi } from "@/api";
import { MockApi } from "@/api/mock";

export class MockSoundApi implements IValetudoSoundApi {
    private parent: MockApi;

    constructor(parent: MockApi) {
      this.parent = parent;
    }

    public GetVolume(): Promise<number> {
        return new Promise((res, rej) => {
            setTimeout(() => res(90), this.parent.fakeDelay);
        });
    }
    public SetVolume(volume: number): Promise<boolean> {
        // tslint:disable-next-line:no-console
        console.log(`Saving volume: '${volume}'`);
        return new Promise((res, rej) => {
            setTimeout(() => res(true), this.parent.fakeDelay);
        });
    }

    public async TestVolume() {
        // tslint:disable-next-line:no-console
        console.log(`Testing volume!`);
        return true;
    }

}
