import { GraphQLServer } from "graphql-yoga";
import db from "./db";
import Query from "./resolvers/Query";
import Mutation from "./resolvers/Mutation";
import Comment from "./resolvers/Comment";
import Post from "./resolvers/Post";
import User from "./resolvers/User";


// Demo user data

// Type Definitions (also known as app schema, which is what our data types look like)

// Resolvers
// Now we define our resolvers. We only have a singele operation, we are only going to define a single function.
const resolvers = {
  Mutation, Query, Comment, Post, User
};

const server = new GraphQLServer({
  typeDefs: "./src/schema.graphql",
  resolvers,
  context: {
    db
  }
});

server.start(() => {
  console.log("The server is up");
});
