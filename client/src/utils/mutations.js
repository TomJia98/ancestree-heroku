import { gql } from "@apollo/client";

export const UPDATE_CHILDREN_AND_PARENTS = gql`
  mutation updateRelations($_ID: ID!, $children: String, $parents: [String]) {
    updateRelations(_ID: $_ID, children: $children, parents: $parents) {
      _id
      name
      parents
      children
    }
  }
`;

export const ADD_USER = gql`
  mutation addUser(
    $name: String!
    $email: String!
    $password: String!
    $birthday: String!
  ) {
    addUser(
      name: $name
      email: $email
      password: $password
      birthday: $birthday
    ) {
      token
      User {
        _id
        name
      }
    }
  }
`;

export const ADD_PERSON = gql`
  mutation addPerson(
    $name: String!
    $deathDate: String
    $birthday: String
    $parents: [String]
    $children: [String]
    $createdBy: [String]
    $isClose: Boolean
  ) {
    addPerson(
      name: $name
      deathDate: $deathDate
      birthday: $birthday
      parents: $parents
      children: $children
      createdBy: $createdBy
      isClose: $isClose
    ) {
      _id
      name
      deathDate
      birthday
      createdBy
      parents
      children
      isClose
    }
  }
`;

export const UPDATE_PERSON = gql`
  mutation updatePerson(
    $_ID: ID!
    $name: String
    $deathDate: String
    $birthday: String
    $parents: [String]
    $children: [String]
    $isClose: Boolean
  ) {
    updatePerson(
      _ID: $_ID
      name: $name
      deathDate: $deathDate
      birthday: $birthday
      parents: $parents
      children: $children
      isClose: $isClose
    ) {
      _id
      name
      deathDate
      birthday
      parents
      children
      isClose
    }
  }
`;

export const LOGIN_USER = gql`
  mutation login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
    }
  }
`;

export const CREATE_LINK = gql`
  mutation createLink(
    $linkingCode: String!
    $userWhoIsLinking: String!
    $linkedToPerson: String!
  ) {
    createLink(
      linkingCode: $linkingCode
      userWhoIsLinking: $userWhoIsLinking
      linkedToPerson: $linkedToPerson
    ) {
      linkingCode
    }
  }
`;

export const ACCEPT_LINK = gql`
  mutation acceptLink($linkingCode: String!) {
    acceptLink(linkingCode: $linkingCode) {
      userWhoIsLinking
      linkedToPerson
    }
  }
`;

export const CREATE_LINKED_USER = gql`
  mutation createLinkedUser(
    $userWhoIsLinking: String!
    $linkedToPerson: String!
    $email: String!
    $password: String!
  ) {
    createLinkedUser(
      userWhoIsLinking: $userWhoIsLinking
      linkedToPerson: $linkedToPerson
      email: $email
      password: $password
    ) {
      token
    }
  }
`;

export const DELETE_PERSON = gql`
  mutation deletePerson($_ID: ID!) {
    deletePerson(_ID: $_ID)
  }
`;
