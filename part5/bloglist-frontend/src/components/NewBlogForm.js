import { useState } from 'react';
import PropTypes from 'prop-types';

export const NewBlogForm = ({ createBlog }) => {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [url, setUrl] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await createBlog({ title, author, url });
      setTitle('');
      setAuthor('');
      setUrl('');
    } catch (err) {
      console.log('Error creating a new blog post');
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

NewBlogForm.propTypes = {
  createBlog: PropTypes.func.isRequired,
};
