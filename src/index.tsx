import {
  definePlugin,
  PanelSectionRow,
  Dropdown,
  DropdownOption,
  ServerAPI,
  staticClasses,
  PanelSection,
  Focusable,
  DialogButton,
  gamepadDialogClasses,
  joinClassNames
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
const unregisterGameUpdates = SteamClient.GameSessions.RegisterForAppLifetimeNotifications(updateRunningGames);

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
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  
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
          setErrorMsg(null);
        })
        .catch(err => {
          setFetchedProfiles(null);
          setLoadingProfile(false);
          setErrorMsg(err);
        })
      setLoadingProfile(true);
    } else {
      setFetchedProfiles(null);
      setErrorMsg(null);
    }
  }

  return (
    <Fragment>
      <div className={joinClassNames(gamepadDialogClasses.Field, gamepadDialogClasses.WithBottomSeparatorStandard)} style={{height: "10%", overflow:"hidden", paddingBottom: "12px", marginBottom: "12px"}}>
      <PanelSection>
        <PanelSectionRow>
          <Dropdown
            rgOptions={dropdownOptions}
            selectedOption={selectedGame}
            onChange={(data) => setSelectedGame(data.data)}
          />
        </PanelSectionRow>
      </PanelSection>
      </div>
      
      <Focusable
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-around",
          marginBottom: "12px",
          alignItems: "center"
        }}
      >
        <div style={{overflow: "hidden", width: "36%", display:"flex", justifyContent:"center", borderRadius:"2px"}}>
        <DialogButton
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
        </DialogButton>
        </div>
        {fetchedProfiles ? `${selectedProfile+1}/${fetchedProfiles?.length}` : ""}
        <div style={{overflow: "hidden", width: "36%", display:"flex", justifyContent:"center", borderRadius:"2px"}}>
        <DialogButton
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
        </DialogButton>
        </div>
      </Focusable>

      <PerfDisplay profile={fetchedProfiles? fetchedProfiles[selectedProfile]:null} loading={loadingProfile} errorMsg={errorMsg}/>
    </Fragment>
  );
};

export default definePlugin((serverApi: ServerAPI) => {
  return {
    title: <div className={staticClasses.Title}>Performance Presets</div>,
    content: <Content serverAPI={serverApi} />,
    icon: <MdSpeed />,
    onDismount() {
      unregisterGameUpdates();
    }
  };
});
