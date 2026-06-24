import aimLogo from "../assets/aim-logo.png";
import { useState } from "react";
import "../styles/login.css";
import { supabase } from "../lib/supabaseClient";

export default function AdminLogin({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();

    if (!email || !password) {
      setLoginError("Please enter a valid email and password.");
      return;
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.error("Admin login error:", error);
      setLoginError("The email or password entered is incorrect.");
      return;
    }

    const { data: adminUser, error: adminError } = await supabase
      .from("admin_users")
      .select("*")
      .eq("auth_user_id", data.user.id)
      .single();

    if (adminError || !adminUser) {
      console.error("Admin access error:", adminError);
      await supabase.auth.signOut();
      setLoginError("You do not have access to the admin area.");
      return;
    }

    setLoginError("");
    onLogin(data.user);
  }

  return (
    <div className="login">
      <div className="gradient-top"></div>
      <div className="gradient-btm"></div>

      <img alt="AIM Logo" src={aimLogo} />

      <div className="card">
        <p>Admin access</p>
        <h1>Partner Management</h1>

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
