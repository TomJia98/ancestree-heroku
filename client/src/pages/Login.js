import React, { useState } from "react";
import { Link } from "react-router-dom";

import { LOGIN_USER } from "../utils/mutations";
import { useMutation } from "@apollo/client";
import Auth from "../utils/auth";

const Login = (props) => {
  let isLogged = Auth.loggedIn();
  let [errorLogin, setErrorLogin] = useState("");
  const [formState, setFormState] = useState({ email: "", password: "" });
  const [login, { error, data }] = useMutation(LOGIN_USER);
  function clearError() {
    setErrorLogin("");
  }

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormState({
      ...formState,
      [name]: value,
    });
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    console.log(formState);
    try {
      const { data } = await login({
        variables: { ...formState },
      });

      Auth.login(data.login.token);
      window.location.href = "/main";
      setErrorLogin();
    } catch (e) {
      setErrorLogin("invalid login credentials");
      setTimeout(() => {
        setErrorLogin("");
      }, 1000);
      console.error(e);
    }
    setFormState({
      email: "",
      password: "",
    });
  };

  return (
    <main>
      {isLogged ? (
        <>
          <p>
            It looks like your already logged in, view your tree
            <Link to={"/main"}>here</Link>
          </p>
        </>
      ) : (
        <>
          <Link className="goBack" to={"/"}>
            Go Back
          </Link>
          <h2>Login</h2>
          <form onSubmit={handleFormSubmit}>
            <label>
              Email
              <br></br>
              <input
                className="form-input"
                placeholder="Email"
                name="email"
                type="email"
                value={formState.email}
                onChange={handleChange}
              />
            </label>
            <br></br>
            <br></br>
            <label>
              Password
              <br></br>
              <input
                className="form-input"
                placeholder="******"
                name="password"
                type="password"
                value={formState.password}
                onChange={handleChange}
              />
            </label>
            <br></br>
            <button style={{ cursor: "pointer" }} type="submit">
              Submit
            </button>
          </form>
          <p>{errorLogin}</p>
        </>
      )}
    </main>
  );
};

export default Login;
