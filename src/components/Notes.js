import React, { useEffect } from 'react'
import { connect } from 'react-redux';
import styled from 'styled-components';

import { fetchNotes } from '../store/actions';
import NoteView from './NoteView';

const EmptyWrapper = styled.div`
  font-size: 40px;
  text-align: center;
  color: lightgrey;
  font-weight: bold;
  text-transform: uppercase;
`

const Notes = ({ fetchNotes, data, session }) => {
  useEffect(() => {
    if (session) fetchNotes();
  }, [session]);

  return (
    <div className="flex notes-wrapper">
      {
        data.length ?
          data.map(note => <NoteView key={note.id} note={note} />) :
          <EmptyWrapper>
            Empty
          </EmptyWrapper>
      }
    </div>
  )
}

const mapStateToProps = ({ notes, session }) => ({ data: notes, session });

const mapDispatchToProps = ({ fetchNotes });

export default connect(mapStateToProps, mapDispatchToProps)(Notes);
