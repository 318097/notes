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
  SET_TAGS,
} from "./constants";

export const setSession = (session) => ({
  type: SET_SESSION,
  payload: session,
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
    payload: newSettings,
  });
};

export const setAppLoading = (status) => ({
  type: SET_APP_LOADING,
  payload: status,
});

export const toggleSettingsDrawer = (status) => ({
  type: TOGGLE_SETTINGS_DRAWER,
  payload: status,
});

export const setFilter = (filterUpdate, resetPage = true) => async (
  dispatch,
  getState
) => {
  const { filters } = getState();
  const updatedFiters = { ...filters, ...filterUpdate };
  if (resetPage) updatedFiters["page"] = 1;
  dispatch({ type: UPDATE_FILTER, payload: updatedFiters });
  dispatch(fetchNotes());
};

export const fetchNotes = () => async (dispatch, getState) => {
  try {
    dispatch(setAppLoading(true));
    const { filters, notes = [] } = getState();

    const data = filters && filters.page > 1 ? [...notes] : [];

    const {
      data: { posts, meta },
    } = await axios.get("/posts", { params: filters });
    data.push(...posts);

    dispatch({ type: LOAD_NOTES, payload: { notes: data, meta } });
  } catch (err) {
    console.log(err);
  } finally {
    dispatch(setAppLoading(false));
  }
};

export const getNoteById = (noteId) => async (dispatch, getState) => {
  const { notes } = getState();
  dispatch(setAppLoading(true));

  let viewPost = notes.find((note) => note._id === noteId);

  if (!viewPost) {
    const {
      data: { post },
    } = await axios.get(`/posts/${noteId}`);
    viewPost = post;
  }

  dispatch({ type: GET_NOTE_BY_ID, payload: viewPost });
  dispatch(setAppLoading(false));
};

export const addNote = (note) => async (dispatch, getState) => {
  try {
    dispatch(setAppLoading(true));

    await axios.post(`/posts`, { data: note });

    dispatch({ type: ADD_NOTE, payload: note });
  } finally {
    dispatch(setAppLoading(false));
  }
};

export const setNoteToEdit = (noteId) => ({
  type: SET_NOTE_TO_EDIT,
  payload: noteId,
});

export const updateNote = (note) => async (dispatch, getState) => {
  try {
    dispatch(setAppLoading(true));

    await axios.put(`/posts/${note._id}`, { ...note });

    dispatch({ type: UPDATE_NOTE, payload: note });
  } finally {
    dispatch(setAppLoading(false));
  }
};

export const deleteNote = (noteId) => async (dispatch, getState) => {
  try {
    dispatch(setAppLoading(true));

    await axios.delete(`/posts/${noteId}`);

    dispatch({ type: DELETE_NOTE, payload: noteId });
  } finally {
    dispatch(setAppLoading(false));
  }
};

export const setTags = (tags) => ({ type: SET_TAGS, payload: tags });

export const toggleFavoriteNote = (noteId) => async (dispatch) => {};

export const setModalMeta = ({
  visibility = false,
  finishEditing = false,
  mode = "add",
  selectedNote = null,
} = {}) => ({
  type: SET_MODAL_META,
  payload: { visibility, finishEditing, mode, selectedNote },
});
