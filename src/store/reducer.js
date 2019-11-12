import { SET_APP_LOADING, SET_ADD_NOTE_MODAL_VISIBILITY, LOAD_NOTES, ADD_NOTE, EDIT_NOTE, UPDATE_NOTE, DELETE_NOTE } from './constants';

const initialState = {
  notes: [],
  appLoading: false,
  addNoteModalVisibility: false,
  selectedNote: null,
  mode: undefined
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
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
    case LOAD_NOTES: {
      return {
        ...state,
        notes: [...action.payload]
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
        mode: 'edit',
        addNoteModalVisibility: true,
        selectedNote
      };
    }
    case UPDATE_NOTE: {
      return {
        ...state,
        mode: undefined,
        selectedNote: null,
        notes: state.notes.map(note => {
          if (note.id === action.payload.id)
            return { ...action.payload };
          return note;
        })
      };
    }
    default:
      return state;
  }
}

export default reducer;