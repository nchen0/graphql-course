const Query = {
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
  }

  export { Query as default };