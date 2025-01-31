import { configureStore, createSlice } from "@reduxjs/toolkit";
import { setFunction } from "./signalRinterface.js";

import { AppState, ClientInterface } from "./enums/enums.js";
import { viewData } from "./apiinterface.js";

//각 State별로 statemodel의 생성자를 구축해보자
//기본적인 state들에 대한 slice. AppState에 의존적인 정보들.
//로그인 정보와 같이 이와 병렬적으로 존재하는 state은 별도로 분리해서 선언.
function MainStatePayload(next, currentState) {
  return { currentState: currentState, next: next };
}

const mainStateSlice = createSlice({
  name: "main",
  initialState: { appState: AppState.LOGIN, showNotice: false},
  reducers: {
    gotoState: (state, action) => {
      state.appState = action.payload
    },
    setShowNotice: (state, action) => {
      state.showNotice = action.payload
    }
  },
});
export const { gotoState, setShowNotice } = mainStateSlice.actions;
export { MainStatePayload };

const frameSlice = createSlice({
  name: "frame",
  initialState: {},
  reducers: {
    setFrame: (state, action) => {
      return action.payload;
    },
  },
});

const previewSlice = createSlice({
  name: "preview",
  initialState: {},
  reducers: {
    setPreview: (state, action) => {
      return action.payload;
    }
  }
});

const waitInfoSlice = createSlice({
  name: "waitinfo",
  initialState: {},
  reducers: {
    setWaitInfo: (state, action) => {
      return action.payload;
    }
  }
});

const chatSlice = createSlice({
  name: "chats",
  initialState: {globalchat: []},
  reducers: {
    addGlobalChat: (state, action) => {
      state.globalchat.push(action.payload)
    },
    setGlobalChat: (state, action) => {
      state.globalchat = action.payload
    }
  }
})

const gamedataSlice = createSlice({
  name: "gamedata",
  initialState: {gameend: undefined, score: undefined, ids: undefined, opdatas: undefined, currentgametype: undefined},
  reducers: {
    setGameEnd: (state, action) => {
      state.gameend = action.payload;
    },
    setScore: (state, action) => {
      state.score = action.payload
    },
    resetGameData: (state, action) => {
      return {}
    },
    setIDs: (state, action) => {
      state.ids=action.payload
    },
    setOpDatas: (state, action)=>{
      state.opdatas = action.payload
    },
    setCurrentGameType: (state, action)=>{
      state.currentgametype = action.payload
    }
  }
})


export const { setFrame } = frameSlice.actions;
export const {setPreview} = previewSlice.actions;
export const {setWaitInfo} = waitInfoSlice.actions;
export const {setGameEnd, setScore, resetGameData, setIDs, setCurrentGameType, setOpDatas} = gamedataSlice.actions;
export const {addGlobalChat, setGlobalChat} = chatSlice.actions;

export const userState_default = {name: "???", rating:"-1972", rankletter:"X", joindate: "21/11/1972"};

const userDataSlice = createSlice({
  name: "userdata",
  initialState: userState_default,
  reducers: {
    setUserData: (state, action) => {
      return action.payload
    }
  }
})

export const {setUserData} = userDataSlice.actions;

export const store = configureStore({
  reducer: {
    main: mainStateSlice.reducer,
    frame: frameSlice.reducer,
    preview: previewSlice.reducer,
    gamedata: gamedataSlice.reducer,
    userdata : userDataSlice.reducer,
    waitinfo: waitInfoSlice.reducer,
    chats : chatSlice.reducer,
  },
});

async function trygetviewktimes(k, ids) {
  setTimeout(async () => {
    try {
      let opdatas = []
      for(let i=0;i<ids.length;i++)
      {
        const response = await viewData(ids[i])
        if(!response.ok)
          throw Error(await response.text())
      
        let opdata = await response.json()
        opdatas.push(opdata)
      }
      
      store.dispatch(setOpDatas(opdatas))
    } catch (err) {
      if (k > 0) {
        console.error(err);
        console.log(`Trying to fetch opponent data for ${k - 1} times`);
        await trygetviewktimes(k - 1, ids);
      }
    }
  });
}

export function initializeConnectionFunctions() {
  setFunction(ClientInterface.GAMEFOUND, (obj) => {
    console.log(obj);
    let ids = obj.iDs;
    store.dispatch(setIDs(ids))
    store.dispatch(setCurrentGameType(obj.whichGame));
    
    trygetviewktimes(5, ids).then(()=>{
      console.log(store.getState().gamedata)
      store.dispatch(gotoState(AppState.GAMING))});
  });

  setFunction(ClientInterface.UPDATEFRAME, (frame) => {
    store.dispatch(setFrame(frame));
  });

  setFunction(ClientInterface.PREVIEW, (obj) => {console.log(obj);store.dispatch(setPreview(obj))})
  setFunction(ClientInterface.GAMEEND, (obj) => {store.dispatch(setGameEnd(obj))})
  setFunction(ClientInterface.SCORE, (obj) => {console.log(obj);store.dispatch(setScore(obj))})
  setFunction(ClientInterface.WAITINGINFO, (obj) => {console.log(obj); store.dispatch(setWaitInfo(obj))})
  setFunction(ClientInterface.GLOBALCHAT, (obj) => {console.log(obj);store.dispatch(addGlobalChat(obj))})
  setFunction(ClientInterface.CHAT, (obj) => {})
}