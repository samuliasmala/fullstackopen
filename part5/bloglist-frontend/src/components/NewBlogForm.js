import { useState } from 'react';
import blogService from '../services/blogs';
import { useNotification } from './Notification';

export const NewBlogForm = ({ setBlogs }) => {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [url, setUrl] = useState('');
  const { displayNotification, Notification } = useNotification();

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const blog = await blogService.create({
        title,
        author,
        url,
      });
      setBlogs((blogs) => [...blogs, blog]);
      setTitle('');
      setAuthor('');
      setUrl('');
      displayNotification(`a new blog ${blog.title} by ${blog.author} added`);
    } catch (exception) {
      console.log('Error creating a new blog post');
      displayNotification('error creating a new blog post', 'error');
    }
  };

  return (
    <div>
      <h2>create a new blog</h2>
      <Notification />
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
