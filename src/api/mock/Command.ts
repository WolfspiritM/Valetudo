import {
  cleaningResponse, pausedResponse, idleResponse, sleepingResponse,
  returnHomeResponse, chargingResponse, spotCleaningResponse,
} from "@/api/mock/fakeResponses";
import { IValetudoCommandApi } from "@/api";
import { MockApi } from "@/api/mock";

export class MockCommandApi implements IValetudoCommandApi {
  private parent: MockApi;

  constructor(parent: MockApi) {
    this.parent = parent;
  }

  public StartCleaning(): Promise<any> {
    this.parent.currentResponse = cleaningResponse;
    this.parent.inCleaning = true;
    this.parent.fakeArea = 0;
    const start = performance.now();
    setInterval(() => {
      if (this.parent.currentResponse.state === cleaningResponse.state) {
        this.parent.fakeTime = Math.round((performance.now() - start) / 1000);
        this.parent.fakeArea += 1000 + Math.floor(Math.random() * Math.floor(8000));
      }
    }, 1000);
    return Promise.resolve();
  }

  public Pause(): Promise<any> {
    this.parent.currentResponse = pausedResponse;
    setTimeout(() => {
      if (this.parent.currentResponse.state === pausedResponse.state) {
        this.parent.currentResponse = { ...sleepingResponse };
      }
    }, 4000);
    return Promise.resolve();
  }

  public Stop(): Promise<any> {
    this.parent.currentResponse = idleResponse;
    this.parent.inCleaning = false;
    setTimeout(() => {
      if (this.parent.currentResponse.state === idleResponse.state) {
        this.parent.currentResponse = { ...sleepingResponse };
      }
    }, 4000);
    return Promise.resolve();
  }

  public Home(): Promise<any> {
    this.parent.currentResponse = returnHomeResponse;
    this.parent.inCleaning = false;
    setTimeout(() => {
      if (this.parent.currentResponse.state === returnHomeResponse.state) {
        this.parent.currentResponse = { ...chargingResponse };
      }
    }, 4000);
    return Promise.resolve();
  }

  public Find(): Promise<any> {
    alert("Hey...I'm here!");
    return Promise.resolve();
  }

  public SpotClean(): Promise<any> {
    this.parent.currentResponse = spotCleaningResponse;
    setTimeout(() => {
      this.parent.currentResponse = chargingResponse;
    }, 4000);
    return Promise.resolve();
  }

  public setFanSpeed(speed: number): Promise<any> {
    // tslint:disable-next-line:no-console
    console.log("Setting fan speed", speed);
    this.parent.fanSpeed = speed;
    return Promise.resolve();
  }

}
