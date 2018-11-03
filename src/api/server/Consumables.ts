import { IConsumables, IValetudoConsumablesApi } from "@/api";
import { ServerApi } from "@/api/server";

export class ServerConsumablesApi implements IValetudoConsumablesApi {
    private parent: ServerApi;

    constructor(parent: ServerApi) {
      this.parent = parent;
    }

    public async Get(): Promise<IConsumables> {
        const response = await this.parent.request("api/consumable_status");
        return await response.json() as IConsumables;
    }
    public async Reset(consumable: string): Promise<boolean> {
        const res = await this.parent.request("api/reset_consumable", {
            method: "PUT",
            body: JSON.stringify({
                consumable,
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
}
