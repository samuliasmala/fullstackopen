import { useQuery } from 'react-query';
import AnecdoteForm from './components/AnecdoteForm';
import Notification from './components/Notification';
import { getAnecdotes } from './requests';

const App = () => {
  const result = useQuery('anecdotes', getAnecdotes, { retry: 1 });

  const handleVote = (anecdote) => {
    console.log('vote');
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
