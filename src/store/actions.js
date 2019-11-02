import { LOAD_NOTES, ADD_NOTE, EDIT_NOTE, DELETE_NOTE } from './constants';

export const addNote = note => ({ type: ADD_NOTE, payload: note });