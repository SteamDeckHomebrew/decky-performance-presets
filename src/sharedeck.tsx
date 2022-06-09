export interface ShareDeckProfile {
  id: number;
  app_id: number;
  app_build_id:null;
  user_id: bigint;
  proton_version: string;
  steamos_version: string;
  bios_version: string;
  power_draw: number;
  graphics_preset: string;
  halfrate_shading:false;
  resolution_horizontal: number;
  resolution_vertical: number
  scaling_filter: string;
  framerate_limit: number;
  average_framerate: number;
  tdp_limit: number;
  gpu_clock: number;
  note: string;
  created_at: Date;
  updated_at: Date;
  favourites_count: number;
  screen_refresh_rate: number
}

export function fetchProfilesFromAppID(appID: number): Promise<ShareDeckProfile[]> {
  return new Promise((resolve, reject) => {
    //Still needs proper implementation once the API is available, use dummy data for now
    let profiles: ShareDeckProfile[] = JSON.parse('[{"id":99,"app_id":1672970,"app_build_id":null,"user_id":76561198042220012,"proton_version":"native","steamos_version":"3.2","bios_version":"F7A0105","power_draw":12.0,"graphics_preset":"high","halfrate_shading":false,"resolution_horizontal":1280,"resolution_vertical":800,"scaling_filter":"linear","framerate_limit":40,"average_framerate":40,"tdp_limit":6,"gpu_clock":null,"note":null,"created_at":"2022-05-12T06:04:51.215Z","updated_at":"2022-05-12T06:04:51.215Z","favourites_count":2,"screen_refresh_rate":40},{"id":4,"app_id":1672970,"app_build_id":null,"user_id":76561198042220012,"proton_version":"7.0-2","steamos_version":"3.2","bios_version":"F7A0105","power_draw":12.5,"graphics_preset":"high","halfrate_shading":false,"resolution_horizontal":1280,"resolution_vertical":800,"scaling_filter":"linear","framerate_limit":40,"average_framerate":40,"tdp_limit":null,"gpu_clock":null,"note":null,"created_at":"2022-05-04T22:22:19.102Z","updated_at":"2022-05-04T22:22:19.102Z","favourites_count":2,"screen_refresh_rate":40},{"id":2,"app_id":1672970,"app_build_id":null,"user_id":76561198042220012,"proton_version":"7.0-2","steamos_version":"3.2","bios_version":"F7A0105","power_draw":11.2,"graphics_preset":"high","halfrate_shading":false,"resolution_horizontal":1280,"resolution_vertical":800,"scaling_filter":"linear","framerate_limit":30,"average_framerate":30,"tdp_limit":null,"gpu_clock":null,"note":null,"created_at":"2022-05-04T21:38:46.742Z","updated_at":"2022-05-04T21:38:46.742Z","favourites_count":1,"screen_refresh_rate":30},{"id":1,"app_id":1672970,"app_build_id":null,"user_id":76561198042220012,"proton_version":"7.0-2","steamos_version":"3.2","bios_version":"F7A0105","power_draw":23.9,"graphics_preset":"high","halfrate_shading":false,"resolution_horizontal":1280,"resolution_vertical":800,"scaling_filter":"linear","framerate_limit":60,"average_framerate":60,"tdp_limit":null,"gpu_clock":null,"note":null,"created_at":"2022-05-04T21:36:34.321Z","updated_at":"2022-05-04T21:36:34.321Z","favourites_count":1,"screen_refresh_rate":60}]')
    //Fake loading time
    setTimeout(() => resolve(profiles), 1000);
  });
}