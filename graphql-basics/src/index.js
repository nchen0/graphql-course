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
  { id: 1, title: "Elephant", body: "Animal", published: false, author: 1 },
  { id: 2, title: "Lion", body: "Jungle Safari", published: true, author: 1 },
  { id: 3, title: "Giraffe", body: "African Safari", published: false, author: 2 }
];

const comments = [
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
      return users.find(user => {
        return user.id === parent.author;
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
