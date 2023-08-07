import { createSlice } from '@reduxjs/toolkit';
import { createNew, getAll, update } from '../services/anecdotes';

const anecdoteSlice = createSlice({
  name: 'anecdote',
  initialState: [],
  reducers: {
    setAnecdote(state, action) {
      return state.map((anecdote) =>
        anecdote.id === action.payload.id ? action.payload : anecdote,
      );
    },
    addAnecdote(state, action) {
      return state.concat(action.payload);
    },
    setAnecdotes(state, action) {
      return action.payload;
    },
  },
});

export const { setAnecdote, addAnecdote, setAnecdotes } = anecdoteSlice.actions;

export const initializeAnecdotes = () => {
  return async (dispatch) => {
    const anecdotes = await getAll();
    dispatch(setAnecdotes(anecdotes));
  };
};

export const createAnecdote = (content) => {
  return async (dispatch) => {
    const newAnecdote = await createNew(content);
    dispatch(addAnecdote(newAnecdote));
  };
};

export const voteAnecdote = (id) => {
  return async (dispatch, getState) => {
    const anecdoteToVote = {
      ...getState().anecdotes.find((anecdote) => anecdote.id === id),
    };
    anecdoteToVote.votes++;
    const newAnecdote = await update(anecdoteToVote);
    dispatch(setAnecdote(newAnecdote));
  };
};

export default anecdoteSlice.reducer;
