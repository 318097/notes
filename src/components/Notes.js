import React, { useEffect } from 'react'
import { connect } from 'react-redux';

import { fetchNotes } from '../store/actions';
import NoteView from './NoteView';

const Notes = ({ fetchNotes, data }) => {
  useEffect(() => {
    fetchNotes();
  }, []);

  return (
    <div className="flex">
      {data.map(note => <NoteView key={note.id} note={note} />)}
    </div>
  )
}

const mapStateToProps = state => ({ data: state.notes });

const mapDispatchToProps = ({ fetchNotes });

export default connect(mapStateToProps, mapDispatchToProps)(Notes);
