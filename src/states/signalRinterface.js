import * as signalR from "@microsoft/signalr";
import { getToken } from "./apiinterface";

let connection = undefined;
//Store.js에서 사용할 수 있는 로직 제공

export function buildConnection(url) {
  connection = new signalR.HubConnectionBuilder()
  .withUrl(url, {
    accessTokenFactory: ()=>getToken()
  })
  .configureLogging(signalR.LogLevel.Information)
  .build();
}

export function getConnectionState () {
  if(!connection)
    return "Null"
  return connection.state
}

export async function invokeKeyEvent(eventtype, keytype){
  console.assert(connection)
  await connection.invoke("KeyEvent", eventtype, keytype)
}

export async function enterNormGame(rating){
  console.assert(connection)
  await connection.invoke("EnterNormGame", rating)
}

export async function enterTraining() {
  console.assert(connection)
  await connection.invoke("EnterTraining")
}
export async function enterTwoVTwoGame(rating) {
  await connection.invoke("EnterTwoVTwo", rating)
}
export async function exitGame() {
  await connection.invoke("Exit")
}

export async function getChatCache() {
  let cache = await connection.invoke("GetGlobalChatCache")
  console.log(cache)
  return cache
}

export async function sendChat(msg) {
  return await connection.invoke("GlobalChat", msg)
}

export async function startConnection() {
  console.assert(connection)
  await connection.start()
}

export async function stopConnection() {
  await connection.stop()
}
export function setFunction(funcname, callback){
  console.assert(connection)
  connection.on(funcname, callback)
}

export function setOnClose(funcname, callback){
  console.assert(connection)
  connection.onclose(callback);
}