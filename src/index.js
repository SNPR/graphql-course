import { GraphQLServer } from "graphql-yoga";

// Scalar types - String, Boolean, Int, Float, ID

// Demo user data
const users = [
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

const posts = [
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

const comments = [
  {
    id: "1",
    text: "Comment for the first post"
  },
  {
    id: "2",
    text: "And this is a comment for the second post"
  },
  {
    id: "3",
    text: "For the third post"
  },
  {
    id: "4",
    text: "For the fourth post"
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

    type User {
      id: ID!
      name: String!
      email: String!
      age: Int
      posts: [Post!]!
    }

    type Post {
      id: ID!
      title: String!
      body: String!
      published: Boolean
      author: User!
    }

    type Comment {
      id: ID!
      text: String!
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
  Post: {
    author(parent, args, ctx, info) {
      return users.find(user => user.id === parent.author);
    }
  },
  User: {
    posts(parent, args, ctx, info) {
      return posts.filter(post => post.author === parent.id);
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
