import _ from "lodash";
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
  SET_TAGS,
  SET_UPLOADING_DATA,
  UPDATE_UPLOAD_NOTE,
  SET_ACTIVE_COLLECTION,
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
    limit: 25,
  },
  activeCollection: null,
  notes: [],
  meta: null,
  session: null,
  settings: {},
  tags: [],
  viewNote: null,
  uploadingData: {
    rawData: null,
    data: [],
    dataType: "POST",
    shouldProcessData: true,
    fileName: null,
  },
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_SESSION:
      const { activeCollection, session } = state;
      const updatedSession = { ...(session || {}), ...action.payload };

      const currentSettingKey =
        activeCollection ||
        Object.keys(_.get("updatedSession", "notesApp", {}))[0] ||
        "";

      const settings = currentSettingKey
        ? _.get(action, ["payload.notesApp", currentSettingKey], {})
        : {};

      return {
        ...state,
        session: updatedSession,
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
      return {
        ...state,
        notes: [...state.notes, action.payload],
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
    case SET_TAGS:
      return {
        ...state,
        tags: action.payload,
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
    default:
      return state;
  }
};

export default reducer;
