/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import styled from "styled-components";
import { Tag } from "antd";
import marked from "marked";
import colors, { Card, Icon } from "@codedrops/react-ui";
import Controls from "./Controls";
import { getNoteById } from "../../store/actions";
import { copyToClipboard } from "../../utils";
import { fadeInDownAnimation } from "../../animations";

const Wrapper = styled.div`
  margin-top: 20px;
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  column-gap: 8px;
  .card {
    overflow-x: hidden;
    animation: 0.4s ${fadeInDownAnimation};
    height: 78vh;
    width: 100%;
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
    }
    .back-icon {
      position: absolute;
      background: ${colors.bar};
      color: white;
      top: 5px;
      left: 5px;
      z-index: 10;
      padding: 5px;
      border-radius: 30px;
      transition: 1s;
      &:hover {
        background: ${colors.bar};
        color: white;
        transform: scale(1.2);
      }
    }
    .copy-icon {
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      right: -10px;
      transition: 0.3s;
      &:hover {
        right: -4px;
      }
    }
  }
  .controls {
    grid-column: 10/11;
  }
`;

const NoteView = ({ dispatch, match, viewNote, session, history }) => {
  useEffect(() => {
    if (session) dispatch(getNoteById(match.params.id));
  }, [match.params]);

  if (!viewNote) return null;

  const { title, content, tags, type } = viewNote || {};
  return (
    <Wrapper>
      <Card>
        <div className="relative">
          <h3 className="title">{title}</h3>
          {type === "POST" && (
            <Icon
              className="copy-icon"
              type="copy"
              onClick={() => copyToClipboard(title)}
            />
          )}
        </div>
        <div className="relative">
          <div
            className="content"
            dangerouslySetInnerHTML={{ __html: marked(content) }}
          ></div>
          <Icon
            type="copy"
            className="copy-icon"
            onClick={() => copyToClipboard(content)}
          />
        </div>
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
      <Controls note={viewNote} />
    </Wrapper>
  );
};

const mapStateToProps = ({ viewNote, session }) => ({
  viewNote,
  session,
});

export default withRouter(connect(mapStateToProps)(NoteView));
