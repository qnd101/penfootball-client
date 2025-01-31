import { useState } from "react";
import { setKeyEventHandler, clearKeyEventHandler } from "states/keymanager";
import { getConnectionState,invokeKeyEvent } from "states/signalRinterface";
import { ConnectionState, AppState } from "states/enums/enums";
import { useDispatch } from "react-redux";
import { gotoState } from "states/store";
import "./TrainingScreen.css";
import MenuBtn from "components/MenuBtn";

export default function TrainingScreen(){
    const [initialized, setInitialized] = useState(false);  
    const dispatch = useDispatch();

  if (!initialized) {
    setKeyEventHandler((eventtype, keytype) => {
      const constate = getConnectionState();
      //연결되었고, GAMING이라면 서버에 키 입력 전달
      if (constate === ConnectionState.Connected) {
        invokeKeyEvent(eventtype, keytype);
      }
      //만일 연결이 끊긴 상황이라면
      else if (constate === ConnectionState.Disconnected) {
        //그 와중에 Preview 혹은 Gaming 상황이면 Preview로 돌아가자
        dispatch(gotoState(AppState.PREVIEW));
        clearKeyEventHandler();
      }
      setInitialized(true);
    });
  }
  return <MenuBtn/>
}