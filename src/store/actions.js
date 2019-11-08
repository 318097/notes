import { firestore } from '../firebase';
import { LOAD_NOTES, ADD_NOTE, EDIT_NOTE, DELETE_NOTE } from './constants';

export const addNote = note => async dispatch => {
  const result = await firestore
    .collection('notes')
    .add({ ...note })
  console.log('Result', result);
  dispatch({ type: ADD_NOTE, payload: note });
};