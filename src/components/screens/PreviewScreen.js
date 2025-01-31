import "./PreviewScreen.css";
import "App.css";
import Icon from "components/Icons.js";
import ChatComp from "components/ChatComp";
import { get_server, server_list, set_server } from "states/servermanager";
import config from "config";

import { useEffect, useState } from "react";
import {
  enterNormGame,
  enterTraining,
  getConnectionState,
  startConnection,
  buildConnection,
  stopConnection,
  enterTwoVTwoGame,
  sendChat,
  getChatCache,
} from "states/signalRinterface";
import { useDispatch, useSelector } from "react-redux";
import { gotoState, initializeConnectionFunctions, resetGameData, setGlobalChat, setShowNotice, setWaitInfo, userState_default } from "states/store";
import { AppState, ConnectionState, GameType } from "states/enums/enums.js";
import LogoSrc from "imgs/logo_altaltalt.png";
import { getMyData } from "states/apiinterface";
import { setUserData } from "states/store";
import EmailModal from "components/EmailModal";
import NoticeModal from "components/NoticeModal";

function SettingsComponent({ children }) {
  const [activated, setactivated] = useState(false);
  return (
    <div id="container-settings" className={activated ? "container-settings-clicked" : ""}>
      <div id="container-settingslableandbtn">
        {activated ? <label>Settings</label> : ""}
        <button id="button-settings" onClick={() => setactivated(!activated)}>
          <Icon name="settings" className="icon" />
        </button>
      </div>
      {activated ? children : ""}
    </div>
  );
}

function ServerSelect({className, onChange}) {
    const [selectedIndex, setSelectedIndex] = useState(get_server().idx);

    const handleSelectChange = (event) => {
        const idx = event.target.selectedIndex-1;
        setSelectedIndex(idx);
        onChange(idx);
    };

    return (
        <div className={className}>
            <label htmlFor="server-select">Server: </label>
            <select className="server-select"
                value={server_list[selectedIndex]}
                onChange={handleSelectChange}
            >
                <option value="" disabled>Select a server</option>
                {server_list.map(serverName => (
                    <option key={serverName} value={serverName}>
                        {serverName}
                    </option>
                ))}
            </select>
        </div>
    );
}

function SummaryComponent({className}){
  const [summary, setSummary] = useState({})
  const endpoint = get_server().summary_endpoint;
  const interval = 2000;
  async function trygetdata() {
    try{
    var response = await fetch(endpoint);
    if(!response.ok)
      throw Error(await response.text());
    setSummary(await response.json());
    }
    catch(err)
    {
      setSummary({})
      console.error(err)
    }
  }
  useEffect(() => {
    trygetdata();
    const intervalId=setInterval(trygetdata, interval);
    // Cleanup the interval when the component unmounts or re-renders
    return () => clearInterval(intervalId);
  }, []); 
  return <article className={className}>
      Connections: {summary?.connections} <br/>
      Normal Mode: {summary?.normgames} <br/>
      2 vs 2: {summary?.twovtwos} <br/>
      Training: {summary?.training} <br/>
      Waiting: {summary?.waitings} 
    </article>
}

export default function PreviewScreen() {
  const dispatch = useDispatch();
  const [connectionStateText, setConnectionStateText] = useState(() =>
    getConnectionState() === ConnectionState.Connected ? "" : "Connecting To Server..."
  );
  const [signalConnection, setSignalConnection] = useState(false); //서버에 연결되어 있지만 게임이 끝난 뒤에 돌아간 것일 수도 있음. 이 경우 Connection은 유지됨
  const userdata = useSelector((state) => state.userdata);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const showNotice = useSelector((state) => state.main.showNotice);
  const chatList = useSelector((state)=>state.chats.globalchat);

  function onGameStartBtnClick() {
    let rating = Number(userdata.rating);
    if(rating<0)
      return;    
    const constate = getConnectionState();
    if (constate !== ConnectionState.Connected) {
      if (constate === ConnectionState.Disconnected) 
        setSignalConnection(true);
      return;
    }
    dispatch(gotoState(AppState.WAITING_MATCH));
    enterNormGame(rating).catch((err) => {
      alert(err.message);
      dispatch(gotoState(AppState.LOGIN));
    });
  }

  function onServerChange(idx) {
    set_server(idx)
    stopConnection();
    setSignalConnection(true);
  }

  function onTrainingBtnClick() {
    const constate = getConnectionState();
    if (constate !== ConnectionState.Connected) {
      if (constate === ConnectionState.Disconnected) 
        setSignalConnection(true);
      return;
    }
    dispatch(setWaitInfo({whichGame:GameType.NormGame}))
    dispatch(gotoState(AppState.TRAINING));
    enterTraining().catch((err) => {
      alert(err.message);
      dispatch(gotoState(AppState.LOGIN));
    });
  }

  function onTwoVTwoBtnClick() {
    let rating = Number(userdata.rating);
    if(rating<0)
      return;    
    const constate = getConnectionState();
    if (constate !== ConnectionState.Connected) {
      if (constate === ConnectionState.Disconnected) 
        setSignalConnection(true);
      return;
    }
    dispatch(setWaitInfo({whichGame:GameType.TwoVTwoGame}))
    dispatch(gotoState(AppState.WAITING_MATCH));
    enterTwoVTwoGame(rating).catch((err) => {
      alert(err.message);
      dispatch(gotoState(AppState.LOGIN));
    });
  }
  
  //initialization
  useEffect(() => {
    if (Notification.permission === "default") {
      Notification.requestPermission().then(function(permission) {
          if (permission === "granted") {
              console.log("Notification Permission granted!");
          }
      });
    }

    dispatch(resetGameData())
    dispatch(setUserData(userState_default))

    async function trygetdata() {
      await getMyData().then(
        async (response) => {
          if (response.ok) {
            const userdata = await response.json();
            console.log(userdata);
            dispatch(setUserData(userdata));
          } else {
            const errmsg = await response.text();
            throw Error(errmsg);
          }
        },
        (err) => {
          console.log(err);
          throw err;
        }
      );
    }

    async function trygetdatarepeat(count, timeout) {
      try {
        await trygetdata();
      } catch{
        if (count > 0) {
          console.log(`fetching user data failed. Trying ${count - 1}`);
          await setTimeout(() => trygetdatarepeat(count-1, timeout), timeout);
        } 
        else {
          dispatch(gotoState(AppState.LOGIN))
        }
      }
    }

    trygetdatarepeat(10, 0.9);
  }, []);

  useEffect(() => {
    const constate = getConnectionState();
    if ((constate === ConnectionState.Disconnected || constate === ConnectionState.Null) && !signalConnection) {
      setSignalConnection(true);
    }

    if (signalConnection) {
      setConnectionStateText("Connecting To Server...");
      setSignalConnection(false);
      buildConnection(get_server().signalR_endpoint);
      initializeConnectionFunctions();

      const waitTime = 1000;
      async function rec(i) {
        try {
          if(getConnectionState() === ConnectionState.Connected)
            return;
          if (i === 10) setConnectionStateText("Connection Taking Too Long...");
          await startConnection();
          setConnectionStateText("");
          console.log("Created SignalR connection!");
          getChatCache().then(item => dispatch(setGlobalChat(item)))
        } catch (err) {
          console.log(err.message);
          console.log(`Connection to Server Failed for ${i} times... Retry in ${waitTime} milliseconds`);
          if (err.message.search("'401'") !== -1) {
            console.log("Unauthorized. Relogin may be required.");
            await stopConnection();
            dispatch(gotoState(AppState.LOGIN));
          } else setTimeout(() => rec(i + 1), waitTime);
        }
      }
      rec(1);
    }
  }, [signalConnection, dispatch]);

  return (
    <div>
      <div id="div-shade" />
      <div id="container-logoandui">
        <div id="container-logo">
          <img src={LogoSrc} alt="d" id="img-logo" />
        </div>
        <hr />
        <div id="container-ui">
          <div id="container-rankinfo">
            <label id="label-ranking" className="text-border">
              RANKING
            </label>
            <hr id="hr-ranking" />
            <label id="label-rankingletter" className="text-border">
              {userdata.rankletter}
            </label>
            <br />
            <article id="article-info">
              Name : {userdata.name} <br />
              Rating : {userdata.rating} <br />
              Join Date: {userdata.joindate} <br/>
              Social Credit: ${userdata.socialcredit} <br/>              
              {!!userdata.email ? `Email: ${userdata.email}`: 
              <span className="emailinfowarning" onClick={()=>setShowEmailModal(true)}>Add Email</span>
              }
            </article> 
          </div>
          <div id="container-gameselectbuttons">
            <button
              className="button-gameselection text-border button-coloroutlinechanging"
              id="button-gameselection-start"
              onClick={onGameStartBtnClick}
            >
              <label className="textstyle1"> Play !</label>
              <Icon name="swords" className="icon" />
            </button>
            <button
              className="button-gameselection text-border button-coloroutlinechanging"
              id="button-gameselection-twovtwo"
              onClick={onTwoVTwoBtnClick}
            >
              <label className="textstyle1"> 2v2</label>
              <Icon name="group" className="icon" />
            </button>
            <button
              className="button-gameselection text-border button-coloroutlinechanging"
              id="button-gameselection-train"
              onClick={onTrainingBtnClick}
            >
              <label className="textstyle1"> Train</label>
              <Icon name="ball" className="icon" />
            </button>
          </div>
        </div>
        <label>{connectionStateText}</label>
      </div>
      <div id="container-navbar">
        <button onClick={()=>window.open(config.LEADERBOARD_ENDPOINT)} id="button-leaderboard">
          <Icon name="leaderboard" className="icon" path_id="path-leaderboard"/>
        </button>
        <button onClick={()=>dispatch(setShowNotice(true))} id="button-notice">
          <Icon name="notice" className="icon" path_id="path-notice"/>
        </button>
        <button id="button-settings">
          <Icon name="settings" className="icon" path_id="path-settings"/>
        </button>
      </div>
      <div className = "container-leftbottomflexbox">
      <ServerSelect className="container-server-select text-border" onChange={onServerChange}/>
      <ChatComp chatList={chatList} sendChat={async (msg)=>{
        if(getConnectionState() === ConnectionState.Connected)
          return await sendChat(msg)}} className="chatcomp-preview "/>
      </div>
      <SummaryComponent className="article-summary"/>
      {showEmailModal ? <EmailModal onClose = {() => setShowEmailModal(false)}/> : ""}
      {showNotice ? <NoticeModal onClose={()=>dispatch(setShowNotice(false))}/> : ""}
    </div>
  );
}
