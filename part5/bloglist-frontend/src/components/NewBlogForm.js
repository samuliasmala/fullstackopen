import { useState } from 'react';
import blogService from '../services/blogs';

export const NewBlogForm = ({ setBlogs, setVisible, displayNotification }) => {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [url, setUrl] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const blog = await blogService.create({
        title,
        author,
        url,
      });
      // Returned blog object doesn't contain user information -> reload all blogs
      const blogs = await blogService.getAll();
      setBlogs(blogs);
      setTitle('');
      setAuthor('');
      setUrl('');
      setVisible(false);
      displayNotification(`a new blog ${blog.title} by ${blog.author} added`);
    } catch (exception) {
      console.log('Error creating a new blog post');
      displayNotification('error creating a new blog post', 'error');
    }
  };

  return (
    <div>
      <h2>create a new blog</h2>
      <form onSubmit={handleSubmit}>
        <div>
          title
          <input
            type="text"
            value={title}
            name="Title"
            onChange={({ target }) => setTitle(target.value)}
          />
        </div>
        <div>
          author
          <input
            type="text"
            value={author}
            name="Author"
            onChange={({ target }) => setAuthor(target.value)}
          />
        </div>
        <div>
          url
          <input
            type="text"
            value={url}
            name="Url"
            onChange={({ target }) => setUrl(target.value)}
          />
        </div>
        <button type="submit">create</button>
      </form>
    </div>
  );
};
