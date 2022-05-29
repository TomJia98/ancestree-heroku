import React from "react";
import Auth from "../../utils/auth";
import { Link } from "react-router-dom";
function Header() {
  const isLogged = Auth.loggedIn();

  const logout = () => {
    Auth.logout();
    window.location.href = "/";
  };
  return (
    <header>
      <h1 id="title">AncesTree</h1>
      {isLogged ? (
        <>
          <button className="log" onClick={logout}>
            Log Out
          </button>
        </>
      ) : (
        <>
          <Link className="log" to="/login">
            Login
          </Link>
        </>
      )}
    </header>
  );
}

export default Header;
