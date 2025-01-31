import "./App.css";
import PreviewScreen from "./components/screens/PreviewScreen";
import WaitingScreen from "components/screens/WaitingScreen";
import GamingScreen from "components/screens/GamingScreen";
import LoginScreen from "components/screens/LoginScreen";
import SignupScreen from "components/screens/SignupScreen";

import GameCanvas from "components/GameCanvas";

import { AppState } from "states/enums/enums";
import {useEffect} from 'react';
import { useSelector } from 'react-redux';
import TrainingScreen from "components/screens/TrainingScreen";

function App() {
  const appState = useSelector(state=>state.main.appState)
  let currentScreen;
  switch (appState) {
    case AppState.PREVIEW:
      currentScreen = <PreviewScreen />;
      break;
    case AppState.WAITING_MATCH:
      currentScreen = <WaitingScreen />;
      break;
    case AppState.GAMING:
      currentScreen = <GamingScreen />;
      break;
    case AppState.LOGIN:
      currentScreen = <LoginScreen />;
      break;
    case AppState.SIGNUP:
      currentScreen = <SignupScreen/>
      break;
    case AppState.TRAINING:
      currentScreen = <TrainingScreen/>
      break;
    default:
      currentScreen = ""; // Optional: Handle unknown states
      break;
  }
  useEffect(()=>{
    console.log(`App is in state: ${appState}`)
  },[appState])
  
  return (
    <div className="App">
      <GameCanvas id="canvas-main"/>
      {currentScreen}
    </div>
  );
}

export default App;
