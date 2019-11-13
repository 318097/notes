import React, { useEffect } from 'react'
import { connect } from 'react-redux';

import { fetchNotes } from '../store/actions';
import NoteView from './NoteView';

const Notes = ({ fetchNotes, data, session }) => {
  useEffect(() => {
    if (session) fetchNotes();
  }, [session]);

  return (
    <div className="flex notes-wrapper">
      {data.map(note => <NoteView key={note.id} note={note} />)}
    </div>
  )
}

const mapStateToProps = ({ notes, session }) => ({ data: notes, session });

const mapDispatchToProps = ({ fetchNotes });

export default connect(mapStateToProps, mapDispatchToProps)(Notes);
