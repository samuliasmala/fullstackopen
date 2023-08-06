import { useSelector, useDispatch } from 'react-redux';
import { voteAnecdote } from '../reducers/anecdoteReducer';

export const AnecdoteList = () => {
  const anecdotes = useSelector((state) =>
    !state.filter
      ? state.anecdotes
      : state.anecdotes.filter((anecdote) =>
          anecdote.content.includes(state.filter),
        ),
  );

  const dispatch = useDispatch();

  return anecdotes
    .sort((a, b) => b.votes - a.votes)
    .map((anecdote) => (
      <div key={anecdote.id}>
        <div>{anecdote.content}</div>
        <div>
          has {anecdote.votes}
          <button onClick={() => dispatch(voteAnecdote(anecdote.id))}>
            vote
          </button>
        </div>
      </div>
    ));
};
