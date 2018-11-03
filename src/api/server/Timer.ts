import { IValetudoTimerApi, ITimer } from "@/api";
import { ServerApi } from "@/api/server";

export class ServerTimerApi implements IValetudoTimerApi {
    private parent: ServerApi;

    constructor(parent: ServerApi) {
      this.parent = parent;
    }

    public async Get(): Promise<ITimer[]> {
        const response = await this.parent.request("api/timers");
        const timer = await response.json() as ITimer[];
        return timer;
    }

    public async CreateTimer(cron: string): Promise<boolean> {
        await this.parent.request("api/timers", {
            method: "POST",
            body: JSON.stringify({
              cron,
            }),
            headers: {
              "Content-Type": "application/json; charset=utf-8",
            },
        });
        return true;
    }
    public async DeleteTimer(id: string): Promise<boolean> {
        await this.parent.request("api/timers/" + id, {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json; charset=utf-8",
            },
        });
        return true;
    }
    public async SetTimerState(id: string, enabled: boolean): Promise<boolean> {
        await this.parent.request("api/timers/" + id, {
            method: "PUT",
            body: JSON.stringify({
              enabled,
            }),
            headers: {
              "Content-Type": "application/json; charset=utf-8",
            },
        });
        return true;
    }

}
