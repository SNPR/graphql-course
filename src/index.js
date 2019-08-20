import { GraphQLServer } from "graphql-yoga";
import uuidv4 from "uuid/v4";

// Scalar types - String, Boolean, Int, Float, ID

// Demo user data
let users = [
  {
    id: "1",
    name: "First User",
    email: "first@user.com",
    age: 35
  },
  {
    id: "2",
    name: "Second User",
    email: "second@user.com"
  },
  {
    id: "3",
    name: "Third User",
    email: "third@user.com"
  }
];

let posts = [
  {
    id: "1",
    title: "This is my first post",
    body: "It is all about programming",
    published: true,
    author: "1"
  },
  {
    id: "2",
    title: "This is my second post",
    body: "It's about weather'",
    published: false,
    author: "1"
  },
  {
    id: "3",
    title: "This is my third post",
    body: "Hello!",
    published: true,
    author: "2"
  }
];

let comments = [
  {
    id: "1",
    text: "Comment for the first post",
    author: "2",
    post: "1"
  },
  {
    id: "2",
    text: "And this is a comment for the second post",
    author: "3",
    post: "2"
  },
  {
    id: "3",
    text: "For the third post",
    author: "2",
    post: "3"
  },
  {
    id: "4",
    text: "Also comment for the third post",
    author: "1",
    post: "3"
  }
];

// Resolver
const resolvers = {
  Query: {
    users(parent, args, ctx, info) {
      if (!args.query) {
        return users;
      }

      return users.filter(user =>
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
    posts(parent, args, ctx, info) {
      if (!args.query) {
        return posts;
      }

      return posts.filter(post => {
        return (
          post.title.toLowerCase().includes(args.query.toLowerCase()) ||
          post.body.toLowerCase().includes(args.query.toLowerCase())
        );
      });
    },
    comments(parent, args, ctx, info) {
      return comments;
    }
  },
  Mutation: {
    createUser(parent, args, ctx, info) {
      const emailTaken = users.some(user => user.email === args.data.email);

      if (emailTaken) {
        throw new Error("Email taken.");
      }

      const user = {
        id: uuidv4(),
        ...args.data
      };

      users.push(user);

      return user;
    },
    deleteUser(parent, args, ctx, info) {
      const userIndex = users.findIndex(user => user.id === args.id);

      if (userIndex === -1) {
        throw new Error("User not found");
      }

      const deletedUsers = users.splice(userIndex, 1);

      posts = posts.filter(post => {
        const match = post.author === args.id;

        if (match) {
          comments = comments.filter(comment => comment.post !== post.id);
        }

        return !match;
      });

      comments = comments.filter(comment => comment.author !== args.id);

      return deletedUsers[0];
    },
    createPost(parent, args, ctx, info) {
      const userExist = users.some(user => user.id === args.data.author);

      if (!userExist) {
        throw new Error("User not found");
      }

      const post = {
        id: uuidv4(),
        ...args.data
      };

      posts.push(post);

      return post;
    },
    deletePost(parent, args, ctx, info) {
      const postIndex = posts.findIndex(post => post.id === args.id);

      if (postIndex === -1) {
        throw new Error("Post not found");
      }

      const deletedPosts = posts.splice(postIndex, 1);

      comments = comments.filter(comment => comment.post !== args.id);

      return deletedPosts[0];
    },
    createComment(parent, args, ctx, info) {
      const userExist = users.some(user => user.id === args.data.author);
      const postExist = posts.some(
        post => post.id === args.data.post && post.published
      );

      if (!userExist || !postExist) {
        throw new Error("Unable to find user and post");
      }

      const comment = {
        id: uuidv4(),
        ...args.data
      };

      comments.push(comment);

      return comment;
    },
    deleteComment(parent, args, ctx, info) {
      const commentIndex = comments.findIndex(
        comment => comment.id === args.id
      );

      if (commentIndex === -1) {
        throw new Error("Comment not found");
      }

      const deletedComments = comments.splice(commentIndex, 1);

      return deletedComments[0];
    }
  },
  Post: {
    author(parent, args, ctx, info) {
      return users.find(user => user.id === parent.author);
    },
    comments(parent, args, ctx, info) {
      return comments.filter(comment => comment.post === parent.id);
    }
  },
  User: {
    posts(parent, args, ctx, info) {
      return posts.filter(post => post.author === parent.id);
    },
    comments(parent, args, ctx, info) {
      return comments.filter(coment => coment.author === parent.id);
    }
  },
  Comment: {
    author(parent, args, ctx, info) {
      return users.find(user => user.id === parent.author);
    },
    post(parent, args, ctx, info) {
      return posts.find(post => post.id === parent.post);
    }
  }
};

const server = new GraphQLServer({
  typeDefs: "./src/schema.graphql",
  resolvers
});

server.start(() => {
  console.log("The server is up!");
});
