import { IValetudoApi, IStatusResponse, IValetudoCommandApi, IValetudoZonesApi,
          IValetudoGotoApi, VacuumStateEnum, IValetudoMapApi,
          IValetudoManualControlApi, IValetudoTimerApi, IValetudoConsumablesApi,
          IValetudoWifiApi, IValetudoSoundApi, IDeviceInfo } from "@/api";
import { MockCommandApi } from "@/api/mock/Command";
import { chargingResponse } from "@/api/mock/fakeResponses";
import { MockZonesAndGotoApi } from "@/api/mock/Zones";
import { MockMapApi } from "@/api/mock/Map";
import { MockManualControlApi } from "@/api/mock/ManualControl";
import { MockTimerApi } from "@/api/mock/Timer";
import { MockConsumablesApi } from "@/api/mock/Consumables";
import { MockWifiApi } from "@/api/mock/Wifi";
import { MockSoundApi } from "@/api/mock/Sound";

// tslint:disable-next-line:max-classes-per-file
export class MockApi implements IValetudoApi {
  public Goto: IValetudoGotoApi  = new MockZonesAndGotoApi(this);
  public Command: IValetudoCommandApi = new MockCommandApi(this);
  public Map: IValetudoMapApi = new MockMapApi(this);
  public Zones: IValetudoZonesApi = this.Goto as MockZonesAndGotoApi;
  public ManualControl: IValetudoManualControlApi = new MockManualControlApi(this);
  public Timer: IValetudoTimerApi = new MockTimerApi(this);
  public Consumables: IValetudoConsumablesApi = new MockConsumablesApi(this);
  public Wifi: IValetudoWifiApi = new MockWifiApi(this);
  public Sound: IValetudoSoundApi = new MockSoundApi(this);

  public currentResponse: IStatusResponse = {...chargingResponse};
  public fakeBattery: number = 90;
  public fakeArea: number = 0;
  public fakeTime: number = 0;
  public inCleaning: boolean = false;
  public fanSpeed: number = this.currentResponse.fan_power;
  public fakeDelay: number = 300;

  constructor() {
    setInterval(() => {
      if (this.currentResponse.state === VacuumStateEnum.Charging && this.fakeBattery < 100) {
        this.fakeBattery++;
        if (this.fakeBattery > 100) { this.fakeBattery = 100; }
      } else if (this.currentResponse.state === VacuumStateEnum.Cleaning
        || this.currentResponse.state === VacuumStateEnum["Spot cleaning"]) {
        this.fakeBattery -= 0.1;
      } else {
        this.fakeBattery -= 0.001;
      }
    }, 1000);
  }

  public GetCurrentStatus(): Promise<IStatusResponse> {
    // tslint:disable-next-line:no-console
    console.log("Updating...", this.Command);
    return new Promise<IStatusResponse>((res, rej) => {
      setTimeout(() => {
        if (this.fakeBattery === 10) { rej("Error"); }
        this.currentResponse.battery = Math.round(this.fakeBattery);
        this.currentResponse.in_cleaning = this.inCleaning;
        this.currentResponse.fan_power = this.fanSpeed;
        this.currentResponse.clean_area = Math.round(this.fakeArea);
        this.currentResponse.clean_time = Math.round(this.fakeTime);
        res(this.currentResponse);
      }, 100);
    });
  }

  public GetDeviceInfo(): Promise<IDeviceInfo> {
    return new Promise<IDeviceInfo>((res, rej) => {
      setTimeout(() => {
        res({
          build: "1337",
          version: "MOCK",
        });
      }, 100);
    });
  }

  public GetToken(): Promise<string> {
    return new Promise((res, rej) => {
        res("1234567890abcdef1234567890abcdef");
    });
  }
}
