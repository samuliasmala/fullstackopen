import { useQuery, useMutation, useQueryClient } from 'react-query';
import AnecdoteForm from './components/AnecdoteForm';
import Notification from './components/Notification';
import { getAnecdotes, updateAnecdote } from './requests';
import { useNotificationDispatch } from './NotificationContext';

const App = () => {
  const dispatch = useNotificationDispatch();
  const queryClient = useQueryClient();
  const result = useQuery('anecdotes', getAnecdotes, { retry: 1 });

  const updateAnecdoteMutation = useMutation(updateAnecdote, {
    onSuccess: () => {
      queryClient.invalidateQueries('anecdotes');
    },
  });

  const handleVote = (anecdote) => {
    updateAnecdoteMutation.mutate({ ...anecdote, votes: anecdote.votes + 1 });
    dispatch({
      type: 'SHOW_NOTIFICATION',
      payload: `anecdote '${anecdote.content}' voted`,
    });
    setTimeout(() => dispatch({ type: 'HIDE_NOTIFICATION' }), 5000);
  };

  if (result.isError)
    return 'anecdote service not available due to problems in server';

  return (
    <div>
      <h3>Anecdote app</h3>

      <Notification />
      <AnecdoteForm />

      {result.isLoading ? (
        <div>loading data...</div>
      ) : (
        result.data.map((anecdote) => (
          <div key={anecdote.id}>
            <div>{anecdote.content}</div>
            <div>
              has {anecdote.votes}
              <button onClick={() => handleVote(anecdote)}>vote</button>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default App;
