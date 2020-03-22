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
  max-width: 450px;
  width: 95%;
  height: 80%;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  .card {
    height: 100%;
    padding: 10px 0 10px 5px;
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
        code {
          font-size: 0.7rem;
        }
      }
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
      </Card>
      <Icon
        className="back-icon"
        onClick={() => history.push("/home")}
        type="caret-left"
      />
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
