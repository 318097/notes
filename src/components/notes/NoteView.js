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

const ControlsWrapper = styled.div`
  width: 200px;
  padding: 15px 5px;
  position: absolute;
  right: -190px;
  top: 30px;
  background: white;
  border-radius: 5px;
  border: 1px solid lightgrey;
  box-shadow: 3px 3px 3px lightgrey;
  .hashtag {
    margin: 1px;
    padding: 2px;
    background: #fbfbfb;
    display: inline-block;
  }
`;

const NoteView = ({ dispatch, match, selectedNote, session }) => {
  useEffect(() => {
    if (session) dispatch(getNoteById(match.params.id));
  }, [session, dispatch, match]);

  return (
    <Wrapper>
      <Card view="EXPANDED" note={selectedNote} />
      <ControlsWrapper>
        <Controls note={selectedNote} />
      </ControlsWrapper>
    </Wrapper>
  );
};

const mapStateToProps = ({ selectedNote, session }) => ({
  selectedNote,
  session
});

export default withRouter(connect(mapStateToProps)(NoteView));
