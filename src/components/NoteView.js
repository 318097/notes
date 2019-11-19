import React, { useEffect } from 'react'
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';

import NoteCard from './NoteCard';
import { getNoteById } from '../store/actions';

const NoteView = ({ dispatch, match, selectedNote, session }) => {

  useEffect(() => {
    if (session) dispatch(getNoteById(match.params.id));
  }, [session]);

  return <NoteCard view="EXPANDED" note={selectedNote} />
}

const mapStateToProps = ({ selectedNote, session }) => ({ selectedNote, session });

export default withRouter(connect(mapStateToProps)(NoteView));
