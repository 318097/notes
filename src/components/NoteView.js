import React, { useEffect } from 'react'
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import styled from 'styled-components';

import NoteCard from './NoteCard';
import { getNoteById } from '../store/actions';

const Wrapper = styled.div`
width: 45vw;
height: 60vh;
padding: 30px 20px;
position: absolute;
top: 50%;
left: 50%;
transform: translate(-50%, -50%);
`

const NoteView = ({ dispatch, match, selectedNote, session }) => {

  useEffect(() => {
    if (session) dispatch(getNoteById(match.params.id));
  }, [session]);

  return <Wrapper><NoteCard view="EXPANDED" note={selectedNote} /></Wrapper>;
}

const mapStateToProps = ({ selectedNote, session }) => ({ selectedNote, session });

export default withRouter(connect(mapStateToProps)(NoteView));
