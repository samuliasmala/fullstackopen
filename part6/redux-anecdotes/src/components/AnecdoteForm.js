import { useDispatch } from 'react-redux';
import { addAnecdote } from '../reducers/anecdoteReducer';
import { setNotification } from '../reducers/notificationReducer';
import { createNew } from '../services/anecdotes';

export const AnecdoteForm = () => {
  const dispatch = useDispatch();

  const handleSubmit = async (event) => {
    event.preventDefault();
    const content = event.target.anecdote.value;
    if (content === '') return;
    const newAnecdote = await createNew(content);
    dispatch(addAnecdote(newAnecdote));
    event.target.anecdote.value = '';
    dispatch(setNotification(`you added '${content}'`));
    setTimeout(() => dispatch(setNotification('')), 5000);
  };

  return (
    <>
      <h2>create new</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <input name="anecdote" />
        </div>
        <button type="submit">create</button>
      </form>
    </>
  );
};
