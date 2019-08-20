const Query = {
  users(parent, args, { db }, info) {
    if (!args.query) {
      return db.users;
    }

    return db.users.filter(user =>
      user.name.toLowerCase().includes(args.query.toLowerCase())
    );
  },
  me() {
    return {
      id: "qwesdfna",
      name: "SNPR",
      email: "qwe@weqw.eq"
    };
  },
  post() {
    return {
      id: "dsfgsdg",
      title: "This is my first post",
      body: "It is all about programming languages",
      published: true
    };
  },
  posts(parent, args, { db }, info) {
    if (!args.query) {
      return db.posts;
    }

    return db.posts.filter(post => {
      return (
        post.title.toLowerCase().includes(args.query.toLowerCase()) ||
        post.body.toLowerCase().includes(args.query.toLowerCase())
      );
    });
  },
  comments(parent, args, { db }, info) {
    return db.comments;
  }
};

export { Query as default };
