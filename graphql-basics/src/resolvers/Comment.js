const Comment = {
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

export { Comment as default };