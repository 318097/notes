import React, { useEffect, Fragment } from 'react'
import { connect } from 'react-redux';
import styled from 'styled-components';

import { fetchNotes } from '../store/actions';
import NoteCard from './NoteCard';
import Settings from './Settings';

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
    <Fragment>
      <section className="flex center">
        {
          data.length ?
            data.map(note => <NoteCard key={note.id} note={note} dropdownView={true} />) :
            <EmptyWrapper>
              Empty
          </EmptyWrapper>
        }
      </section>
      <Settings />
    </Fragment>
  )
}

const mapStateToProps = ({ notes, session }) => ({ data: notes, session });

const mapDispatchToProps = ({ fetchNotes });

export default connect(mapStateToProps, mapDispatchToProps)(Notes);
