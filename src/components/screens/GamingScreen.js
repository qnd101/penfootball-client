import "./GamingScreen.css";
import { useEffect, useState } from "react";
import { setKeyEventHandler, clearKeyEventHandler } from "states/keymanager";
import { AppState, GameType } from "states/enums/enums";
import { getConnectionState } from "states/signalRinterface";
import { ConnectionState, Keys } from "states/enums/enums";
import { invokeKeyEvent } from "states/signalRinterface";
import { useDispatch, useSelector } from "react-redux";
import { gotoState, setScore } from "states/store";
import BGMSrc from "sounds/bgm_game.wav";
import ReactHowler from "react-howler";
import favicon from "imgs/favicon.svg";
import SpeechBubble from "components/SpeechBubble";

function showNotification(title, body, timeout) {
  if (Notification.permission === "granted") {
    let notification = new Notification(title, { body: body, icon: favicon });
    setTimeout(function () {
      notification.close();
    }, timeout);
  }
}

function StartAnimNormGame({ name1, rating1, name2, rating2 }) {
  return (
    <>
      <div className="container-startanim container-startanimleft">
        <span className="span-startanimname text-border">{name1}</span>
        <span className="span-startanimrating">({rating1})</span>
      </div>
      <div className="container-startanim container-startanimright">
        <span className="span-startanimname text-border">{name2}</span>
        <span className="span-startanimrating">({rating2})</span>
      </div>
      <span className="span-verses text-border">VS</span>
    </>
  );
}

function StartAnimTwoVTwo({ opdatas }) {
  if (opdatas === undefined) return;
  return (
    <>
      <div className="container-startanim container-startanimleft container-startanimtwovtwo">
        <span className="span-startanimname text-border">{`${opdatas[0].name} & ${opdatas[2].name}`}</span>
      </div>
      <div className="container-startanim container-startanimright container-startanimtwovtwo">
        <span className="span-startanimname text-border">{`${opdatas[1].name} & ${opdatas[3].name}`}</span>
      </div>
      <span className="span-verses text-border">VS</span>
    </>
  );
}

function ScoreBoard({ score }) {
  return (
    <div className="container-gamescore">
      <label className="text-border label-score"> {`${score.score1} - ${score.score2}`}</label>
    </div>
  );
}

function NormGameRankInfo({ userdata, opdata }) {
  return (
    <>
      <div className="container-oprankinfo">
        <label className="text-border">{opdata?.rankletter}</label>
        <article>
          {opdata?.name} <span>({opdata?.rating})</span>
        </article>
      </div>

      <div className="container-myrankinfo">
        <label className="text-border">{userdata.rankletter}</label>
        <article>
          {userdata.name} <br />
          <span>({userdata.rating})</span>
        </article>
      </div>
    </>
  );
}

function TwoVTwoRankInfo({ datas }) {
  if (datas === undefined) return;
  return (
    <>
      <div className="container-oprankinfo container-rankinfotvt">
        <article>
          {datas[1].name}
          <span>({datas[1].rating})</span>
        </article>
        <article>
          {datas[3].name}
          <span>({datas[3].rating})</span>
        </article>
      </div>
      <div className="container-myrankinfo container-rankinfotvt">
        <article>
          {datas[0].name}
          <span>({datas[0].rating})</span>
        </article>
        <article>
          {datas[2].name}
          <span>({datas[2].rating})</span>
        </article>
      </div>
    </>
  );
}

//다른 State으로 탈주할 때 반드시 clearKeyEventHandler를 실행해줘야
export default function GamingScreen() {
  const dispatch = useDispatch();
  const gamedata = useSelector((state) => state.gamedata); //empty when game is not ended
  const [initialized, setInitialized] = useState(false);
  const [notified, setNotified] = useState(false);
  const userdata = useSelector((state) => state.userdata);
  const [showingAnim, setShowingAnim] = useState(true);
  const opdata = gamedata.opdatas === undefined ? undefined : gamedata.opdatas[1];
  const frame = useSelector((state) => state.frame);
  const config = useSelector((state) => state.preview?.config);

  if (!initialized) {
    setTimeout(() => setShowingAnim(false), 2100);
    setKeyEventHandler((eventtype, keytype) => {
      const constate = getConnectionState();
      //연결되었고, GAMING이라면 서버에 키 입력 전달
      if (constate === ConnectionState.Connected) {
        if (keytype[0] === "N"){
          if (eventtype === Keys.KeyUp) console.log(keytype);
        }
          else invokeKeyEvent(eventtype, keytype);
      }
      //만일 연결이 끊긴 상황이라면
      else if (constate === ConnectionState.Disconnected) {
        //그 와중에 Preview 혹은 Gaming 상황이면 Preview로 돌아가자
        dispatch(gotoState(AppState.PREVIEW));
        clearKeyEventHandler();
      }
    });

    setInitialized(true);
  }

  useEffect(() => {
    if (opdata !== undefined && notified === false) {
      if (document.hidden) showNotification("Game Started", `vs ${opdata.name}(${opdata.rating})`, 2000);
      setNotified(true);
    }
  }, [opdata, notified]);

  if (gamedata.score === undefined) {
    dispatch(setScore({ score1: 0, score2: 0 }));
    return;
  }

  const width = window.innerWidth;
  const height = window.innerHeight;
  let ratio = 0;
  const candrawbub = !!config?.width && !!frame?.player1;
  if (candrawbub) {
    ratio = width / config.width;
  }

  const anim =
    gamedata.currentgametype === GameType.NormGame ? (
      <StartAnimNormGame
        name1={userdata.name}
        rating1={userdata.rating}
        name2={opdata?.name}
        rating2={opdata?.rating}
      />
    ) : (
      <StartAnimTwoVTwo opdatas={gamedata.opdatas} />
    );
  const base = (
    <>
      {showingAnim && !gamedata.gameend ? anim : ""}
      <ScoreBoard score={gamedata.score} />
      <ReactHowler src={BGMSrc} playing={true} loop={true} />
      {gamedata.currentgametype === GameType.NormGame ? (
        <NormGameRankInfo userdata={userdata} opdata={opdata} />
      ) : (
        <TwoVTwoRankInfo datas={gamedata.opdatas} />
      )}
      {/*candrawbub && (
        <SpeechBubble
          text="NiggaNiggaNiggaNiggaNiggaNiggaNiggaNigga"
          position={{
            x: frame.player1.x * ratio,
            y: height * 0.85 - (frame.player1.y + config.playerRadius * 1.5) * ratio,
          }}
        />
      )*/}
    </>
  );

  if (gamedata.gameend === undefined) return base;
  else {
    const side1 =
      gamedata.currentgametype === GameType.NormGame
        ? userdata.name
        : `${gamedata.opdatas[0].name} & ${gamedata.opdatas[2].name}`;
    const side2 =
      gamedata.currentgametype === GameType.NormGame
        ? opdata.name
        : `${gamedata.opdatas[1].name} & ${gamedata.opdatas[3].name}`;

    const resulttxt = gamedata.gameend.winner === 1 ? "You Win!" : "You Lose!";
    return (
      <>
        {base}
        <div id="container-gameend">
          <label id="label-result" className="text-border">
            {resulttxt}
          </label>
          <label id="label-resultscoretext">
            {gamedata.gameend.summary.replace("*1*", side1).replace("*2*", side2)}
          </label>
          <button
            id="button-gobacktopreview"
            className="button-coloroutlinechanging text-border"
            onClick={() => {
              dispatch(gotoState(AppState.PREVIEW));
            }}
          >
            {"Menu"}
          </button>
        </div>
      </>
    );
  }
}
