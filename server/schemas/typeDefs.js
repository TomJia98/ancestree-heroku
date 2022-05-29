const { gql } = require("apollo-server-express");

const typeDefs = gql`
  scalar Date

  type LinkingCode {
    _id: ID!
    linkingCode: String!
    userWhoIsLinking: String!
    linkedToPerson: String!
  }

  type User {
    _id: ID!
    name: String!
    email: String!
    password: String!
    person: String!
  }

  type Person {
    _id: ID!
    name: String
    deathDate: String
    birthday: String
    createdBy: [String!]
    parents: [String]
    children: [String]
    isClose: Boolean!
    isLinked: Boolean!
  }

  type Auth {
    token: ID!
    User: User
  }

  type Query {
    persons: [Person]
    person(personId: ID!): Person
    users: [User]
  }

  type Mutation {
    createLink(
      linkingCode: String!
      userWhoIsLinking: String!
      linkedToPerson: String!
    ): LinkingCode

    acceptLink(linkingCode: String!): LinkingCode

    createLinkedUser(
      userWhoIsLinking: String!
      linkedToPerson: String!
      email: String!
      password: String!
    ): Auth

    addPerson(
      name: String!
      deathDate: String
      birthday: String
      createdBy: [String]
      parents: [String]
      children: [String]
      isClose: Boolean
    ): Person

    updateRelations(_ID: ID!, children: String, parents: [String]): Person

    updatePerson(
      _ID: ID!
      name: String
      deathDate: String
      birthday: String
      parents: [String]
      children: [String]
      isClose: Boolean
    ): Person

    deletePerson(_ID: ID!): String

    addUser(
      name: String!
      email: String!
      password: String!
      birthday: String!
    ): Auth

    login(email: String!, password: String!): Auth
  }
`;
// removeUser(deleteAll: Boolean!): Auth
// get this working at a later date

module.exports = typeDefs;
