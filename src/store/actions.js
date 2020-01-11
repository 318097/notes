// import data from './data';
import axios from "axios";

import { firestore } from "../firebase";
import {
  SET_SESSION,
  SET_SETTINGS,
  SET_APP_LOADING,
  SET_ADD_NOTE_MODAL_VISIBILITY,
  UPDATE_FILTER,
  LOAD_NOTES,
  GET_NOTE_BY_ID,
  ADD_NOTE,
  EDIT_NOTE,
  SET_EDIT_NOTE,
  SET_UPLOAD_NOTE_STATUS,
  UPDATE_NOTE,
  DELETE_NOTE,
  TOGGLE_SETTINGS_DRAWER,
  SET_TAGS
} from "./constants";

export const setSession = session => ({
  type: SET_SESSION,
  payload: session
});

export const setSettings = updatedSettings => async (dispatch, getState) => {
  const {
    settings = {},
    session: { uid }
  } = getState();

  const newSettings = { ...settings, ...updatedSettings };

  await firestore
    .collection("users")
    .doc(uid)
    .set({ settings: newSettings }, { merge: true });

  dispatch({
    type: SET_SETTINGS,
    payload: newSettings
  });
};

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

export const setFilter = filterUpdate => async (dispatch, getState) => {
  const { filters } = getState();

  const updatedFiters = { ...filters, ...filterUpdate };

  dispatch({ type: UPDATE_FILTER, payload: updatedFiters });
  dispatch(fetchNotes(updatedFiters));
};

export const fetchNotes = filters => async (dispatch, getState) => {
  try {
    const {
      session: { uid, storage },
      notes = []
    } = getState();
    dispatch(setAppLoading(true));
    const data = filters && filters.page > 1 ? [...notes] : [];

    if (storage === "FIREBASE") {
      const querySnapshot = await firestore
        .collection("notes")
        // .where("userId", "==", uid)
        .get();

      querySnapshot.forEach(doc => data.push({ ...doc.data(), _id: doc.id }));
    } else {
      const {
        data: { posts, meta }
      } = await axios.get("/posts", { params: filters });
      data.push(...posts);
    }

    dispatch({ type: LOAD_NOTES, payload: data });
  } catch (err) {
    console.log(err);
  } finally {
    dispatch(setAppLoading(false));
  }
};

export const getNoteById = noteId => async (dispatch, getState) => {
  const {
    session: { uid, storage }
  } = getState();

  dispatch(setAppLoading(true));
  let data = {};
  if (storage === "FIREBASE") {
    const querySnapshot = await firestore
      .collection("notes")
      .doc(noteId)
      .get();

    data = {
      ...querySnapshot.data(),
      _id: querySnapshot.id
    };
  } else {
    const {
      data: { post }
    } = await axios.get(`/posts/${noteId}`);
    data = { ...post };
  }

  dispatch({ type: GET_NOTE_BY_ID, payload: data });
  dispatch(setAppLoading(false));
};

export const addNote = note => async (dispatch, getState) => {
  try {
    const {
      session: { storage }
    } = getState();

    dispatch(setAppLoading(true));

    if (storage === "FIREBASE") {
      const result = await firestore
        .collection("notes")
        .add({ ...note, createdAt: new Date().toISOString() });
      console.log("Result", result);
    } else {
      await axios.post(`/posts`, { data: note });
    }

    dispatch({ type: ADD_NOTE, payload: note });
  } finally {
    dispatch(setAppLoading(false));
  }
};

export const editNote = noteId => ({
  type: EDIT_NOTE,
  payload: noteId
});

export const setNoteToEdit = note => ({
  type: SET_EDIT_NOTE,
  payload: note
});

export const setUploadNoteStatus = () => ({
  type: SET_UPLOAD_NOTE_STATUS,
  payload: true
});

export const updateNote = note => async (dispatch, getState) => {
  try {
    const {
      session: { storage }
    } = getState();
    dispatch(setAppLoading(true));

    if (storage === "FIREBASE") {
      const result = await firestore
        .collection("notes")
        .doc(note._id)
        .set({ ...note });
      console.log("Result", result);
    } else {
      await axios.put(`/posts/${note._id}`, { ...note });
    }

    dispatch({ type: UPDATE_NOTE, payload: note });
  } finally {
    dispatch(setAppLoading(false));
  }
};

export const deleteNote = noteId => async (dispatch, getState) => {
  try {
    const {
      session: { storage }
    } = getState();
    dispatch(setAppLoading(true));

    if (storage === "FIREBASE") {
      await firestore
        .collection("notes")
        .doc(noteId)
        .delete();
    } else {
      await axios.delete(`/posts/${noteId}`);
    }

    dispatch({ type: DELETE_NOTE, payload: noteId });
  } finally {
    dispatch(setAppLoading(false));
  }
};

export const setTags = tags => ({ type: SET_TAGS, payload: tags });

export const toggleFavoriteNote = noteId => async dispatch => {};
