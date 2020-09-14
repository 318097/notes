/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import styled from "styled-components";
import { Tag } from "antd";
import marked from "marked";
import _ from "lodash";
import colors, { Card, Icon } from "@codedrops/react-ui";
import Controls from "./Controls";
import { getNoteById, setModalMeta, setSession } from "../../store/actions";
import { copyToClipboard } from "../../utils";
import { fadeInDownAnimation } from "../../animations";
import { getNextNote } from "../../utils";

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
    padding: 30px 0;
    grid-column: 4/10;
    display: flex;
    background: white;
    border-radius: 15px;
    flex-direction: column;
    .title {
      text-align: center;
      font-size: 2.2rem;
      padding: 20px;
      text-decoration: overline;
    }
    .content {
      flex: 1 1 auto;
      overflow: auto;
      padding: 20px;
    }
    .tags {
      padding: 0 20px;
    }
    .quiz-solution {
      background: ${colors.bg};
      border: 1px solid ${colors.strokeTwo};
      margin: 0 20px 20px;
      padding: 10px 0;
      text-align: center;
      border-radius: 4px;
    }
    .back-icon {
      position: absolute;
      top: 5px;
      left: 5px;
      z-index: 10;
    }
    .edit-icon {
      position: absolute;
      right: 5px;
      bottom: 5px;
    }
    .copy-icon {
      position: absolute;
      top: 10px;
      right: -10px;
      transition: 0.3s;
      &:hover {
        right: -4px;
      }
    }
    .index {
      position: absolute;
      top: 12px;
      right: 16px;
      font-style: italic;
      color: ${colors.bar};
    }
    .canonical-url {
      position: absolute;
      bottom: 8px;
      left: 20px;
      font-size: 1.2rem;
      max-width: 80%;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
      cursor: pointer;
      transition: all 0.4s;
      &:hover {
        color: ${colors.orchid};
      }
    }
  }
  .controls {
    grid-column: 10/11;
  }
  .previous-icon,
  .next-icon {
    grid-column: 3;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .prev,
  .next {
    color: ${colors.strokeTwo};
  }
  .next-icon {
    grid-column: 11;
    .next {
      transform: rotate(180deg);
    }
  }
`;

const NoteView = ({ dispatch, match, viewNote, history, notes }) => {
  useEffect(() => {
    dispatch(getNoteById(match.params.id));
  }, [match.params.id]);

  useEffect(() => {
    // const codeblocks = document.querySelectorAll("pre");
    // codeblocks.forEach((block) => {
    //   block.addEventListener("click", (e) => {
    //     const code = e.target.textContent;
    //     if (!code) return;
    //     copyToClipboard(code);
    //   });
    // });
  }, []);

  const handleEdit = () =>
    dispatch(
      setModalMeta({
        selectedNote: viewNote,
        mode: "edit",
        visibility: true,
      })
    );

  const goBack = () => history.push("/home");

  const navigateNote = (newIndex) => {
    const newNote = getNextNote({
      data: notes,
      id: viewNote._id,
      increment: newIndex,
    });
    if (!_.isEmpty(newNote)) history.push(`/note/${newNote._id}`);
  };

  if (!viewNote) return null;

  const { title, content, tags, index, type, solution, slug } = viewNote || {};

  const canonicalURL = `https://www.codedrops.tech/posts/${slug}`;

  return (
    <Wrapper>
      <div className="previous-icon">
        <Icon
          size={40}
          className="prev"
          onClick={() => navigateNote(-1)}
          type="caret-left"
        />
      </div>
      <Card>
        <div className="relative">
          <h3 className="title">{title}</h3>
          {title && (
            <Icon
              className="copy-icon  icon"
              type="copy"
              onClick={() => copyToClipboard(title)}
            />
          )}
        </div>
        <div style={{ flex: "1" }} className="relative">
          <div
            className="content"
            dangerouslySetInnerHTML={{ __html: marked(content) }}
          ></div>
          <Icon
            type="copy"
            className="copy-icon  icon"
            onClick={() => copyToClipboard(content)}
          />
        </div>
        {type === "QUIZ" && solution && (
          <div className="quiz-solution">{solution}</div>
        )}
        <div className="tags">
          {tags.map((tag, index) => (
            <Tag key={index}>{tag.toUpperCase()}</Tag>
          ))}
        </div>

        <Icon className="back-icon icon" onClick={goBack} type="caret-left" />
        <Icon
          size={12}
          onClick={handleEdit}
          className="edit-icon icon"
          type="edit"
        />
        {!!index && <span className="index">{`#${index}`}</span>}
        <div
          className="canonical-url"
          onClick={() => copyToClipboard(canonicalURL)}
        >
          {canonicalURL}
        </div>
      </Card>
      <Controls note={viewNote} />
      <div className="next-icon">
        <Icon
          size={40}
          className="next"
          onClick={() => navigateNote(1)}
          type="caret-left"
        />
      </div>
    </Wrapper>
  );
};

const mapStateToProps = ({ viewNote, notes }) => ({
  notes,
  viewNote,
});

export default withRouter(connect(mapStateToProps)(NoteView));
