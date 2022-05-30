import React, { useState } from "react";
import { useMutation } from "@apollo/client";
import { UPDATE_PERSON, DELETE_PERSON } from "../utils/mutations";
import Auth from "../utils/auth";

const EditPerson = (props) => {
  const usersPersonId = Auth.getProfile();
  const [updatePerson, { error }] = useMutation(UPDATE_PERSON);
  const [formState, setFormState] = useState({
    name: props.name,
    deathDate: props.deathDate,
    birthday: props.birthday,
    isClose: props.isClose,
  });
  const [deletePerson, { error: delError }] = useMutation(DELETE_PERSON);
  const [displayError, setDisplayError] = useState("");

  const deleteById = async () => {
    if (props.personId == usersPersonId.data.person) {
      setDisplayError("you cant delete yourself!");
      setTimeout(() => {
        setDisplayError("");
      }, 1000);
      return;
    }
    try {
      const deleteThisPerson = await deletePerson({
        variables: { _ID: props.personId },
      });
      if (
        deleteThisPerson.data.deletePerson === "need to remove children first"
      ) {
        setDisplayError("Deleted person must not have children");
        setTimeout(() => {
          setDisplayError("");
        }, 1000);
      } else props.refresh();
    } catch (e) {
      console.error(e);
    }
  };
  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormState({
      ...formState,
      [name]: value,
    });
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    try {
      const updatingPerson = await updatePerson({
        variables: { ...formState, _ID: props.personId },
      });
      props.refresh();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <span id="editPerson">
      <form onSubmit={handleFormSubmit}>
        <label>
          <br></br>
          Name:
          <input
            className="form-input"
            placeholder="Name"
            name="name"
            type="text"
            value={formState.name}
            onChange={handleChange}
          />
        </label>
        <br></br>
        <label>
          Birthdate:
          <input
            className="form-input"
            placeholder=" birthday"
            name="birthday"
            type="date"
            value={formState.birthday}
            onChange={handleChange}
          />
        </label>
        <br></br>
        <label>
          DeathDate:
          <input
            className="form-input"
            placeholder="deathDate"
            name="deathDate"
            type="date"
            value={formState.deathDate}
            onChange={handleChange}
          />
        </label>
        <br></br>
        <label>
          Email on birthday
          <input
            className="react-switch-checkbox"
            name="isClose"
            type="checkbox"
            value={formState.isClose}
            onChange={handleChange}
          />
        </label>
        <br></br>
        <button type="submit">Update Person</button>
      </form>
      <br></br>
      <button onClick={deleteById}>Delete Person</button>
      <p>{displayError}</p>
    </span>
  );
};

export default EditPerson;
