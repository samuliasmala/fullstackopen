const { countBy } = require('lodash');

const totalLikes = (blogs) =>
  blogs.reduce((likes, blog) => likes + blog.likes, 0);

const favoriteBlog = (blogs) => {
  if (blogs.length === 0) return null;
  const blogWithMaxLikes = blogs.find(
    (blog) => blog.likes === Math.max(...blogs.map((blog) => blog.likes))
  );
  return blogWithMaxLikes;
};

const mostBlogs = (blogs) => {
  if (blogs.length === 0) return null;
  const blogsByAuthor = countBy(blogs, (blog) => blog.author);
  const maxBlogsWritten = Math.max(...Object.values(blogsByAuthor));
  for (const [author, blogs] of Object.entries(blogsByAuthor)) {
    if (blogs === maxBlogsWritten) return { author, blogs };
  }
  return null;
};

module.exports = {
  favoriteBlog,
  totalLikes,
  mostBlogs,
};
