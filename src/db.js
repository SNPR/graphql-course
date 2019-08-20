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

const db = {
  users,
  posts,
  comments
};

export { db as default };
