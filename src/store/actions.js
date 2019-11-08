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
  dispatch({ type: ADD_NOTE, payload: note });
  dispatch(setAppLoading(false));
};

export const fetchNotes = () => async dispatch => {
  dispatch(setAppLoading(true));
  const querySnapshot = await firestore
    .collection('notes')
    .get()

  const data = [];
  querySnapshot.forEach(doc => data.push({ id: doc.id, ...doc.data() }));

  dispatch({ type: LOAD_NOTES, payload: data })
  dispatch(setAppLoading(false));
};