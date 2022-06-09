import {
  definePlugin,
  PanelSectionRow,
  Dropdown,
  DropdownOption,
  ServerAPI,
  staticClasses,
  PanelSection,
  HorizontalFocus,
  ButtonItem,
} from "decky-frontend-lib";
import { VFC, useState, useEffect, Fragment } from "react";
import { MdSpeed } from "react-icons/md";

import * as ShareDeck from "./sharedeck";
import { PerfDisplay } from "./perfdisplay";

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
}

const Content: VFC<{ serverAPI: ServerAPI }> = ({ }) => {
  const [selectedGame, setSelectedGame] = useState<number | null>(null);
  const [dropdownOptions, setDropdownOptions] = useState<DropdownOption[]>([]);
  const [fetchedProfiles, setFetchedProfiles] = useState<ShareDeck.ShareDeckProfile[] | null>(null);
  const [loadingProfile, setLoadingProfile] = useState<boolean>(false);
  const [selectedProfile, setSelectedProfile] = useState<number>(0);
  
  useEffect(() => {
    dropdownUpdateFunc = () => {
      setDropdownOptions(runningGames.map(g => {return {data: g.appid ,label: g.display_name} as DropdownOption}));

      let topRunningGame: AppOverview | undefined = runningGames[runningGames.length - 1];
        setSelectedGame(topRunningGame ? topRunningGame.appid : null);
        showPerfProfiles(topRunningGame ? topRunningGame.appid : null);
    }
    
    dropdownUpdateFunc();

    return () => {
      dropdownUpdateFunc = () => {};
    }
  }, []);

  useEffect(() => {
    showPerfProfiles(selectedGame);
  }, [selectedGame]);

  function showPerfProfiles(appid: number | null) {
    if(appid !== null) {
      ShareDeck.fetchProfilesFromAppID(appid)
        .then(profiles => {
          setFetchedProfiles(profiles);
          setSelectedProfile(0);
          setLoadingProfile(false);
        });
      setLoadingProfile(true);
    } else {
      setFetchedProfiles(null);
    }
  }

  return (
    <Fragment>
      <PanelSection>
        <PanelSectionRow>
          <Dropdown
            rgOptions={dropdownOptions}
            selectedOption={selectedGame}
            onChange={(data) => setSelectedGame(data.data)}
          />
        </PanelSectionRow>
      </PanelSection>

      <PanelSection>
        <PanelSectionRow>
          <HorizontalFocus>
            <ButtonItem
              onClick={() => {
                if(fetchedProfiles) {
                  if(selectedProfile === 0) {
                    setSelectedProfile(fetchedProfiles.length - 1);
                  } else {
                    setSelectedProfile(selectedProfile - 1);
                  }
                }
              }}
            >
              Prev
            </ButtonItem>
            <ButtonItem
              onClick={() => {
                if(fetchedProfiles) {
                  if(selectedProfile === fetchedProfiles.length - 1) {
                    setSelectedProfile(0);
                  } else {
                    setSelectedProfile(selectedProfile + 1);
                  }
                }
              }}
            >
              Next
            </ButtonItem>
          </HorizontalFocus>
        </PanelSectionRow>
      </PanelSection>

      <PerfDisplay profile={fetchedProfiles? fetchedProfiles[selectedProfile]:null} loading={loadingProfile} />
    </Fragment>
  );
};

export default definePlugin((serverApi: ServerAPI) => {
  return {
    title: <div className={staticClasses.Title}>Performance Presets</div>,
    content: <Content serverAPI={serverApi} />,
    icon: <MdSpeed />,
  };
});
