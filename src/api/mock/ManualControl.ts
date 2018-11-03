import { IValetudoManualControlApi } from "@/api";
import { MockApi } from "@/api/mock";

export class MockManualControlApi implements IValetudoManualControlApi {
    private parent: MockApi;

    constructor(parent: MockApi) {
      this.parent = parent;
    }

    public StartManualControl(): Promise<boolean> {
        // tslint:disable-next-line:no-console
        console.log("Starting manual control");
        return new Promise((res, rej) => {
            setTimeout(() => res(true), this.parent.fakeDelay);
        });
    }

    public StopManualControl(): Promise<boolean> {
        // tslint:disable-next-line:no-console
        console.log("Stopping manual control");
        return new Promise((res, rej) => {
            setTimeout(() => res(true), this.parent.fakeDelay);
        });
    }

    public SetManualControl(angle: number, velocity: number, duration: number): Promise<boolean> {
       return new Promise((res, rej) => {
        setTimeout(() => res(true), this.parent.fakeDelay);
    });
    }
}
