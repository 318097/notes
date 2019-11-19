// import data from './data';

import { firestore } from '../firebase';
import {
  SET_SESSION,
  SET_APP_LOADING,
  SET_ADD_NOTE_MODAL_VISIBILITY,
  LOAD_NOTES,
  GET_NOTE_BY_ID,
  ADD_NOTE,
  EDIT_NOTE,
  UPDATE_NOTE,
  DELETE_NOTE,
  TOGGLE_SETTINGS_DRAWER,
} from './constants';

export const setSession = session => ({
  type: SET_SESSION,
  payload: session
});

export const setAppLoading = status => ({
  type: SET_APP_LOADING,
  payload: status
});

export const setAddNoteModalVisibility = (status, mode) => ({
  type: SET_ADD_NOTE_MODAL_VISIBILITY,
  payload: { status, mode }
});

export const toggleSettingsDrawer = status => ({
  type: TOGGLE_SETTINGS_DRAWER,
  payload: status
});

export const fetchNotes = () => async (dispatch, getState) => {
  const { session: { uid } } = getState();
  dispatch(setAppLoading(true));
  const querySnapshot = await firestore
    .collection('notes')
    .where("userId", "==", uid)
    .get()

  const data = [];
  querySnapshot.forEach(doc => data.push({ id: doc.id, ...doc.data() }));

  dispatch({ type: LOAD_NOTES, payload: data })
  dispatch(setAppLoading(false));
};

export const getNoteById = noteId => async (dispatch, getState) => {
  // const { session: { uid } } = getState();
  dispatch(setAppLoading(true));
  const querySnapshot = await firestore
    .collection('notes')
    .doc(noteId)
    .get()

  const data = {
    ...querySnapshot.data(),
    id: querySnapshot.id
  };

  dispatch({ type: GET_NOTE_BY_ID, payload: data })
  dispatch(setAppLoading(false));
};

export const addNote = note => async dispatch => {
  dispatch(setAppLoading(true));
  const result = await firestore
    .collection('notes')
    .add({ ...note, createdAt: new Date().toISOString() })
  console.log('Result', result);
  dispatch({ type: ADD_NOTE, payload: note });
  dispatch(setAppLoading(false));
};

export const editNote = id => ({
  type: EDIT_NOTE,
  payload: id
});

export const updateNote = note => async dispatch => {
  dispatch(setAppLoading(true));
  const result = await firestore
    .collection('notes')
    .doc(note.id)
    .set({ ...note })
  console.log('Result', result);
  dispatch({ type: UPDATE_NOTE, payload: note });
  dispatch(setAppLoading(false));
};

export const deleteNote = id => async dispatch => {
  dispatch(setAppLoading(true));
  await firestore
    .collection('notes')
    .doc(id)
    .delete();
  dispatch({ type: DELETE_NOTE, payload: id });
  dispatch(setAppLoading(false));
};

export const toggleFavoriteNote = id => async dispatch => { };
