/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import styled from "styled-components";

import Card from "./Card";
import Controls from "./Controls";

import { getNoteById } from "../../store/actions";
import { copyToClipboard } from "../../utils";
import Icon from "../Icon";

const Wrapper = styled.div`
  max-width: 350px;
  width: 100%;
  height: 70%;
  padding: 0px;
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
  .copy-header-icon {
    position: absolute;
    top: 10px;
    right: 1px;
    z-index: 999;
  }
  .copy-content-icon {
    position: absolute;
    bottom: 20px;
    right: 1px;
    z-index: 999;
  }
  .back-icon {
    position: absolute;
    top: -7px;
    left: -9px;
    z-index: 10;
    padding: 5px;
    border-radius: 30px;
    transition: 1s;
    &:hover {
      color: grey;
      transform: scale(1.2);
    }
  }
`;

const NoteView = ({ dispatch, match, selectedNote, session, history }) => {
  useEffect(() => {
    if (session) dispatch(getNoteById(match.params.id));
  }, [match.params]);

  return (
    <Wrapper>
      <Icon
        label="Back"
        className="back-icon"
        onClick={() => history.push("/home")}
        type="caret-left"
      />
      <Card view="EXPANDED" note={selectedNote} />
      {selectedNote && selectedNote.type === "POST" && (
        <Icon
          label="Copy to clipboard"
          className="copy-header-icon"
          type="copy"
          onClick={() => copyToClipboard(selectedNote.title)}
        />
      )}
      <Icon
        label="Copy to clipboard"
        type="copy"
        className="copy-content-icon"
        onClick={() => copyToClipboard(selectedNote.content)}
      />
      <Controls note={selectedNote} />
    </Wrapper>
  );
};

const mapStateToProps = ({ modalMeta: { selectedNote }, session }) => ({
  selectedNote,
  session
});

export default withRouter(connect(mapStateToProps)(NoteView));
