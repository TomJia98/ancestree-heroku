const { AuthenticationError } = require("apollo-server-express");
const { User, Person, LinkingCode } = require("../models");
const { signToken } = require("../utils/auth");
const { GraphQLDateTime } = require("graphql-iso-date");

const customScalarResolver = {
  Date: GraphQLDateTime,
};

// function alsoContains(a, b) {
//   for (var i = 0; i < a.length; i++) if (a[i] != b[i]) return false;
//   return true;
// }

// function isEqual(a, b) {
//   // If length is not equal
//   if (a.length != b.length) return false;
//   else {
//     // Comparing each element of array
//     for (var i = 0; i < a.length; i++) if (a[i] != b[i]) return false;
//     return true;
//   }
// }
//old functions, might be used later

const resolvers = {
  Query: {
    persons: async (parent, args, context) => {
      const userId = context.user._id;
      if (!userId) {
        return new Error("user is not logged in");
      }
      return await Person.find({ createdBy: userId });
    },
    person: async (parent, { personId }) => {
      const person = await Person.findById(personId);
      return person;
    },
    users: async (parent, args, context) => {
      const users = await User.find();
      return users;
    },
  },
  Mutation: {
    createLink: async (
      parent,
      { linkingCode, userWhoIsLinking, linkedToPerson },
      context
    ) => {
      const userId = context.user._id;
      if (!userId) {
        return new Error("user is not logged in");
      }
      try {
        const newCode = await LinkingCode.create({
          linkingCode,
          userWhoIsLinking,
          linkedToPerson,
        });
        return newCode;
      } catch (e) {
        return new Error(e);
      }
    },

    acceptLink: async (parent, { linkingCode }) => {
      try {
        const findLink = await LinkingCode.findOne({ linkingCode });
        if (!findLink) {
          return new Error("no linking code found");
        } else await LinkingCode.findByIdAndDelete({ _id: findLink._id });
        return findLink;
      } catch (e) {
        return new Error(e);
      }
    },
    createLinkedUser: async (
      parent,
      { userWhoIsLinking, linkedToPerson, email, password }
    ) => {
      //values are saved as ID strings
      try {
        const findLinkedPerson = await Person.findByIdAndUpdate(
          { _id: linkedToPerson },
          { isLinked: true }
        );

        const newUser = await User.create({
          name: findLinkedPerson.name,
          password: password,
          email: email,
          person: linkedToPerson,
        });
        const updatingUsersPeopleArr = await Person.find({
          createdBy: userWhoIsLinking,
        });
        console.log(updatingUsersPeopleArr);
        console.log(userWhoIsLinking);
        for (let i = 0; i < updatingUsersPeopleArr.length; i++) {
          await Person.findByIdAndUpdate(
            { _id: updatingUsersPeopleArr[i]._id },
            { $push: { createdBy: newUser._id } }
          );
        }
        const token = signToken(newUser);

        return { token, newUser };
      } catch (e) {
        return new Error("failed to link up and create new user");
      }
    },

    addPerson: async (
      parent,
      { name, deathDate, birthday, parents, children, isClose, createdBy },
      context
    ) => {
      const user = context.user;
      if (!user) {
        return new Error("user is not logged in");
      }
      if (parents) {
        if (parents.length > 2) {
          return new Error("cant have more than 2 parents");
        }
      }
      try {
        const newPerson = await Person.create({
          name,
          deathDate,
          birthday,
          parents,
          children,
          isClose,
          isLinked: false,
          createdBy,
        });

        return newPerson;
      } catch (err) {
        console.log(err);
        return err;
      }
    },

    updateRelations: async (parent, { _ID, children, parents }, context) => {
      const userId = context.user._id;
      if (!userId) {
        return new Error("user is not logged in");
      }
      try {
        const updatingPerson = await Person.findById({ _id: _ID });

        try {
          const updatePerson = await Person.findByIdAndUpdate(
            { _id: _ID },
            {
              $push: { parents: parents, children: children },
            },
            { new: true }
          );
          return updatePerson;
        } catch (e) {
          console.log(e);
        }
      } catch (e) {
        console.log(e);
      }
    },

    updatePerson: async (
      parent,
      { _ID, name, deathDate, birthday, parents, children, isClose },
      context
    ) => {
      const user = context.user;
      if (!user) {
        return new Error("No User is logged in");
      }
      if (parents) {
        if (parents.length > 2) {
          return new Error("cant have more than 2 parents");
        }
      }

      const updatingPerson = await Person.findOne({
        _id: _ID,
        createdBy: user._id,
      });

      if (updatingPerson) {
        //this runs if the two are the same
        const updatedPerson = await Person.findOneAndUpdate(
          { _id: _ID },
          {
            name,
            deathDate,
            birthday,
            parents,
            children,
            isClose,
          },
          { new: true }
        );
        return updatedPerson;
      } else {
        return new Error("cannot find person");
      }
    },
    addUser: async (parent, { name, email, password, birthday }, context) => {
      try {
        console.log("creating new user named " + name);
        const newPerson = await Person.create({
          name,
          birthday,
          isLinked: true,
          isClose: false,
        });
        const id = newPerson._id.toString();

        const user = await User.create({
          name,
          email,
          password,
          person: id,
        });
        const userId = user._id.toString();

        const updatedPerson = await Person.findByIdAndUpdate(
          { _id: newPerson._id },
          { createdBy: [userId] },
          { new: true }
        );
        const token = signToken(user);

        return { token, user };
      } catch (err) {
        console.log(err);
        return err;
      }
    },

    deletePerson: async (parent, { _ID }, context) => {
      const user = context.user;
      if (!user) {
        return new Error("user not logged in!");
      }
      const findPerson = await Person.findOne({ _id: _ID });
      if (findPerson.children.length === 0 && findPerson.parents.length === 0) {
        await findOneAndDelete({ _id: _ID });
        return `${findPerson.name} has been deleted with all traces`;
      } else if (
        findPerson.children.length === 0 &&
        findPerson.parents.length !== 0
      ) {
        const parents = findPerson.parents;
        console.log(parents);
        for (let i = 0; i < parents.length; i++) {
          await Person.findOneAndUpdate(
            { _id: parents[i] },
            {
              $pull: {
                children: { _id: _ID },
              },
            }
          ); //go through the selected person to delete and scrub them from their parents children array
        }
        return `${findPerson.name} has been deleted with all traces`;
      } else if (findPerson.children.length !== 0) {
        await Person.findOneAndUpdate({
          name: "",
          deathDate: "",
          birthday: "",
          isclose: false,
          isLinked: false,
        });
        return `${findPerson.name}'s details have been removed, but links kept intact`;
      }
    },
    login: async (parent, { email, password }, context) => {
      const user = await User.findOne({ email });

      if (!user) {
        throw new AuthenticationError("No user with this email found!");
      }

      const correctPw = await user.isCorrectPassword(password);

      if (!correctPw) {
        throw new AuthenticationError("Incorrect password!");
      }

      const token = signToken(user);
      return { token, user };
    },
  },
};

module.exports = { resolvers, customScalarResolver };
