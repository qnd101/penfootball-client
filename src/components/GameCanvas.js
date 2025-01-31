import { useSelector } from "react-redux";
import { useRef, useEffect } from "react";
import { GameType } from "states/enums/enums";

export default function GameCanvas({ id, className }) {
  const canvasref = useRef(null);
  const frame = useSelector((state) => state.frame);
  const preview = useSelector((state) => state.preview)
  const userdata = useSelector((state) => state.userdata);
  const gamedata = useSelector((state) => state.gamedata);

  useEffect(() => {
    const canvas = canvasref.current;
    const ctx = canvas.getContext("2d");
    const width = canvas.width;
    const height = canvas.height;

    const floor_h = height * 0.85;    
    const grad=ctx.createLinearGradient(0,0, 0,height);
    grad.addColorStop(0, "#c6ecec");
    grad.addColorStop(1, "#ecf9f9");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, width, height);

    ctx.fillStyle = "#527a52";
    ctx.fillRect(0, floor_h, width, height - floor_h);

    ctx.lineWidth = 10;
    ctx.strokeStyle = "white";
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.moveTo(width * 0.2, floor_h);
    ctx.lineTo(width * 0.18, (height * 2) / 3 + (floor_h * 1) / 3);
    ctx.lineTo(0, (height * 2) / 3 + (floor_h * 1) / 3);

    ctx.moveTo(width / 2, floor_h);
    ctx.lineTo(width / 2, height);

    ctx.moveTo(width * 0.8, floor_h);
    ctx.lineTo(width * 0.82, (height * 2) / 3 + (floor_h * 1) / 3);
    ctx.lineTo(width, (height * 2) / 3 + (floor_h * 1) / 3);
    ctx.stroke();

    if(preview.config === undefined)
      return

    let config = preview.config;

    const ratio = width / config.width;

    const post_h = floor_h - ratio * config.goalHeight
    const post_w = ratio * config.goalWidth    
    
    if (frame.ball !== undefined) {
      ctx.fillStyle = "rgb(255, 255, 255)";
      ctx.lineWidth = 2;
      ctx.strokeStyle = "rgb(0,0,0)";
      ctx.beginPath();
      ctx.arc(tX(frame.ball.x), tY(frame.ball.y), tL(config.ballRadius), 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
    }

    ctx.lineWidth = 8;
    ctx.fillStyle = "rgb(255, 76, 76)";
    ctx.strokeStyle = "rgb(156, 47, 47)";
    ctx.beginPath();
    ctx.moveTo(0, post_h);
    ctx.arcTo(post_w, post_h, post_w, floor_h, width * 0.015);
    ctx.lineTo(post_w, floor_h);
    ctx.lineTo(0, floor_h);
    ctx.fill();
    ctx.stroke();

    ctx.lineWidth = 8;
    ctx.fillStyle = "rgb(0, 145, 255)";
    ctx.strokeStyle = "rgb(0, 73, 129)";
    ctx.beginPath();
    ctx.moveTo(width, post_h);
    ctx.arcTo(width - post_w, post_h, width -post_w, floor_h, width * 0.015);
    ctx.lineTo(width  - post_w, floor_h);
    ctx.lineTo(width, floor_h);
    ctx.fill();
    ctx.stroke();

    function tX(x) {
      return x * ratio;
    }
    function tY(y) {
      return floor_h - y * ratio;
    }
    function tL(l) {
      return l * ratio;
    }

    ctx.lineWidth = 5;

    for(let i=1;;i++)
    {
      let player = frame[`player${i}`]
      if (player === undefined)
        break
      
      ctx.fillStyle = (i%2)?"rgb(255, 76, 76)":"rgb(0, 145, 255)";
      ctx.strokeStyle = (i%2)?"rgb(156, 47, 47)":"rgb(0, 73, 129)";
      ctx.beginPath();
      ctx.arc(tX(player.x), tY(player.y), tL(config.playerRadius), 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
    }

    if(gamedata.currentgametype === GameType.TwoVTwoGame)
    {
      let ids = gamedata.ids
      if(userdata.id !== undefined && ids.length === 4)
      {
        let minx = 0, maxx = width/2 - config.ballRadius * 2;
        if(ids[2] === userdata.id)
        {
          minx = width/2 + config.ballRadius * 2;
          maxx = width
        }
        ctx.fillStyle = "rgba(0,0,0,0.2)"
        ctx.fillRect(minx, 0, maxx, height);
      }
    }

  }, [canvasref, frame, preview, userdata, gamedata]);

  return <canvas id={id} className={className} ref={canvasref} width={window.innerWidth} height={window.innerHeight} />;
}
