import { useState } from 'react';
import PropTypes from 'prop-types';

const Blog = ({ blog, increaseLikes, isOwnBlog, deleteBlog }) => {
  const [isOpen, setIsOpen] = useState(false);

  const blogStyle = {
    paddingTop: 10,
    paddingBottom: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5,
  };

  const deleteBtnStyle = { backgroundColor: 'red', color: 'white' };

  return (
    <div style={blogStyle}>
      <div>
        {blog.title} {blog.author}{' '}
        {isOpen ? (
          <>
            <button onClick={() => setIsOpen(false)}>hide</button>
            <div>{blog.url}</div>
            <div>
              likes {blog.likes}{' '}
              <button onClick={() => increaseLikes(blog)}>like</button>
            </div>
            <div>{blog.user?.name}</div>
            {isOwnBlog && (
              <button style={deleteBtnStyle} onClick={() => deleteBlog(blog)}>
                delete
              </button>
            )}
          </>
        ) : (
          <button onClick={() => setIsOpen(true)}>view</button>
        )}
      </div>
    </div>
  );
};

Blog.propTypes = {
  blog: PropTypes.object.isRequired,
  increaseLikes: PropTypes.func.isRequired,
  isOwnBlog: PropTypes.bool.isRequired,
  deleteBlog: PropTypes.func.isRequired,
};

export default Blog;
