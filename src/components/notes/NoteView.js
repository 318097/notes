/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import styled from "styled-components";
import { Tag } from "antd";
import marked from "marked";
import colors, { Card, Icon } from "@codedrops/react-ui";
import Controls from "./Controls";
import { getNoteById, setModalMeta, setSession } from "../../store/actions";
import { copyToClipboard } from "../../utils";
import { fadeInDownAnimation } from "../../animations";

const Wrapper = styled.div`
  margin-top: 20px;
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  column-gap: 8px;
  .card {
    overflow-x: hidden;
    animation: 0.2s ${fadeInDownAnimation};
    height: 78vh;
    width: 100%;
    padding: 10px 0 10px 5px;
    grid-column: 4/10;
    display: flex;
    background: white;
    border-radius: 15px;
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
      top: 5px;
      left: 5px;
      z-index: 10;
      padding: 5px;
      border-radius: 30px;
      transition: 0.4s;
      &:hover {
        background: ${colors.strokeOne};
      }
    }
    .edit-icon {
      position: absolute;
      right: 5px;
      bottom: 5px;
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
    .index {
      position: absolute;
      top: 4px;
      right: 10px;
      font-style: italic;
      color: ${colors.bar};
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

  useEffect(() => {
    const codeblocks = document.querySelectorAll("pre");
    codeblocks.forEach((block) => {
      block.addEventListener("click", (e) => {
        const code = e.target.textContent;
        if (!code) return;
        copyToClipboard(code);
      });
    });
  }, []);

  const handleEdit = () =>
    dispatch(
      setModalMeta({
        selectedNote: viewNote,
        mode: "edit",
        visibility: true,
      })
    );

  const goBack = () => {
    history.push("/home");
    dispatch(setSession({ retainPage: true }));
  };

  if (!viewNote) return null;

  const { title, content, tags, type, index } = viewNote || {};
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
        <Icon className="back-icon" onClick={goBack} type="caret-left" />
        <Icon
          size={12}
          onClick={handleEdit}
          className="edit-icon"
          type="edit"
        />
        {!!index && <span className="index">{`#${index}`}</span>}
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
