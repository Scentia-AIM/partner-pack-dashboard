import aimLogo from "../assets/aim-logo.png";

export default function ClientLogin({ currentContract, onLogin }) {
  return (
    <div className="login">
      <div className="gradient-top"></div>
      <div className="gradient-btm"></div>
      <img alt="AIM Logo" src={aimLogo} />
      <div className="card">
        <p>{currentContract.clients.name}</p>
        <h1>Premium Partner Pack</h1>

        <form
          onSubmit={(event) => {
            event.preventDefault();
            onLogin();
          }}
        >
          <label>
            Email
            <input type="email" placeholder="name@example.com" />
          </label>

          <label>
            Password
            <input type="password" placeholder="Your password" />
          </label>

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
