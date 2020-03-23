import axios from "axios";

import {
  SET_SESSION,
  SET_SETTINGS,
  SET_APP_LOADING,
  UPDATE_FILTER,
  LOAD_NOTES,
  GET_NOTE_BY_ID,
  ADD_NOTE,
  SET_NOTE_TO_EDIT,
  SET_MODAL_META,
  UPDATE_NOTE,
  DELETE_NOTE,
  TOGGLE_SETTINGS_DRAWER,
  SET_TAGS
} from "./constants";

export const setSession = session => ({
  type: SET_SESSION,
  payload: session
});

export const setSettings = (updatedSettings, updateOnServer = false) => async (
  dispatch,
  getState
) => {
  const { settings = {}, session } = getState();

  if (updateOnServer)
    await axios.put(`/users/${session.userId}/settings`, updatedSettings);

  const newSettings = { ...settings, ...updatedSettings };

  dispatch({
    type: SET_SETTINGS,
    payload: newSettings
  });
};

export const setAppLoading = status => ({
  type: SET_APP_LOADING,
  payload: status
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

export const fetchNotes = (filters = {}) => async (dispatch, getState) => {
  try {
    const {
      session: { uid, storage },
      notes = []
    } = getState();
    dispatch(setAppLoading(true));
    const data = filters && filters.page > 1 ? [...notes] : [];
    let metaInfo;

    const {
      data: { posts, meta }
    } = await axios.get("/posts", { params: filters });
    data.push(...posts);
    metaInfo = meta;

    dispatch({ type: LOAD_NOTES, payload: { notes: data, meta: metaInfo } });
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

  const {
    data: { post }
  } = await axios.get(`/posts/${noteId}`);
  data = { ...post };

  dispatch({ type: GET_NOTE_BY_ID, payload: data });
  dispatch(setAppLoading(false));
};

export const addNote = note => async (dispatch, getState) => {
  try {
    const {
      session: { storage }
    } = getState();

    dispatch(setAppLoading(true));

    await axios.post(`/posts`, { data: note });

    dispatch({ type: ADD_NOTE, payload: note });
  } finally {
    dispatch(setAppLoading(false));
  }
};

export const setNoteToEdit = noteId => ({
  type: SET_NOTE_TO_EDIT,
  payload: noteId
});

export const updateNote = note => async (dispatch, getState) => {
  try {
    const {
      session: { storage }
    } = getState();
    dispatch(setAppLoading(true));

    await axios.put(`/posts/${note._id}`, { ...note });

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

    await axios.delete(`/posts/${noteId}`);

    dispatch({ type: DELETE_NOTE, payload: noteId });
  } finally {
    dispatch(setAppLoading(false));
  }
};

export const setTags = tags => ({ type: SET_TAGS, payload: tags });

export const toggleFavoriteNote = noteId => async dispatch => {};

export const setModalMeta = ({
  visibility = false,
  finishEditing = false,
  mode = "add",
  selectedNote = null
} = {}) => ({
  type: SET_MODAL_META,
  payload: { visibility, finishEditing, mode, selectedNote }
});
