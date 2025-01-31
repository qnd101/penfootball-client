import { useState, useEffect } from "react";
import { emailAuth } from "states/apiinterface";
import "./EmailModal.css"

export default function EmailModal ({onClose})
{
    const [email, setEmail] = useState("");
    const [enabled, setEnabled] = useState(true);
    const [description, setDescription] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
    setEnabled(false);
    
    // Create the payload
    setDescription("Sending Request...");
    emailAuth(email).then(
      async (response) => {
        if (response.ok) {
          setDescription("Authentication mail sent successfully!");
          setTimeout(onClose, 500);
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
  }

  return (
    <div className="modal-email-overlay">
      <div className="modal-email-content">
        <span className="modal-email-closebtn" onClick={onClose}>
          &times;
        </span>
        <h1>Submit Your Email</h1>
        <hr/>
        <form onSubmit={handleSubmit}>
          <div>
            <label className="modal-email-label">Email Address:</label>
            <input className="modal-email-input" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <button className="modal-email-btn button-coloroutlinechanging " type="submit" disabled={!enabled}>Submit</button>
        </form>
        <article id="article-emailauthinfo">{description.slice(0, 100)}</article>
      </div>
    </div>
  );
};
