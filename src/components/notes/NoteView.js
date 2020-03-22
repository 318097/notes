/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import styled from "styled-components";

import { Tag } from "antd";
import marked from "marked";

import Card from "@bit/ml318097.mui.card";
import Icon from "@bit/ml318097.mui.icon";

import Controls from "./Controls";

import { getNoteById } from "../../store/actions";
import { copyToClipboard } from "../../utils";

const Wrapper = styled.div`
  margin-top: 20px;
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  grid-column-gap: 14px;
  .card {
    height: 78vh;
    padding: 10px 0 10px 5px;
    grid-column: 4/10;
    display: flex;
    flex-direction: column;
    .title {
      text-align: center;
      margin: 10px;
    }
    .content {
      flex: 1 1 auto;
      overflow: auto;
      padding: 20px 10px;
      pre {
        border: 1px solid lightgrey;
        border-radius: 4px;
      }
      code {
        font-size: 1.1rem;
      }
    }
    .back-icon {
      position: absolute;
      background: #484848;
      color: white;
      top: 5px;
      left: 5px;
      z-index: 10;
      padding: 5px;
      border-radius: 30px;
      transition: 1s;
      &:hover {
        background: #484848;
        color: white;
        transform: scale(1.2);
      }
    }
  }
  .controls {
    grid-column: 10/11;
  }
`;

const NoteView = ({ dispatch, match, selectedNote, session, history }) => {
  useEffect(() => {
    if (session) dispatch(getNoteById(match.params.id));
  }, [match.params]);

  if (!selectedNote) return null;

  const { title, content, tags, _id } = selectedNote || {};
  return (
    <Wrapper>
      <Card>
        <h3 className="title">{title}</h3>
        <div
          className="content"
          dangerouslySetInnerHTML={{ __html: marked(content) }}
        ></div>
        <div className="tags">
          {tags.map((tag, index) => (
            <Tag key={index}>{tag.toUpperCase()}</Tag>
          ))}
        </div>
        <Icon
          className="back-icon"
          onClick={() => history.push("/home")}
          type="caret-left"
        />
      </Card>
      {/* {selectedNote && selectedNote.type === "POST" && (
        <Icon
          className="copy-header-icon"
          type="copy"
          onClick={() => copyToClipboard(selectedNote.title)}
        />
      )}
      <Icon
        type="copy"
        className="copy-content-icon"
        onClick={() => copyToClipboard(selectedNote.content)}
      /> */}
      <Controls note={selectedNote} />
    </Wrapper>
  );
};

const mapStateToProps = ({ modalMeta: { selectedNote }, session }) => ({
  selectedNote,
  session
});

export default withRouter(connect(mapStateToProps)(NoteView));
