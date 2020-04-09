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
} from "./constants";

const initialState = {
  appLoading: false,
  modalMeta: {
    visibility: false,
    finishEditing: false,
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
  notes: [],
  meta: null,
  session: null,
  settings: {},
  tags: [],
  viewNote: null,
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_SESSION: {
      return {
        ...state,
        session: { ...state.session, ...action.payload },
      };
    }
    case SET_SETTINGS: {
      return {
        ...state,
        settings: action.payload,
      };
    }
    case SET_APP_LOADING: {
      return {
        ...state,
        appLoading: action.payload,
      };
    }
    case TOGGLE_SETTINGS_DRAWER: {
      return {
        ...state,
        settingsDrawerVisibility: action.payload,
      };
    }
    case UPDATE_FILTER: {
      return {
        ...state,
        filters: action.payload,
      };
    }
    case LOAD_NOTES: {
      return {
        ...state,
        notes: [...action.payload.notes],
        meta: action.payload.meta,
      };
    }
    case GET_NOTE_BY_ID: {
      return {
        ...state,
        viewNote: action.payload,
      };
    }
    case ADD_NOTE: {
      return {
        ...state,
        notes: [...state.notes, action.payload],
      };
    }
    case SET_NOTE_TO_EDIT: {
      const selectedNote = state.notes.find(
        (note) => note._id === action.payload
      );
      return {
        ...state,
        modalMeta: {
          ...state.modalMeta,
          mode: "edit",
          visibility: true,
          selectedNote,
        },
      };
    }
    case SET_MODAL_META: {
      return {
        ...state,
        modalMeta: {
          ...state.modalMeta,
          ...action.payload,
        },
      };
    }
    case UPDATE_NOTE: {
      const { selectedNote } = state.modalMeta;
      return {
        ...state,
        modalMeta: {
          ...state.modalMeta,
          mode: undefined,
          selectedNote: selectedNote
            ? { ...selectedNote, ...action.payload }
            : null,
        },
        notes: state.notes.map((note) => {
          if (note._id === action.payload._id)
            return { ...note, ...action.payload };
          return note;
        }),
      };
    }
    case DELETE_NOTE: {
      return {
        ...state,
        notes: state.notes.filter((note) => note._id !== action.payload),
      };
    }
    case SET_TAGS: {
      return {
        ...state,
        tags: action.payload,
      };
    }
    default:
      return state;
  }
};

export default reducer;
