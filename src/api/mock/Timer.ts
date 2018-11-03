import { IValetudoTimerApi, ITimer } from "@/api";
import { MockApi } from "@/api/mock";

let fakeTimer: ITimer[] = [{
    id: "1",
    cron: "0 0 1 * *",
    enabled: true,
    human_desc: "At 00:00 on day-of-month 1.",
}];


export class MockTimerApi implements IValetudoTimerApi {
    private parent: MockApi;

    constructor(parent: MockApi) {
      this.parent = parent;
    }

    public Get(): Promise<ITimer[]> {
        return new Promise((res, rej) => {
            setTimeout(() => res(fakeTimer), this.parent.fakeDelay);
        });
    }
    public async CreateTimer(cron: string): Promise<boolean> {
        const newTimer = JSON.parse(JSON.stringify(fakeTimer)) as ITimer[];
        newTimer.push({
            id: Date.now().toString(),
            cron,
            enabled: false,
            human_desc: "",
        });
        fakeTimer = newTimer;
        return true;
    }
    public async DeleteTimer(id: string): Promise<boolean> {
        const newTimer = JSON.parse(JSON.stringify(fakeTimer)) as ITimer[];
        fakeTimer = newTimer.filter((a) => a.id !== id);
        return true;
    }
    public async SetTimerState(id: string, enabled: boolean): Promise<boolean> {
        const newTimer = JSON.parse(JSON.stringify(fakeTimer)) as ITimer[];
        const timer = newTimer.find((a) => a.id === id);
        if (!timer) {
            return false;
        }
        timer.enabled = enabled;
        fakeTimer = newTimer;
        return true;
    }

}
