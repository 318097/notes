import { SET_APP_LOADING, SET_ADD_NOTE_MODAL_VISIBILITY, LOAD_NOTES, ADD_NOTE, EDIT_NOTE, DELETE_NOTE } from './constants';

const initialState = {
  notes: [],
  appLoading: false,
  addNoteModalVisibility: false,
  selectedNote: null,
  mode: 'add'
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
        addNoteModalVisibility: action.payload
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
      return {
        ...state,
        mode: 'edit',
        addNoteModalVisibility: true,
        selectedNote: state.notes.find(note => note.id === action.payload)
      };
    }
    default:
      return state;
  }
}

export default reducer;