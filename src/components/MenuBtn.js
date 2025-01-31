import { clearKeyEventHandler } from "states/keymanager";
import { getConnectionState } from "states/signalRinterface";
import { exitGame } from "states/signalRinterface";
import { gotoState } from "states/store";
import { AppState, ConnectionState } from "states/enums/enums";
import { useDispatch } from "react-redux";
import Icon from "./Icons";
import "./MenuBtn.css"

export default function MenuBtn () {
    const dispatch = useDispatch();

    function onClick_goback () {
        clearKeyEventHandler();
        if(getConnectionState() === ConnectionState.Connected)
          exitGame()
        dispatch(gotoState(AppState.PREVIEW))
    }

    
    return (<button className = "btn-train-gobacktomenu" onClick={onClick_goback}>
        <Icon name="goback" className="icon-goback"/>
    </button>)
}