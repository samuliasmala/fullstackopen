const totalLikes = (blogs) =>
  blogs.reduce((likes, blog) => likes + blog.likes, 0);

const favoriteBlog = (blogs) => {
  if (blogs.length === 0) return null;
  const blogWithMaxLikes = blogs.find(
    (blog) => blog.likes === Math.max(...blogs.map((blog) => blog.likes))
  );
  return blogWithMaxLikes;
};

module.exports = {
  favoriteBlog,
  totalLikes,
};
