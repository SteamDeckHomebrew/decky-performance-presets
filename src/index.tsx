import {
  definePlugin,
  DropdownItem,
  DropdownOption,
  ServerAPI,
  staticClasses,
} from "decky-frontend-lib";
import { VFC, useState, useEffect } from "react";
import { MdSpeed } from "react-icons/md";

interface GameStateUpdate {
  unAppID: number;
  nInstanceID: number;
  bRunning: boolean;
}

interface AppOverview {
  appid: number;
  display_name: string;
}

let runningGames: AppOverview[] = [];
let dropdownUpdateFunc: Function = () => {};

//@ts-ignore
SteamClient.GameSessions.RegisterForAppLifetimeNotifications(updateRunningGames);

function updateRunningGames(update: GameStateUpdate) {
  if(update.bRunning) {
    //@ts-ignore
    let gameInfo: AppOverview = appStore.GetAppOverviewByAppID(update.unAppID);
    if(!gameInfo)
      return;
    runningGames.push(gameInfo);
  } else {
    runningGames = runningGames.filter(g => g.appid !== update.unAppID);
  }
  dropdownUpdateFunc();
  console.log(runningGames, runningGames.map(g => {return {data: g.appid ,label: g.display_name}}));
}

const Content: VFC<{ serverAPI: ServerAPI }> = ({ }) => {
  const [selectedGame, setSelectedGame] = useState<number | null>(null);
  const [dropdownOptions, setDropdownOptions] = useState<DropdownOption[]>([]);

  useEffect(() => {
    dropdownUpdateFunc = () => {
      setDropdownOptions(runningGames.map(g => {return {data: g.appid ,label: g.display_name} as DropdownOption}));
    }
    
    return () => {
      dropdownUpdateFunc = () => {};
    }
  }, []);

  return (
    <DropdownItem
      label="Select a game"
      rgOptions={dropdownOptions}
      selectedOption={selectedGame}
      onChange={(data) => setSelectedGame(data.data)}
    />
  );
};

export default definePlugin((serverApi: ServerAPI) => {
  return {
    title: <div className={staticClasses.Title}>Performance Presets</div>,
    content: <Content serverAPI={serverApi} />,
    icon: <MdSpeed />,
  };
});
