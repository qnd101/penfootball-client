import { useEffect, useRef } from "react";
import styles from "./SpeechBubble.module.css";

export default function SpeechBubble({ className, id, text, position, left = false }) {
  const canvasref = useRef("");
  const articleref = useRef("");
  const halftriw = 15;
  const trih = 30;
  const outlineWidth = 3;
  const padding = 15;
  useEffect(() => {
    const { width, height } = articleref.current.getBoundingClientRect();

    const maxx = window.innerWidth;
    const offset = left? width - Math.min(width, maxx - position.x - padding) : Math.min(width, position.x-padding);
    const t = offset / width;
    const triwc = t * (width - 2 * halftriw) + halftriw;
    articleref.current.style.left = position.x - offset + "px";
    articleref.current.style.top = position.y - height - trih + 0.5 + "px";

    canvasref.current.style.width = width + 2 * outlineWidth + "px";
    canvasref.current.style.height = trih + "px";
    canvasref.current.width = width + 2 * outlineWidth;
    canvasref.current.height = trih;
    canvasref.current.style.left = position.x - offset - outlineWidth + "px"; // Set the top position
    canvasref.current.style.top = position.y - trih + "px";

    const ctx = canvasref.current.getContext("2d");
    ctx.clearRect(0, 0, width, trih);
    ctx.lineWidth = outlineWidth;
    ctx.strokeStyle = "black";
    ctx.fillStyle = "white";
    ctx.lineCap = "round";

    ctx.beginPath();
    ctx.moveTo(triwc - halftriw + outlineWidth, 0);
    ctx.lineTo(offset + outlineWidth, trih);
    ctx.lineTo(triwc + halftriw + outlineWidth, 0);
    ctx.fill();
    ctx.stroke();
  }, [position, text, canvasref, articleref, left]);

  return (
    <div>
      <article
        className={className + " " + styles["article"]}
        ref={articleref}
        id={id}
        style={{ minWidth: 3 * halftriw + "px" }}
      >
        {text}
      </article>
      <canvas ref={canvasref} className={styles["canvas"]} style={{ width: 2 * halftriw + "px" }} />
    </div>
  );
}
