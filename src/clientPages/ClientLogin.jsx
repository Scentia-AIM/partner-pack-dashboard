import aimLogo from "../assets/aim-logo.png";
import { useState } from "react";
import "../styles/login.css";
import { supabase } from "../lib/supabaseClient";

export default function ClientLogin({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();

    if (!email || !password) {
      setLoginError("Please enter a valid email and password.");
      return;
    }

    setIsLoggingIn(true);
    setLoginError("");

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.error("Login error:", error);
      setLoginError("The email or password entered is incorrect.");
      setIsLoggingIn(false);
      return;
    }

    console.log("Logged in user:", data.user);

    await onLogin();

    setIsLoggingIn(false);
  }

  return (
    <div className="login">
      <div className="gradient-top"></div>
      <div className="gradient-btm"></div>

      <img alt="AIM Logo" src={aimLogo} />

      <div className="card">
        <p>Client Portal</p>
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

          <button className="btn primary" type="submit" disabled={isLoggingIn}>
            {isLoggingIn ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>

      <p className="copyright">
        &copy; Copyright {new Date().getFullYear()} Australian Institute of
        Management. All Rights Reserved.
      </p>
    </div>
  );
}
