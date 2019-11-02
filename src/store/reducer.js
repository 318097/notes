import { LOAD_NOTES, ADD_NOTE, EDIT_NOTE, DELETE_NOTE } from './constants';

const initialState = {
  notes: []
};

const notesReducer = (state = initialState, action) => {
  switch (action.type) {
    case ADD_NOTE: {
      return {
        ...state,
        notes: [...state.notes, action.payload]
      }
    }
    default:
      return state;
  }
}

export default notesReducer;