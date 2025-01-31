import React, { useEffect } from "react";
import "./LoginScreen.css";
import { useState } from "react";
import { setToken, postLogin } from "states/apiinterface";
import { useDispatch } from "react-redux";
import { gotoState } from "states/store";
import { AppState, ConnectionState } from "states/enums/enums";
import { getConnectionState, stopConnection } from "states/signalRinterface";

export default function LoginScreen() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [enabled, setEnabled] = useState(true);
  const [description, setDescription] = useState("");
  const [success, setSuccess] = useState(false);

  const dispatch = useDispatch();
  const state = getConnectionState();
  if (state !== ConnectionState.Disconnected && state !== ConnectionState.Null) stopConnection();

  useEffect(() => {
    if (success === true) {
      dispatch(gotoState(AppState.PREVIEW));
    }
  }, [success, dispatch]);

  const handleSubmit = (event) => {
    event.preventDefault();
    setEnabled(false);

    // Create the payload
    setDescription("Logging in...");
    postLogin(username, password).then(
      async (response) => {
        if (response.ok) {
          const token = await response.text();
          console.log(token);
          setToken(token);
          setDescription("Login Successful!");
          setSuccess(true);
        } else {
          setEnabled(true);
          const errtext = await response.text();
          console.log(errtext);
          setDescription(`Error: ${errtext}`);
        }
      },
      (err) => {
        setEnabled(true);
        console.log(err.message);
        setDescription(`Error: ${err.message}`);
      }
    );
  };

  return (
    <div id="container-login">
      <form onSubmit={handleSubmit}>
        <label htmlFor="username" className="text-login label-login">
          Username
        </label>
        <input
          type="text"
          id="username"
          name="username"
          className="text-login input-login"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <br/>
        <label htmlFor="password" className="text-login label-login">
          Password
        </label>
        <input
          type="password"
          id="password"
          name="password"
          className="text-login input-login"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <br />
        <div id="container-loginbtn">
          <button
            type="button"
            className="text-login btn-login button-coloroutlinechanging"
            id="btn-signin"
            disabled={!enabled}
            onClick={() => dispatch(gotoState(AppState.SIGNUP))}
          >
            Sign Up
          </button>
          <input
            type="submit"
            value="Let me in"
            className="text-login btn-login button-coloroutlinechanging"
            id="btn-login"
            disabled={!enabled}
          />
        </div>
      </form>
      <article id="article-logininfo">{description.slice(0, 100)}</article>
    </div>
  );
}
