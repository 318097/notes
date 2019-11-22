import React, { useEffect, Fragment } from 'react'
import { connect } from 'react-redux';

import { fetchNotes } from '../store/actions';
import NoteCard from './NoteCard';
import Settings from './Settings';

import { MessageWrapper } from '../styled';

const Notes = ({ fetchNotes, data, session, appLoading }) => {
  useEffect(() => {
    if (session) fetchNotes();
  }, [session]);

  const NoData = () => !appLoading && <MessageWrapper> Empty</MessageWrapper>;

  return (
    <Fragment>
      <section className="flex center">
        {
          data.length ?
            data.map(note => <NoteCard key={note.id} note={note} dropdownView={true} />) :
            <NoData />
        }
      </section>
      <Settings />
    </Fragment>
  )
}

const mapStateToProps = ({ notes, session, appLoading }) => ({ data: notes, session, appLoading });

const mapDispatchToProps = ({ fetchNotes });

export default connect(mapStateToProps, mapDispatchToProps)(Notes);
