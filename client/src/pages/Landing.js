import React from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@apollo/client";
import Auth from "../utils/auth";
import github from "../assets/GitHub-Mark-64px.png";
import linkedIn from "../assets/LI-In-Bug.png";
import portfolio from "../assets/portfolio.png";

const Landing = () => {
  const style = {
    imageLinks: {
      height: "50px",
      width: "50px",
      marginRight: "50px",
      marginLeft: "50px",
    },
  };
  return (
    <main id="landing">
      <h2>Welcome to AncesTree</h2>
      <p>The collaboratively expandable ancestory viewer</p>
      {Auth.loggedIn() ? (
        <>
          <Link to="/main" className="link">
            View your Tree
          </Link>
        </>
      ) : (
        <>
          <p>
            New here?
            <br></br>
            <Link to="/signup" className="link">
              Signup
            </Link>
          </p>
          <h3>
            Have a linking code?
            <br></br>
            <br></br>
            <Link to="/linking" className="link">
              Click Here
            </Link>
          </h3>
        </>
      )}
      <br></br>
      <div></div>
      <footer>
        <a href="https://github.com/TomJia98" target="_blank">
          <img src={github} style={style.imageLinks}></img>
        </a>
        <a
          href="https://www.linkedin.com/in/tom-jia-222b50226/"
          target="_blank"
        >
          <img src={linkedIn} style={style.imageLinks}></img>
        </a>
        <a href="https://tomjia98.github.io/Portfolio_TJ/" target="_blank">
          <img src={portfolio} style={style.imageLinks}></img>
        </a>
      </footer>
    </main>
  );
};

export default Landing;
