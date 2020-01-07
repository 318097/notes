/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import styled from "styled-components";

import Card from "./Card";
import Controls from "./Controls";

import { getNoteById } from "../../store/actions";

const Wrapper = styled.div`
  max-width: 400px;
  width: 100%;
  height: 80%;
  padding: 30px 20px;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  .card {
    .title {
      margin: 10px;
    }
    .content {
      overflow: auto;
    }
  }
`;

const NoteView = ({ dispatch, match, selectedNote, session }) => {
  useEffect(() => {
    if (session) dispatch(getNoteById(match.params.id));
  }, [match.params]);

  return (
    <Wrapper>
      <Card view="EXPANDED" note={selectedNote} />
      <Controls note={selectedNote} />
    </Wrapper>
  );
};

const mapStateToProps = ({ selectedNote, session }) => ({
  selectedNote,
  session
});

export default withRouter(connect(mapStateToProps)(NoteView));
