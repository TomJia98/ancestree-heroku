import React, { useState } from "react";
import { QUERY_SINGLE_PERSON, QUERY_PERSONS_NAME_ID } from "../utils/queries";
import convertUnixTime from "../utils/convertUnix";
import { CREATE_LINK } from "../utils/mutations";
import { useQuery, useMutation } from "@apollo/client";
import Auth from "../utils/auth";
import AddChild from "./addChild";
import EditPerson from "./editPerson";
import CreateParents from "./createParents";
import codeGenerator from "../utils/codeGenerator";

const SinglePersonInfo = (props) => {
  let [ISADDCHILD, setISADDCHILD] = useState(false);
  let [ISEDIT, setISEDIT] = useState(false);
  let [hasParents, sethasParents] = useState();
  let [currentLinkCode, setCurrentLinkCode] = useState();

  const { loading: NIDLoading, data: NIDData } = useQuery(
    QUERY_PERSONS_NAME_ID
  );
  const user = Auth.getProfile();
  console.log(user);
  const personId = user.data.person;

  const { loading, data } = useQuery(QUERY_SINGLE_PERSON, {
    variables: { personId: props.current || personId },
  });
  const [createNewLink, { error }] = useMutation(CREATE_LINK);

  const createLink = async () => {
    const newCode = codeGenerator(9);
    const newLinkCode = await createNewLink({
      variables: {
        linkingCode: newCode,
        userWhoIsLinking: user.data._id,
        linkedToPerson: props.current,
      },
    });
    if (newLinkCode) {
      setCurrentLinkCode(` your code is 
       ${newCode}`);
    } else setCurrentLinkCode("Something went wrong, try again");

    //use the linking code mutation to actually create the code, then return it to the user
  };

  const addChildShow = () => {
    if (ISADDCHILD) {
      setISADDCHILD(false);
    } else setISADDCHILD(true);
    setISEDIT(false);
  };
  const setAllFalse = () => {
    setISEDIT(false);
    setISADDCHILD(false);
  };
  const addEditShow = () => {
    if (ISEDIT) {
      setISEDIT(false);
    } else setISEDIT(true);
    setISADDCHILD(false);
  };
  return (
    <span id="singlePersonInfo">
      {loading ? (
        <>
          <p>loading...</p>
        </>
      ) : (
        <>
          <p>Name: {data.person.name}</p>
          <p>Born on: {convertUnixTime(data.person.birthday)}</p>
          <p>Children: {data.person.children.length}</p>
          {data.person.deathDate ? (
            <p>Passed away on {convertUnixTime(data.person.deathDate)}</p>
          ) : (
            <></>
          )}
          {data.person.parents.length ? (
            <></>
          ) : (
            <>
              {" "}
              <button onClick={setAllFalse}>Add Parents</button>
              <CreateParents
                isActive={ISADDCHILD || ISEDIT}
                personId={data.person._id}
                createdBy={data.person.createdBy}
              />
            </>
          )}
          {props.current ? (
            <>
              <button className="editButtons" onClick={createLink}>
                Create linking code
              </button>
              <p className="editButtons">{currentLinkCode}</p>
            </>
          ) : (
            <></>
          )}
          <button className="editButtons" onClick={addChildShow}>
            new child
          </button>
          <br></br>
          <br></br>

          <button className="editButtons" onClick={addEditShow}>
            edit current person
          </button>
          {ISADDCHILD ? (
            <>
              <AddChild
                personId={data.person._id}
                addChildHide={addChildShow}
                personsIdAndNameArr={NIDData}
                createdBy={data.person.createdBy}
              ></AddChild>
            </>
          ) : (
            <></>
          )}
          {ISEDIT ? (
            <>
              <EditPerson
                personId={data.person._id}
                name={data.person.name}
                deathDate={data.person.deathDate}
                birthday={data.person.birthday}
                isClose={data.person.isClose}
              ></EditPerson>
            </>
          ) : (
            <></>
          )}
        </>
      )}
      <br></br>
      <br></br>

      <br></br>

      <br></br>
    </span>
  );
};
export default SinglePersonInfo;
