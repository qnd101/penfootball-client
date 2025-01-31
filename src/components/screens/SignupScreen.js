import React, { useEffect } from "react";
import "./SignupScreen.css";
import { useState } from "react";
import { postSignup } from "states/apiinterface";
import { useDispatch } from "react-redux";
import { gotoState } from "states/store";
import { AppState, ConnectionState } from "states/enums/enums";
import { getConnectionState, stopConnection } from "states/signalRinterface";
import config from "config";

export default function SignupScreen() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [passwordverify, setPasswordVerify] = useState("");
  const [enabled, setEnabled] = useState(true);
  const [description, setDescription] = useState("");
  const [success, setSuccess] = useState(false);

  const dispatch = useDispatch();
  const state = getConnectionState();
  if (state !== ConnectionState.Disconnected && state !== ConnectionState.Null) stopConnection();

  useEffect(() => {
    if (success === true) {
      //window.open(config.NEWBIE_ENDPOINT);
      dispatch(gotoState(AppState.LOGIN));
    }
  }, [success, dispatch]);

  const handleSubmit = (event) => {
    event.preventDefault();
    setEnabled(false);

    if (password !== passwordverify) {
      setDescription("Error: Check password");
      setEnabled(true);
      return;
    }

    // Create the payload
    setDescription("Signing up...");
    postSignup(username, password).then(
      async (response) => {
        if (response.ok) {
          setDescription("Signup Successful!");
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
    <div id="container-signup">
      <label id="label-signup" className="text-border">
        Sign Up
      </label>
      <hr id="hr-signup" />
      <form onSubmit={handleSubmit} id="form-signup">
        <label htmlFor="username" className="text-signup label-signup">
          Username
        </label>
        <input
          type="text"
          id="username"
          name="username"
          className="text-signup input-signup"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />

        <label htmlFor="password" className="text-signup label-signup">
          Password
        </label>
        <input
          type="password"
          id="password"
          name="password"
          className="text-signup input-signup"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <label htmlFor="password_verify" className="text-signup label-signup">
          Verify
        </label>
        <input
          type="password"
          id="password-verify"
          name="password-verify"
          className="text-signup input-signup"
          value={passwordverify}
          onChange={(e) => setPasswordVerify(e.target.value)}
          required
        />

        <div id="container-signupbtn">
          <button
            type="button"
            className="text-signup btn-signup button-coloroutlinechanging"
            id="btn-goback"
            disabled={!enabled}
            onClick={() => {dispatch(gotoState(AppState.LOGIN))}}
          >
            Go Back
          </button>
          <input
            type="submit"
            value="Join"
            className="text-signup btn-signup button-coloroutlinechanging"
            id="btn-signup"
            disabled={!enabled}
          />
        </div>
      </form>
      <article id="article-signupinfo">{description.slice(0, 100)}</article>
    </div>
  );
}
