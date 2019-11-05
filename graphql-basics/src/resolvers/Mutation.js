import uuidv4 from 'uuid/v4'

const Mutation = {
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
    updateUser(parent, args, { db }, info) {
        const user = db.users.find(user => user.id === Number(args.id));
        if (!user) {
            throw new Error("User not found");
        }

        if (typeof args.data.email === "string") {
            const emailTaken = db.users.some(user => user.email === args.data.email);

            if (emailTaken) {
                throw new Error("Email has already been taken");
            }

            user.email = args.data.email;

        }

        if (typeof args.data.name === "string") {
            user.name = args.data.name;
        }

        if (typeof args.data.age !== "undefined") {
            user.age = args.data.age;
        }
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
    updatePost(parent, args, { db }, info) {
      const post = db.posts.find(post => post.id === Number(args.id));
      if (!post) {
        throw new Error ("Post could not be found");
      }

      if (args.data.body) {
        post.body = args.data.body;
      }

      if (args.data.title) {
        post.title = args.data.title;
      }

      if (args.data.published) {
        post.published = args.data.published;
      }

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
    },
    updateComment(parent, args, { db }, info) {
      const comment = db.comments.find(comment => comment.id === (Number(args.id)));
      if (!comment) {
        throw new Error("No comment exists");
      }

      if (args.text) {
        comment.text = args.text;
      }

      return comment;
    }
  }

  export { Mutation as default };