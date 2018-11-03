import {
  cleaningResponse, pausedResponse, idleResponse, sleepingResponse,
  returnHomeResponse, chargingResponse, spotCleaningResponse,
} from "@/api/mock/fakeResponses";
import { IValetudoCommandApi } from "@/api";
import { ServerApi } from "@/api/server";

export class ServerCommandApi implements IValetudoCommandApi {
  private parent: ServerApi;

  constructor(parent: ServerApi) {
    this.parent = parent;
  }

  public async StartCleaning(): Promise<any> {
    await this.parent.request("api/start_cleaning", {method: "PUT"});
  }

  public async Pause(): Promise<any> {
    await this.parent.request("api/pause_cleaning", {method: "PUT"});
  }

  public async Stop(): Promise<any> {
    await this.parent.request("api/stop_cleaning", {method: "PUT"});
  }

  public async Home(): Promise<any> {
    await this.parent.request("api/drive_home", {method: "PUT"});
  }

  public async Find(): Promise<any> {
    await this.parent.request("api/find_robot", {method: "PUT"});
  }

  public async SpotClean(): Promise<any> {
    await this.parent.request("api/spot_clean", {method: "PUT"});
  }

  public async setFanSpeed(speed: number): Promise<any> {
    await this.parent.request("api/fanspeed", {
      method: "PUT",
      body: JSON.stringify({
        speed,
      }),
      headers: {
        "Content-Type": "application/json; charset=utf-8",
      },
    });
  }

}
