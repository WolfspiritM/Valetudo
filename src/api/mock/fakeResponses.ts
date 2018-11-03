import { IStatusResponse } from "@/api";

export const cleaningResponse: IStatusResponse = {
  battery: 67,
  in_cleaning: true,
  state: 5,
  human_error: "No error",
  map_present: true,
  dnd_enabled: false,
  clean_area: 11582500,
  clean_time: 489,
  fan_power: 60,
};

export const pausedResponse: IStatusResponse = {
  battery: 40,
  in_cleaning: true,
  state: 10,
  human_error: "No error",
  map_present: true,
  dnd_enabled: false,
  clean_area: 28142500,
  clean_time: 1489,
  fan_power: 61,
};

export const returnHomeResponse: IStatusResponse = {
  battery: 71,
  in_cleaning: true,
  state: 6,
  human_error: "No error",
  map_present: true,
  dnd_enabled: false,
  clean_area: 28142500,
  clean_time: 1489,
  fan_power: 60,
};


export const chargingResponse: IStatusResponse = {
  battery: 91,
  in_cleaning: false,
  state: 8,
  human_error: "No error",
  map_present: true,
  dnd_enabled: false,
  clean_area: 28142500,
  clean_time: 1489,
  fan_power: 60,
};

export const sleepingResponse: IStatusResponse = {
  battery: 91,
  in_cleaning: true,
  state: 2,
  human_error: "No error",
  map_present: true,
  dnd_enabled: false,
  clean_area: 28142500,
  clean_time: 1489,
  fan_power: 60,
};

export const idleResponse: IStatusResponse = {
  battery: 91,
  in_cleaning: false,
  state: 3,
  human_error: "No error",
  map_present: true,
  dnd_enabled: false,
  clean_area: 28142500,
  clean_time: 1489,
  fan_power: 60,
};

export const spotCleaningResponse: IStatusResponse = {
  battery: 91,
  in_cleaning: false,
  state: 11,
  human_error: "No error",
  map_present: true,
  dnd_enabled: false,
  clean_area: 28142500,
  clean_time: 1489,
  fan_power: 60,
};

export const goingToTargetResponse: IStatusResponse = {
  battery: 91,
  in_cleaning: false,
  state: 16,
  human_error: "No error",
  map_present: true,
  dnd_enabled: false,
  clean_area: 28142500,
  clean_time: 1489,
  fan_power: 60,
};
