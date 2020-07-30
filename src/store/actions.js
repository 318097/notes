import axios from "axios";
import moment from "moment";
import _ from "lodash";

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
  SET_UPLOADING_DATA,
  UPDATE_UPLOAD_NOTE,
} from "./constants";

const getNextNote = (data, id, matchKey = "_id") => {
  const currentNoteIndex = data.findIndex((note) => note[matchKey] === id);
  return data[currentNoteIndex + 1];
};

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
  const {
    filters,
    session: { retainPage },
  } = getState();
  if (retainPage)
    return dispatch({ type: SET_SESSION, payload: { retainPage: false } });

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

    const { data } = await axios.post(`/posts`, { data: note });
    dispatch({ type: ADD_NOTE, payload: _.get(data, "result.0") });
  } finally {
    dispatch(setAppLoading(false));
  }
};

export const setNoteToEdit = (noteId, mode = "edit") => async (
  dispatch,
  getState
) => {
  const {
    notes = [],
    uploadingData: { data: uploadingNotes = [] } = {},
  } = getState();
  const data = mode === "edit" ? notes : uploadingNotes;
  const selectedNote = data.find((note) => note._id === noteId);
  dispatch({
    type: SET_NOTE_TO_EDIT,
    payload: { selectedNote, mode },
  });
};

export const updateNote = (note, action) => async (dispatch, getState) => {
  try {
    dispatch(setAppLoading(true));

    if (action === "CREATE_RESOURCE") {
      const resourceId = `${note.slug}-${moment().format("DD_MM_YYYY")}-${
        _.get(note, "resources.length", 0) + 1
      }`;
      await axios.put(
        `/posts/${note._id}?action=${action}&value=${resourceId}`,
        {}
      );

      if (!note["resources"]) note["resources"] = [];

      note["resources"].push(resourceId);
    } else await axios.put(`/posts/${note._id}`, { ...note });

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
  mode = "add",
  selectedNote = null,
} = {}) => ({
  type: SET_MODAL_META,
  payload: { visibility, mode, selectedNote },
});

export const setUploadingData = (uploadingContent) => ({
  type: SET_UPLOADING_DATA,
  payload: uploadingContent,
});

export const updateUploadNote = (note) => async (dispatch, getState) => {
  dispatch({ type: UPDATE_UPLOAD_NOTE, payload: note });
};

export const setNextNoteForEditing = (currentNote) => async (
  dispatch,
  getState
) => {
  const {
    notes = [],
    modalMeta: { mode },
    uploadingData: { data: uploadingNotes = [] } = {},
  } = getState();

  let nextNote;
  if (mode === "edit") {
    nextNote = getNextNote(notes, currentNote._id);
    await dispatch(updateNote({ ...currentNote }));
  } else {
    nextNote = getNextNote(uploadingNotes, currentNote.tempId, "tempId");
    await dispatch(updateUploadNote({ ...currentNote }));
  }
  dispatch(
    setModalMeta({
      selectedNote: nextNote,
      mode,
      visibility: !!nextNote,
    })
  );
};
