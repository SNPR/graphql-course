const User = {
  posts(parent, args, { db }, info) {
    return db.posts.filter(post => post.author === parent.id);
  },
  comments(parent, args, { db }, info) {
    return db.comments.filter(coment => coment.author === parent.id);
  }
};

export { User as default };
