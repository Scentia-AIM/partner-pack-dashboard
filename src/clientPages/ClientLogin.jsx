import aimLogo from "../assets/aim-logo.png";
import { useState } from "react";
import "../styles/login.css";

export default function ClientLogin({ currentContract, onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");

  function handleSubmit(event) {
    event.preventDefault();

    if (!email || !password) {
      setLoginError("Please enter a valid email and password.");
      return;
    }

    setLoginError("");
    onLogin();
  }
  return (
    <div className="login">
      <div className="gradient-top"></div>
      <div className="gradient-btm"></div>
      <img alt="AIM Logo" src={aimLogo} />
      <div className="card">
        <p>{currentContract.clients.name}</p>
        <h1>Premium Partner Pack</h1>

        <form onSubmit={handleSubmit}>
          <label>
            Email
            <input
              type="email"
              placeholder="name@example.com"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
          </label>

          <label>
            Password
            <input
              type="password"
              placeholder="Your password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
          </label>
          {loginError && <p className="error">{loginError}</p>}

          <button className="btn primary" type="submit">
            Login
          </button>
        </form>
      </div>
      <p className="copyright">
        &copy; Copyright {new Date().getFullYear()} Australian Institute of
        Business. All Rights Reserved.
      </p>
    </div>
  );
}
