import { firestore } from '../firebase';
import { SET_APP_LOADING, LOAD_NOTES, ADD_NOTE, EDIT_NOTE, DELETE_NOTE } from './constants';

export const setAppLoading = status => ({
  type: SET_APP_LOADING,
  payload: status
});

export const addNote = note => async dispatch => {
  dispatch(setAppLoading(true));
  const result = await firestore
    .collection('notes')
    .add({ ...note })
  console.log('Result', result);
  // dispatch(setAppLoading(false));
  dispatch({ type: ADD_NOTE, payload: note });
};