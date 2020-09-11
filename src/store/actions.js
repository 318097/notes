import axios from "axios";
import moment from "moment";
import _ from "lodash";

import { getNextNote, generateNewResourceId } from "../utils";
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
  SET_UPLOADING_DATA,
  UPDATE_UPLOAD_NOTE,
  SET_ACTIVE_COLLECTION,
  TOGGLE_STATS_MODAL,
  FETCH_STATS,
} from "./constants";

export const setSession = (session) => ({
  type: SET_SESSION,
  payload: session,
});

export const setActiveCollection = (id) => async (dispatch, getState) => {
  await dispatch({
    type: SET_ACTIVE_COLLECTION,
    payload: id,
  });
  await dispatch(setFilter());
};

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

export const toggleStatsModal = (status) => ({
  type: TOGGLE_STATS_MODAL,
  payload: status,
});

export const fetchStats = () => async (dispatch) => {
  try {
    dispatch(setAppLoading(true));
    const {
      data: { stats },
    } = await axios.get("/posts/stats");

    dispatch({ type: FETCH_STATS, payload: stats });
  } catch (err) {
    console.log(err);
  } finally {
    dispatch(setAppLoading(false));
  }
};

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
    const { filters, notes = [], activeCollection } = getState();

    const data = filters && filters.page > 1 ? [...notes] : [];

    const {
      data: { posts, meta },
    } = await axios.get(`/posts?collectionId=${activeCollection}`, {
      params: filters,
    });
    data.push(...posts);

    dispatch({ type: LOAD_NOTES, payload: { notes: data, meta } });
  } catch (err) {
    console.log(err);
  } finally {
    dispatch(setAppLoading(false));
  }
};

export const getNoteById = (noteId) => async (dispatch, getState) => {
  const { notes, activeCollection } = getState();
  dispatch(setAppLoading(true));

  let viewPost = notes.find((note) => note._id === noteId);

  if (!viewPost) {
    const {
      data: { post },
    } = await axios.get(`/posts/${noteId}?collectionId=${activeCollection}`);
    viewPost = post;
  }

  dispatch({ type: GET_NOTE_BY_ID, payload: viewPost });
  dispatch(setAppLoading(false));
};

export const addNote = (note) => async (dispatch, getState) => {
  try {
    dispatch(setAppLoading(true));
    const { activeCollection, settings } = getState();

    const resources = [generateNewResourceId(note, settings.index)];
    const { data } = await axios.post(
      `/posts?collectionId=${note.collection || activeCollection}`,
      { data: { ...note, resources } }
    );
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
    const { activeCollection, settings } = getState();
    if (action === "CREATE_RESOURCE") {
      const resourceId = generateNewResourceId(note, settings.index);
      await axios.put(
        `/posts/${note._id}?action=${action}&value=${resourceId}`,
        {}
      );

      if (!note["resources"]) note["resources"] = [];
      note["resources"].push(resourceId);
    } else {
      const {
        data: { result },
      } = await axios.put(
        `/posts/${note._id}?collectionId=${activeCollection}`,
        {
          ...note,
        }
      );
      note = { ...result };
    }

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
    nextNote = getNextNote({ data: notes, id: currentNote._id });
    await dispatch(updateNote({ ...currentNote }));
  } else {
    nextNote = getNextNote({
      data: uploadingNotes,
      id: currentNote.tempId,
      matchKey: "tempId",
    });
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
