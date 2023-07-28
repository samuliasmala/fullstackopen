import { useState, useEffect } from 'react';
import Blog from './components/Blog';
import blogService from './services/blogs';
import { LoginForm } from './components/LoginForm';
import { NewBlogForm } from './components/NewBlogForm';
import { Togglable } from './components/Togglable';
import { useNotification } from './components/Notification';

const App = () => {
  const [blogs, setBlogs] = useState([]);
  const [user, setUser] = useState(null);
  const [showNewBlogForm, setShowNewBlogForm] = useState(false);
  const { displayNotification, Notification } = useNotification();

  useEffect(() => {
    blogService.getAll().then((blogs) => setBlogs(blogs));
  }, []);

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser');
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      setUser(user);
      blogService.setToken(user.token);
    }
  }, []);

  const handleLogout = (event) => {
    window.localStorage.removeItem('loggedBlogappUser');
    setUser(null);
  };

  const increaseLikes = async (blog) => {
    // Update backend
    const updatedBlog = await blogService.update({
      ...blog,
      user: blog.user._id,
      likes: blog.likes + 1,
    });

    // Update frontend
    setBlogs((blogs) =>
      blogs.map((b) =>
        b.id === updatedBlog.id ? { ...b, likes: updatedBlog.likes } : b,
      ),
    );
  };

  if (user === null) return <LoginForm setUser={setUser} />;

  return (
    <div>
      <h2>blogs</h2>
      <Notification />
      <p>
        {user.name} logged in <button onClick={handleLogout}>logout</button>
      </p>
      <Togglable
        visible={showNewBlogForm}
        setVisible={setShowNewBlogForm}
        buttonLabel="add blog"
      >
        <NewBlogForm
          setBlogs={setBlogs}
          setVisible={setShowNewBlogForm}
          displayNotification={displayNotification}
        />
      </Togglable>

      {blogs
        .sort((a, b) => b.likes - a.likes)
        .map((blog) => (
          <Blog key={blog.id} blog={blog} increaseLikes={increaseLikes} />
        ))}
    </div>
  );
};

export default App;
