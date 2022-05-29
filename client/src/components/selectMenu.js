import React, { Component } from "react";
import { QUERY_SINGLE_PERSON, QUERY_PERSONS_NAME_ID } from "../utils/queries";
import { useQuery } from "@apollo/client";

import AsyncCreatableSelect from "react-select/async-creatable";

class WithPromises extends Component {
  render() {
    const PromiseOptions = async (inputValue) => {
      //   const { loading, data } = useQuery(QUERY_PERSONS_NAME_ID);
      //   if (data) {
      //     let returnData;
      //     console.log(data);
      //     console.log("the data from that new query");
      //   }
      return [
        { value: "a", label: "a" },
        { value: "b", label: "b" },
      ];
    };
    return (
      <AsyncCreatableSelect
        isMulti
        cacheOptions
        defaultOptions
        loadOptions={PromiseOptions}
      />
    );
  }
}
