import React, { useEffect } from 'react'
import { connect } from 'react-redux';

import { fetchNotes } from '../store/actions';
import NoteView from './NoteView';

const Notes = ({ fetchNotes, data, auth }) => {
  useEffect(() => {
    if (auth) fetchNotes();
  }, [auth]);

  return (
    <div className="flex notes-wrapper">
      {data.map(note => <NoteView key={note.id} note={note} />)}
    </div>
  )
}

const mapStateToProps = ({ notes, auth }) => ({ data: notes, auth });

const mapDispatchToProps = ({ fetchNotes });

export default connect(mapStateToProps, mapDispatchToProps)(Notes);
