import { createSlice } from '@reduxjs/toolkit';

const notificationSlice = createSlice({
  name: 'notification',
  initialState: '',
  reducers: {
    showNotification(state, action) {
      return action.payload;
    },
    clearNotification(state, action) {
      return '';
    },
  },
});

export const { showNotification, clearNotification } =
  notificationSlice.actions;

export const setNotification = (message, delayInS) => {
  return async (dispatch) => {
    dispatch(showNotification(message));
    setTimeout(() => dispatch(clearNotification()), delayInS * 1000);
  };
};
export default notificationSlice.reducer;
