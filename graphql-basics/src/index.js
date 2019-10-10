import { GraphQLServer } from "graphql-yoga";
import uuid from "uuid/v4";

// Demo user data
let users = [
  {
    id: 1,
    name: "Nicky",
    email: "nicky@gmail.com",
    age: 28
  },
  {
    id: 2,
    name: "Jane",
    email: "jane@gmail.com"
  },
  {
    id: 3,
    name: "Andrew",
    email: "andrew@gmail.com"
  }
];

let posts = [
  { id: 1, title: "Elephant", body: "Animal", published: false, author: 1 },
  { id: 2, title: "Lion", body: "Jungle Safari", published: true, author: 1 },
  { id: 3, title: "Giraffe", body: "African Safari", published: false, author: 2 }
];

let comments = [
  {
    id: 100,
    text: "That's awesome",
    author: 1,
    post: 1
  },
  {
    id: 200,
    text: "That is great",
    author: 2,
    post: 1
  },
  { id: 300, text: "Wheeeee", author: 1, post: 3 },
  { id: 400, text: "Have a great day.", author: 2, post: 2 }
];

// Type Definitions (also known as app schema, which is what our data types look like)
const typeDefs = `
    type Mutation {        
        createUser(data: CreateUserInput): User!
        deleteUser(id: ID!): User!
        createPost(data: CreatePostInput): Post!
        deletePost(id: ID!): Post!
        createComment(data: CreateCommentInput): Comment!
    }

    input CreateUserInput {
        name: String!
        email: String!
        age: Int
    }

    input CreatePostInput {
      title: String!
      body: String!
      published: Boolean!
      author: ID!
    }

    input CreateCommentInput {
      text: String!
      author: ID!
      post: ID!
    }

    type Query {
        grades: [Int!]!
        add(numbers: [Int!]): Int!
        users(query: String): [User!]!
        posts(query: String): [Post!]!
        comments: [Comment!]!
    }
    type User {
        id: ID!
        name: String!
        email: String!
        age: Int
        posts: [Post!]!
        comments: [Comment!]!
    }
    type Post {
        id: ID!
        title: String!
        body: String!
        published: Boolean!
        author: User!
        comments: [Comment]
    }
    type Comment {
        id: ID!
        text: String!
        author: User!
        post: Post!
    }
`;

// Resolvers
// Now we define our resolvers. We only have a singele operation, we are only going to define a single function.
const resolvers = {
  Mutation: {
    createUser(parent, args, context, info) {
      const emailTaken = users.some(user => user.email === args.data.email);
      if (emailTaken) {
        throw new Error("Email has already been taken.");
      }

      const user = {
        id: uuid(),
        ...args.data
      };

      users.push(user);
      return user;
    },
    deleteUser(parent, args, context, info) {
      const userIndex = users.findIndex(user => Number(user.id) === Number(args.id));
      if (userIndex < 0) {
        throw new Error("User not found");
      }

      // First we delete the user
      const deleted = users.splice(userIndex, 1);

      posts = posts.filter(post => {
        const match = Number(post.author) === Number(args.id);
        if (match) {
          comments = comments.filter(comment => {
            return Number(comment.post) !== Number(post.id);
          });
        }
        return !match;
      });
      comments = comments.filter(comment => Number(comment.author) !== Number(args.id));

      // We need to remove all associated posts and comments.
      return deleted[0];
    },
    createPost(parent, args, context, info) {
      const userExists = users.some(user => Number(user.id) === Number(args.data.author));
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

      posts.push(post);
      return post;
    },
    createComment(parent, args, context, info) {
      const userExists = users.some(user => Number(user.id) === Number(args.data.author));

      if (!userExists) {
        throw new Error("User doesn't exist.");
      }

      const postExists = posts.some(post => Number(post.id) === Number(args.data.post));
      if (!postExists) {
        throw new Error("Post doesn't exist.");
      }

      const comment = {
        id: uuid(),
        text: args.data.text,
        author: args.data.author,
        post: args.data.post
      };
      comments.push(comment);

      return comment;
    }
  },
  Query: {
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
    users(parent, args) {
      if (!args.query) {
        return users;
      }
      return users.filter(user => {
        return user.name.toLowerCase().includes(args.query.toLowerCase());
      });
    },
    posts(parent, args) {
      if (!args.query) {
        return posts;
      }
      return posts.filter(post => {
        return post.body.toLowerCase().includes(args.query.toLowerCase());
      });
    },
    comments(parent, args) {
      return comments;
    }
  },
  Post: {
    author(parent, args) {
      return users.find(user => {
        return user.id === parent.author;
      });
    },
    comments(parent, args) {
      return comments.filter(comment => {
        return comment.post === parent.id;
      });
    }
  },
  User: {
    posts(parent, args) {
      return posts.filter(post => {
        return post.author === parent.id;
      });
    },
    comments(parent, args) {
      return comments.filter(comment => {
        return comment.author === parent.id;
      });
    }
  },
  Comment: {
    author(parent, args) {
      console.log("parent: ", parent);
      console.log("users", users);
      return users.find(user => {
        return Number(user.id) === Number(parent.author);
      });
    },
    post(parent, args) {
      return posts.find(post => {
        return post.id === parent.post;
      });
    }
  }
};

const server = new GraphQLServer({
  typeDefs,
  resolvers
});

server.start(() => {
  console.log("The server is up");
});
