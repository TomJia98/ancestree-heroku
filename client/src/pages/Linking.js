import { useMutation } from "@apollo/client";
import React, { useState } from "react";
import { Link } from "react-router-dom";

import Auth from "../utils/auth";
import { ACCEPT_LINK, CREATE_LINKED_USER } from "../utils/mutations";
const Linking = () => {
  const [code, setCode] = useState("");
  const [formData, setFormData] = useState({
    userWhoIsLinking: "",
    linkedToPerson: "",
    email: "",
    password: "",
  });
  const [isCodeValid, setIsCodeValid] = useState(false);
  const [checkLink, { error: updateError }] = useMutation(ACCEPT_LINK);
  const [createLinkedUser, { error: createLinkError }] =
    useMutation(CREATE_LINKED_USER);

  const handleChange = (event) => {
    //setting the code that the user is inputting
    const { value } = event.target;
    setCode(value);
  };
  const submitCode = async (e) => {
    //checking if the code entered matches one in the db on form submit
    e.preventDefault();
    console.log(code);
    const checkingLink = await checkLink({
      variables: { linkingCode: code },
    });
    if (checkingLink) {
      setIsCodeValid(true);
      const userData = checkingLink.data.acceptLink;
      setFormData({
        ...formData,
        linkedToPerson: userData.linkedToPerson,
        userWhoIsLinking: userData.userWhoIsLinking,
      });
      console.log(checkingLink.data.acceptLink);
    }
    return;
  };

  const handleFormChange = async (event) => {
    const { name, value } = event.target;

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await createLinkedUser({
        variables: { ...formData },
      });
      if (!response.data) {
        throw new Error("something went wrong!");
      }
      Auth.login(response.data.createLinkedUser.token);
      setFormData({
        userWhoIsLinking: "",
        linkedToPerson: "",
        email: "",
        password: "",
      });
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <>
      <Link className="goBack" to={"/"}>
        Go Back
      </Link>

      {isCodeValid ? (
        <>
          <h2>Code validated! Create your account</h2>
          <form onSubmit={handleFormSubmit}>
            <label>
              Email
              <br></br>
              <input
                className="form-input"
                placeholder="Email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleFormChange}
              />
            </label>
            <br></br>
            <label>
              Password
              <br></br>
              <input
                className="form-input"
                placeholder="Password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleFormChange}
              />
            </label>
            <br></br>
            <button type="submit">Create Your Account</button>
          </form>
        </>
      ) : (
        <>
          <form onSubmit={submitCode}>
            <label>
              Enter your linking code
              <br></br>
              <input
                className="form-input"
                placeholder="Linking Code"
                name="code"
                type="text"
                value={code}
                onChange={handleChange}
              />
            </label>
            <br></br>
            <button type="submit"> Submit</button>
          </form>
        </>
      )}
    </>
  );
};

export default Linking;
