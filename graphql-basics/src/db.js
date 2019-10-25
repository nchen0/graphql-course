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

const db = {
  users,
  posts,
  comments
};

export default db;
