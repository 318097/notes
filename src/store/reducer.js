import {
  SET_SESSION,
  SET_SETTINGS,
  SET_APP_LOADING,
  SET_ADD_NOTE_MODAL_VISIBILITY,
  TOGGLE_SETTINGS_DRAWER,
  UPDATE_FILTER,
  LOAD_NOTES,
  GET_NOTE_BY_ID,
  ADD_NOTE,
  EDIT_NOTE,
  SET_EDIT_NOTE,
  SET_UPLOAD_NOTE_STATUS,
  UPDATE_NOTE,
  DELETE_NOTE,
  SET_TAGS
} from "./constants";

const initialState = {
  appLoading: false,
  addNoteModalVisibility: false,
  filters: {
    search: "",
    status: "ALL",
    page: 1
  },
  notes: [],
  meta: null,
  selectedNote: null,
  uploadNoteStatus: false,
  mode: undefined,
  session: null,
  settings: {},
  tags: []
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_SESSION: {
      return {
        ...state,
        session: action.payload,
        notes: action.payload ? state.notes : []
      };
    }
    case SET_SETTINGS: {
      return {
        ...state,
        settings: action.payload
      };
    }
    case SET_APP_LOADING: {
      return {
        ...state,
        appLoading: action.payload
      };
    }
    case SET_ADD_NOTE_MODAL_VISIBILITY: {
      return {
        ...state,
        addNoteModalVisibility: action.payload.status,
        mode: action.payload.mode
      };
    }
    case TOGGLE_SETTINGS_DRAWER: {
      return {
        ...state,
        settingsDrawerVisibility: action.payload
      };
    }
    case UPDATE_FILTER: {
      return {
        ...state,
        filters: action.payload
      };
    }
    case LOAD_NOTES: {
      return {
        ...state,
        notes: [...action.payload.notes],
        meta: action.payload.meta
      };
    }
    case GET_NOTE_BY_ID: {
      return {
        ...state,
        selectedNote: action.payload
      };
    }
    case ADD_NOTE: {
      return {
        ...state,
        notes: [...state.notes, action.payload]
      };
    }
    case EDIT_NOTE: {
      const selectedNote = state.notes.find(
        note => note._id === action.payload
      );
      return {
        ...state,
        mode: "edit",
        addNoteModalVisibility: true,
        selectedNote
      };
    }
    case SET_EDIT_NOTE: {
      return {
        ...state,
        mode: "edit-upload",
        addNoteModalVisibility: true,
        selectedNote: action.payload,
        uploadNoteStatus: false
      };
    }
    case SET_UPLOAD_NOTE_STATUS: {
      return {
        ...state,
        uploadNoteStatus: action.payload
      };
    }
    case UPDATE_NOTE: {
      return {
        ...state,
        mode: undefined,
        selectedNote: null,
        notes: state.notes.map(note => {
          if (note._id === action.payload._id)
            return { ...note, ...action.payload };
          return note;
        })
      };
    }
    case DELETE_NOTE: {
      return {
        ...state,
        notes: state.notes.filter(note => note._id !== action.payload)
      };
    }
    case SET_TAGS: {
      return {
        ...state,
        tags: action.payload
      };
    }
    default:
      return state;
  }
};

export default reducer;
