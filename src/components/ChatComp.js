import { useEffect, useRef, useState } from "react"
import style from "./ChatComp.module.css"

export default function ChatComp({chatList, sendChat, className}) {
    const [msg, setMsg] = useState("")
    const [desc, setDesc] = useState("")
    const messagesEndRef = useRef()

    useEffect(()=>{
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    },[chatList, messagesEndRef])

    return(
        <div className={style["div-chat"]+" "+className}>
            <ul className={style["ul-chat"]}>
            {chatList.map(item => 
                <li key={item.msg}>{`[${item.time}] ${item.name} : ${item.msg}`}</li>)
            }
            <li ref={messagesEndRef}></li>
            </ul>
            <input type="text" 
            className={style["input-chat"]} 
            value={msg}
            placeholder="Enter Message"
            onChange={(e)=>setMsg(e.target.value)}
            onKeyDown={async (e)=>{
                if(e.key !== "Enter" || !msg)
                    return
                switch(await sendChat(msg))
                {
                    case 0:
                        setMsg("");
                        setDesc("")
                        return;
                    case 1:
                        setDesc("wait 1 second");
                        return;
                    case 2:
                        setDesc("chat too long")
                        return;
                    default:
                        setDesc("failed to send message")
                        return;
                }
            }}/>
            <span className={style["chat-desc"]}>{desc}</span>
        </div>
    )
}