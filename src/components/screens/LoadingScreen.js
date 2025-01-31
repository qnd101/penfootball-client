/*
import "./LoadingScreen.css";
import "App.css";

import { useSelector } from "react-redux";
import {LoadingState} from "states/store"

import Icon from "components/Icons.js";
import logosrc from "imgs/logo_dummy.png";

export default function LoadingScreen(){
    let description = "";
    switch(useSelector(state => state.main.loadingstate))
    {
        case LoadingState.LOADING: description = "Connecting to Server..."; break;
        case LoadingState.TAKING_TOO_LONG: description = "Connection Taking too Long...";break;
        default: ;
    }
    return (
        <div>
            <div id="container-loading">
            <label id="label-loading" className="text-border">LOADING...</label>
            <hr id="hr-between"/>
            <label id="label-description">{description}</label>
            </div>
        </div>
    )
}
    */