import {
  SET_SESSION,
  SET_APP_LOADING,
  SET_ADD_NOTE_MODAL_VISIBILITY,
  TOGGLE_SETTINGS_DRAWER,
  LOAD_NOTES,
  GET_NOTE_BY_ID,
  ADD_NOTE,
  EDIT_NOTE,
  SET_EDIT_NOTE,
  SET_UPLOAD_NOTE_STATUS,
  UPDATE_NOTE,
  DELETE_NOTE
} from "./constants";

const initialState = {
  notes: [],
  appLoading: false,
  addNoteModalVisibility: false,
  selectedNote: null,
  uploadNoteStatus: false,
  mode: undefined,
  session: null,
  settings: {
    tags: []
  }
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
    case LOAD_NOTES: {
      return {
        ...state,
        notes: [...action.payload]
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
      const selectedNote = state.notes.find(note => note.id === action.payload);
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
          if (note.id === action.payload.id) return { ...action.payload };
          return note;
        })
      };
    }
    case DELETE_NOTE: {
      return {
        ...state,
        notes: state.notes.filter(note => note.id !== action.payload)
      };
    }
    default:
      return state;
  }
};

export default reducer;
