import { GraphQLServer } from "graphql-yoga";
import uuid from "uuid/v4";
import db from "./db";

// Demo user data

// Type Definitions (also known as app schema, which is what our data types look like)

// Resolvers
// Now we define our resolvers. We only have a singele operation, we are only going to define a single function.
const resolvers = {
  Mutation: {
    createUser(parent, args, { db }, info) {
      const emailTaken = db.users.some(user => user.email === args.data.email);
      if (emailTaken) {
        throw new Error("Email has already been taken.");
      }

      const user = {
        id: uuid(),
        ...args.data
      };

      db.users.push(user);
      return user;
    },
    deleteUser(parent, args, { db }, info) {
      const userIndex = db.users.findIndex(user => Number(user.id) === Number(args.id));
      if (userIndex < 0) {
        throw new Error("User not found");
      }

      // First we delete the user
      const deleted = db.users.splice(userIndex, 1);

      db.posts = db.posts.filter(post => {
        const match = Number(post.author) === Number(args.id);
        if (match) {
          db.comments = db.comments.filter(comment => {
            return Number(comment.post) !== Number(post.id);
          });
        }
        return !match;
      });
      db.comments = db.comments.filter(comment => Number(comment.author) !== Number(args.id));

      // We need to remove all associated posts and comments.
      return deleted[0];
    },
    createPost(parent, args, { db }, info) {
      const userExists = db.users.some(user => Number(user.id) === Number(args.data.author));
      if (!userExists) {
        throw new Error("User doesn't exist.");
      }

      const post = {
        id: uuid(),
        title: args.data.title,
        body: args.data.body,
        published: args.data.published,
        author: args.data.author
      };

      db.posts.push(post);
      return post;
    },
    deletePost(parent, args, { db }, info) {
      const postExists = db.posts.findIndex(post => Number(post.id) === Number(args.id));
      if (postExists < 0) {
        throw new Error("Post does not exist");
      }
      const deleted = db.posts.splice(postExists, 1);
      db.comments = db.comments.filter(comment => Number(comment.post) !== Number(args.id));

      return deleted[0];
    },
    createComment(parent, args, { db }, info) {
      const userExists = db.users.some(user => Number(user.id) === Number(args.data.author));

      if (!userExists) {
        throw new Error("User doesn't exist.");
      }

      const postExists = db.posts.some(post => Number(post.id) === Number(args.data.post));
      if (!postExists) {
        throw new Error("Post doesn't exist.");
      }

      const comment = {
        id: uuid(),
        text: args.data.text,
        author: args.data.author,
        post: args.data.post
      };
      db.comments.push(comment);

      return comment;
    }
  },
  Query: {
    age(parent, args) {
      if (args.number) {
        return `I am ${args.number}`;
      }
      return "Unknown age";
    },
    grades(parent, args) {
      return [1, 3, 4];
    },
    add(parent, args) {
      if (args.numbers) {
        return args.numbers.reduce((tot, acc) => {
          return tot + acc;
        }, 0);
      }
      return 0;
    },
    users(parent, args, { db }, info) {
      if (!args.query) {
        return db.users;
      }
      return db.users.filter(user => {
        return db.user.name.toLowerCase().includes(args.query.toLowerCase());
      });
    },
    posts(parent, args, { db }) {
      if (!args.query) {
        return db.posts;
      }
      return db.posts.filter(post => {
        return post.body.toLowerCase().includes(args.query.toLowerCase());
      });
    },
    comments(parent, args, { db }) {
      return db.comments;
    }
  },
  Post: {
    author(parent, args, { db }) {
      return db.users.find(user => {
        return user.id === parent.author;
      });
    },
    comments(parent, args, { db }) {
      return db.comments.filter(comment => {
        return comment.post === parent.id;
      });
    }
  },
  User: {
    posts(parent, args, { db }) {
      return db.posts.filter(post => {
        return post.author === parent.id;
      });
    },
    comments(parent, args, { db }) {
      return db.comments.filter(comment => {
        return comment.author === parent.id;
      });
    }
  },
  Comment: {
    author(parent, args, { db }) {
      return db.users.find(user => {
        return Number(user.id) === Number(parent.author);
      });
    },
    post(parent, args, { db }) {
      return db.posts.find(post => {
        return post.id === parent.post;
      });
    }
  }
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
