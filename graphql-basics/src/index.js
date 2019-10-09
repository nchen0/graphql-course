import { GraphQLServer } from "graphql-yoga";

// Demo user data
const users = [
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

const posts = [
  { id: 1, title: "Elephant", body: "Animal", published: false },
  { id: 2, title: "Lion", body: "Jungle Safari", published: true },
  { id: 3, title: "Giraffe", body: "African Safari", published: false }
];

// Type Definitions (also known as app schema, which is what our data types look like)
const typeDefs = `
    type Query {
        grades: [Int!]!
        add(numbers: [Int!]): Int!
        users(query: String): [User!]!
        posts(query: String): [Post!]!
    }
    type User {
        id: ID!
        name: String!
        email: String!
        age: Int
    }
    type Post {
        id: ID!
        title: String!
        body: String!
        published: Boolean!
    }
`;

// Resolvers
// Now we define our resolvers. We only have a singele operation, we are only going to define a single function.
const resolvers = {
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
