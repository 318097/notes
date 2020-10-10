import _ from "lodash";
import config from "../config";
import {
  SET_SESSION,
  SET_SETTINGS,
  SET_APP_LOADING,
  TOGGLE_SETTINGS_DRAWER,
  UPDATE_FILTER,
  LOAD_NOTES,
  GET_NOTE_BY_ID,
  ADD_NOTE,
  SET_NOTE_TO_EDIT,
  SET_MODAL_META,
  UPDATE_NOTE,
  DELETE_NOTE,
  SET_UPLOADING_DATA,
  UPDATE_UPLOAD_NOTE,
  SET_ACTIVE_COLLECTION,
  TOGGLE_STATS_MODAL,
  FETCH_STATS,
  LOGOUT,
  SET_QUICK_ADD_MODAL_META,
} from "./constants";

const initialState = {
  appLoading: false,
  modalMeta: {
    visibility: false,
    mode: undefined,
    selectedNote: null,
  },
  filters: {
    search: "",
    status: undefined,
    socialStatus: undefined,
    page: 1,
    limit: config.LIMIT,
    sortOrder: "ASC",
    visibility: "visible",
  },
  activeCollection: null,
  notes: [],
  meta: null,
  session: null,
  settings: {},
  viewNote: null,
  settingsDrawerVisibility: false,
  stats: {},
  statsModal: false,
  uploadingData: {
    rawData: null,
    data: [],
    dataType: "POST",
    shouldProcessData: true,
    fileName: null,
  },
  quickaddModalMeta: {
    visibility: false,
  },
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_SESSION:
      const { activeCollection, session } = state;
      const updatedSession = { ...(session || {}), ...action.payload };
      const currentSettingKey =
        activeCollection ||
        Object.keys(_.get(updatedSession, "notesApp", {}))[0] ||
        "";

      const settings = currentSettingKey
        ? _.get(updatedSession, ["notesApp", currentSettingKey], {})
        : {};

      return {
        ...state,
        session: updatedSession,
        activeCollection: currentSettingKey,
        settings,
      };
    case SET_SETTINGS:
      return {
        ...state,
        settings: action.payload,
      };
    case SET_APP_LOADING:
      return {
        ...state,
        appLoading: action.payload,
      };
    case LOGOUT:
      sessionStorage.clear();
      localStorage.clear();
      return {
        ...state,
        session: null,
      };
    case SET_ACTIVE_COLLECTION:
      return {
        ...state,
        activeCollection: action.payload,
      };
    case TOGGLE_SETTINGS_DRAWER:
      return {
        ...state,
        settingsDrawerVisibility: action.payload,
      };
    case TOGGLE_STATS_MODAL:
      return {
        ...state,
        statsModal: action.payload,
      };
    case FETCH_STATS:
      return {
        ...state,
        stats: action.payload,
      };
    case UPDATE_FILTER:
      return {
        ...state,
        filters: action.payload,
      };
    case LOAD_NOTES:
      return {
        ...state,
        notes: [...action.payload.notes],
        meta: action.payload.meta,
      };
    case GET_NOTE_BY_ID:
      return {
        ...state,
        viewNote: action.payload,
      };
    case ADD_NOTE:
      const { notes, resourceIndex } = action.payload;
      return {
        ...state,
        notes: [...notes, ...state.notes],
        settings: { ...state.settings, index: resourceIndex },
      };
    case SET_NOTE_TO_EDIT: {
      const { selectedNote, mode } = action.payload;
      return {
        ...state,
        modalMeta: {
          ...state.modalMeta,
          mode,
          visibility: true,
          selectedNote,
        },
      };
    }
    case SET_MODAL_META:
      return {
        ...state,
        modalMeta: {
          ...state.modalMeta,
          ...action.payload,
        },
      };

    case UPDATE_NOTE: {
      return {
        ...state,
        viewNote: state.viewNote
          ? { ...state.viewNote, ...action.payload }
          : null,
        notes: state.notes.map((note) => {
          if (note._id === action.payload._id)
            return { ...note, ...action.payload };
          return note;
        }),
      };
    }
    case DELETE_NOTE:
      return {
        ...state,
        notes: state.notes.filter((note) => note._id !== action.payload),
      };
    case SET_UPLOADING_DATA:
      return {
        ...state,
        uploadingData: { ...state.uploadingData, ...action.payload },
      };
    case UPDATE_UPLOAD_NOTE: {
      const {
        uploadingData: { data },
      } = state;
      const { payload: selectedNote } = action;
      const updatedData = data.map((item) =>
        item.tempId === selectedNote.tempId ? selectedNote : item
      );
      return {
        ...state,
        uploadingData: {
          ...state.uploadingData,
          data: updatedData,
          shouldProcessData: false,
        },
      };
    }
    case SET_QUICK_ADD_MODAL_META:
      return {
        ...state,
        quickAddModalMeta: {
          ...state.quickAddModalMeta,
          ...action.payload,
        },
      };
    default:
      return state;
  }
};

export default reducer;
