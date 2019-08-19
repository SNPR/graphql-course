import { GraphQLServer } from "graphql-yoga";
import uuidv4 from "uuid/v4";
import { AddArgumentsAsVariables } from "graphql-tools";

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

// Type defenitions (schema)
const typeDefs = `
    type Query {
      users(query: String): [User!]!
      me: User!
      post: Post!
      posts(query: String): [Post!]!
      comments: [Comment!]!
    }

    type Mutation {
      createUser(data: CreateUserInput!): User!
      deleteUser(id: ID!): User!
      createPost(data: CreatePostInput!): Post!
      createComment(data: CreateCommentInput!): Comment!
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
      published: Boolean
      author: User!
      comments: [Comment!]!
    }

    type Comment {
      id: ID!
      text: String!
      author: User!
      post: Post!
    }
`;

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
  typeDefs,
  resolvers
});

server.start(() => {
  console.log("The server is up!");
});
