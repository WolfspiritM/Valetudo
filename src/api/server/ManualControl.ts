import { IValetudoManualControlApi } from "@/api";
import { ServerApi } from "@/api/server";

export class ServerManualControlApi implements IValetudoManualControlApi {
    private parent: ServerApi;
    private sequenceId = 0;

    constructor(parent: ServerApi) {
      this.parent = parent;
    }

    public async StartManualControl(): Promise<boolean> {
        await this.parent.request("api/start_manual_control", {method: "PUT"});
        return true;
    }

    public async StopManualControl(): Promise<boolean> {
        await this.parent.request("api/stop_manual_control", {method: "PUT"});
        return true;
    }

    public async SetManualControl(angle: number, velocity: number, duration: number): Promise<boolean> {
        const data = {
            sequenceId: this.sequenceId++,
            angle,
            velocity,
            duration,
        };

        await this.parent.request("api/set_manual_control", {
            method: "PUT",
            body: JSON.stringify(data),
            headers: {
                "Content-Type": "application/json; charset=utf-8",
            },
        });
        return true;
    }
}
