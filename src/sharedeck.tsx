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
  screen_refresh_rate: number;
  user: {
    personaname: string;
  }
}

export function fetchProfilesFromAppID(appID: number): Promise<ShareDeckProfile[]> {
  return new Promise((resolve, reject) => {
      fetch(`https://sharedeck.games/api/v1/reports?app_id=${appID}`)
      .then(response => response.json())
      .then(json => {
        if(json.length === 0) reject("No profiles found for this game :(")
        resolve(json)
      })
      .catch(() => reject("An error occured while fetching profiles"));
  });
}