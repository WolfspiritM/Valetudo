export enum VacuumStateEnum {
    "Starting" = 1,
    "Sleeping" = 2,
    "Idle" = 3,
    "Remote control active" = 4,
    "Cleaning" = 5,
    "Returning home" = 6,
    "Manual mode" = 7,
    "Charging" = 8,
    "Charging problem" = 9,
    "Paused" = 10,
    "Spot cleaning" = 11,
    "Error" = 12,
    "Shutting down" = 13,
    "Updating" = 14,
    "Docking" = 15,
    "Going to target" = 16,
    "Zoned cleaning" = 17,
    "Full" = 100,
}

export enum FanSpeeds {
    "No power" = 0,
    "Low power" = 38,
    "Medium power" = 60,
    "High power" = 75,
    "Super power" = 100,
}

export interface IStatusResponse {
    battery: number;
    in_cleaning: boolean;
    state: VacuumStateEnum;
    human_error: string;
    clean_area: number;
    clean_time: number;
    fan_power: number;
    dnd_enabled: boolean;
    map_present: boolean;
}


export interface IZone {
    iterations: number;
    Point1: [number, number];
    Point2: [number, number];
}

export interface IZoneGroup {
    name: string;
    zones: IZone[];
}

export interface IGotoSpot {
    name: string;
    Point: [number, number];
}

export interface IValetudoCommandApi {
    StartCleaning(): Promise<any>;
    Pause(): Promise<any>;
    Stop(): Promise<any>;
    Home(): Promise<any>;
    Find(): Promise<any>;
    SpotClean(): Promise<any>;
    setFanSpeed(speed: number): Promise<any>;
}

export interface ITimer {
    id: string;
    cron: string;
    enabled: boolean;
    human_desc: string;
}


export interface IValetudoZonesApi {
    SaveZones(zones: IZoneGroup[]): Promise<boolean>;
    GetZones(): Promise<IZoneGroup[]>;
    ZoneClean(spot: IZone[]): Promise<boolean>;
}

export interface IValetudoGotoApi {
    GetGotoSpots(): Promise<IGotoSpot[]>;
    SaveGotoSpots(spots: IGotoSpot[]): Promise<boolean>;
    Goto(spot: [number, number]): Promise<boolean>;
}

export type MapData = ArrayBuffer;
export type PathData = ArrayBuffer;

export interface IMapAndPathData {
    map: MapData;
    path: PathData;
}

export interface IWifiSettings {
    connected: boolean;
    connection_info: {
        bssid: string;
        ssid: string;
        freq: string;
        signal: string;
        tx_bitrate: string;
    };
}

export interface IValetudoWifiApi {
    Get(): Promise<IWifiSettings>;
    Set(ssid: string, password: string): Promise<boolean>;
}

export interface IValetudoMapApi {
    GetLatestMapData(): Promise<IMapAndPathData>;
}

export interface IValetudoManualControlApi {
    StartManualControl(): Promise<boolean>;
    StopManualControl(): Promise<boolean>;
    SetManualControl(angle: number, velocity: number, duration: number): Promise<boolean>;
}

export interface IValetudoTimerApi {
    Get(): Promise<ITimer[]>;
    CreateTimer(cron: string): Promise<boolean>;
    DeleteTimer(id: string): Promise<boolean>;
    SetTimerState(id: string, enabled: boolean): Promise<boolean>;
}

export interface IDeviceInfo {
    version: string;
    build: string;
}

export interface IConsumables {
    consumables: {
        main_brush_work_time: number;
        filter_work_time: number;
        side_brush_work_time: number;
        sensor_dirty_time: number;
    };
    summary: [number, number, number, number[]];
}

export interface IValetudoSoundApi {
    GetVolume(): Promise<number>;
    SetVolume(volume: number): Promise<boolean>;
    TestVolume(): Promise<boolean>;
}

export interface IValetudoConsumablesApi {
    Get(): Promise<IConsumables>;
    Reset(consumable: string): Promise<boolean>;
}

export interface IValetudoApi {
    Command: IValetudoCommandApi;
    Zones: IValetudoZonesApi;
    Goto: IValetudoGotoApi;
    Map: IValetudoMapApi;
    ManualControl: IValetudoManualControlApi;
    Consumables: IValetudoConsumablesApi;
    Timer: IValetudoTimerApi;
    Wifi: IValetudoWifiApi;
    Sound: IValetudoSoundApi;
    GetCurrentStatus(): Promise<IStatusResponse>;
    GetToken(): Promise<string>;
    GetDeviceInfo(): Promise<IDeviceInfo>;
}

// export { MockApi as Api } from "./mock";
export { ServerApi as Api } from "./server";
