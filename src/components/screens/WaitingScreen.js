import { getConnectionState} from "states/signalRinterface";
import "./WaitingScreen.css"
import { useEffect, useState } from "react";
import { AppState, ConnectionState, GameType } from "states/enums/enums";
import { useDispatch, useSelector } from "react-redux";
import { gotoState } from "states/store";
import MenuBtn from "components/MenuBtn";

export default function WaitingScreen(){
    const [signalConnectionCheck, SetSignalConnectionCheck] = useState(false);
    const waitinfo = useSelector(state=>state.waitinfo);
    const dispatch = useDispatch()
    setTimeout(()=>SetSignalConnectionCheck(x=>!x), 1000)

    useEffect(()=>{
        setTimeout(()=>SetSignalConnectionCheck(x=>!x), 1000)
        if(getConnectionState() === ConnectionState.Disconnected)
            dispatch(gotoState(AppState.PREVIEW))
    }, [signalConnectionCheck, dispatch])
    
    return <><div id="container-waiting">
        <label id="label-waiting" className="text-border">{`Waiting For ${waitinfo.whichGame === GameType.NormGame ? "Challenger" : "2v2"}...`}</label>
        <article id="article-waitingdesc">{waitinfo.waitCount ? `${waitinfo.waitCount} player(s) waiting` : ""}</article>
    </div>
    <MenuBtn/>
    </>
}