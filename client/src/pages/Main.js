import React, { useState } from "react";
import { Link } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import { useQuery } from "@apollo/client";
import { QUERY_SINGLE_PERSON, QUERY_PERSONS } from "../utils/queries";
import Graph from "react-graph-vis";
import Auth from "../utils/auth";
import SinglePersonInfo from "../components/SinglePersonInfo";

const Main = () => {
  const user = Auth.getProfile();
  const [selectedNode, setSelectedNode] = useState(""); //add the logged in users person here as default

  const [isGraphFinished, setIsGraph] = useState(false);
  const personId = user.data.person;

  const { loading: allLoading, data: allData } = useQuery(QUERY_PERSONS);

  const { loading, data: userData } = useQuery(QUERY_SINGLE_PERSON, {
    variables: { personId },
  });

  let [graphKey, setGraphKey] = useState(uuidv4);

  let [graph, setGraph] = useState({
    nodes: [],
    edges: [],
  });

  if (allData && !isGraphFinished) {
    const allPeople = allData.persons;
    const peopleNodeArr = [];
    const peopleEdgeArr = [];

    allPeople.forEach((el) => {
      let personNode;
      if (el.isLinked) {
        personNode = { id: el._id, label: el.name, color: "red" };
      } else {
        personNode = { id: el._id, label: el.name };
      }
      peopleNodeArr.push(personNode);
      let personEdge = [];
      for (let i = 0; i < el.children.length; i++) {
        let edge = { from: el._id, to: el.children[i] };
        personEdge.push(edge);
      }
      peopleEdgeArr.push.apply(peopleEdgeArr, personEdge);
    });

    let newGraph = { nodes: peopleNodeArr, edges: peopleEdgeArr };
    setGraph(newGraph);
    setIsGraph(true);
  }

  const options = {
    layout: {
      hierarchical: {
        direction: "UD",
        enabled: true,
        sortMethod: "directed",
        shakeTowards: "leaves",
      },
    },
    edges: {
      color: "#000000",
    },
    height: "500px",
  };

  const events = {
    //add selection criteria to not switch if clicking away from a node
    select: function (event) {
      var { nodes, edges } = event;
      console.log(nodes[0]);
      if (nodes[0] === undefined) {
        return;
      }
      if (nodes[0] === personId) {
        setSelectedNode();
      } else setSelectedNode(nodes[0]);
    },
  };

  return (
    <main>
      {Auth.loggedIn() ? (
        <>
          <div id="mainSpace"> </div>
          <SinglePersonInfo current={selectedNode} />
          {isGraphFinished ? (
            <Graph
              id="graph"
              key={graphKey}
              graph={graph}
              options={options}
              events={events}
            />
          ) : (
            <>
              <p>family tree is being rendered</p>
            </>
          )}
        </>
      ) : (
        <>
          <p>
            It looks like you are not logged in! please log in or signup
            <Link to="/login">here</Link>
          </p>
        </>
      )}
    </main>
  );
};

export default Main;
