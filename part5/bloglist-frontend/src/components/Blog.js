import { useState } from 'react';

const Blog = ({ blog }) => {
  const [isOpen, setIsOpen] = useState(false);

  const blogStyle = {
    paddingTop: 10,
    paddingBottom: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5,
  };

  return (
    <div style={blogStyle}>
      <div>
        {blog.title} {blog.author}{' '}
        {isOpen ? (
          <>
            <button onClick={() => setIsOpen(false)}>hide</button>
            <div>{blog.url}</div>
            <div>
              likes {blog.likes} <button>like</button>
            </div>
            <div>{blog.user?.name}</div>
          </>
        ) : (
          <button onClick={() => setIsOpen(true)}>view</button>
        )}
      </div>
    </div>
  );
};

export default Blog;
