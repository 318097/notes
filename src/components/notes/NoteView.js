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
import { getNoteById, setModalMeta } from "../../store/actions";
import { copyToClipboard } from "../../utils";
import { fadeInDownAnimation } from "../../animations";
import { getNextNote } from "../../utils";
import queryString from "query-string";

const Wrapper = styled.div`
  margin-top: 20px;
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  column-gap: 8px;
  .controls.left {
    grid-column: 3/4;
  }
  .card {
    overflow: hidden;
    animation: 0.2s ${fadeInDownAnimation};
    height: 78vh;
    width: 100%;
    padding: 30px 0;
    grid-column: 4/10;
    display: flex;
    background: white;
    border-radius: 15px;
    flex-direction: column;
    .card-content {
      overflow-y: auto;
      overflow-x: hidden;
    }
    .title {
      text-align: center;
      font-size: 2rem;
      padding: 20px;
      color: ${colors.steel};
    }
    .content {
      flex: 1 1 auto;
      overflow: auto;
      padding: 20px;
    }
    .chain-wrapper {
      padding: 0 20px;
      .chain-item {
        display: flex;
        align-items: center;
        margin-bottom: 10px;
        .chain-item-id {
          background: ${colors.strokeOne};
          border-radius: 50%;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 25px;
          height: 25px;
          font-size: 1.2rem;
          margin-right: 4px;
          cursor: pointer;
          transition: 0.4s;
          margin-right: 10px;
          &:hover {
            background: ${colors.strokeTwo};
          }
        }
        .chain-item-title {
          cursor: pointer;
          &:hover {
            text-decoration: underline;
          }
        }
      }
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
      right: 8px;
      bottom: 6px;
    }
    .copy-icon {
      position: absolute;
      top: 10px;
      left: -10px;
      transition: 0.3s;
      &:hover {
        left: -4px;
      }
    }
    .index {
      position: absolute;
      top: 8px;
      right: 16px;
      color: ${colors.strokeTwo};
      font-size: 1rem;
    }
    .canonical-url {
      position: absolute;
      bottom: 8px;
      left: 20px;
      font-size: 0.9rem;
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
  .controls.right {
    grid-column: 10/11;
  }
  .previous-icon,
  .next-icon {
    grid-column: 2;
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

const NoteView = ({
  dispatch,
  match,
  viewNote,
  history,
  notes,
  chains,
  location,
}) => {
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

  const goBack = () => {
    const parsed = queryString.parse(location.search);
    history.push(parsed.src ? `/note/${parsed.src}` : "/home");
  };

  const navigateNote = (newPosition) => {
    const newNote = getNextNote({
      data: notes,
      id: viewNote._id,
      increment: newPosition,
    });
    if (!_.isEmpty(newNote)) history.push(`/note/${newNote._id}`);
  };

  const goToPost = (id, src) => history.push(`/note/${id}?src=${src}`);

  if (_.isEmpty(viewNote)) return null;

  const {
    title,
    content = "",
    tags,
    index,
    type,
    solution,
    slug,
    status,
    chainedPosts = [],
    _id,
  } = viewNote || {};

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
      <Controls
        note={viewNote}
        view="left"
        chains={chains}
        goToPost={goToPost}
      />
      <Card>
        <div className="card-content">
          <div className="relative">
            <h3 className="title">{title}</h3>
            {title && (
              <Icon
                className="copy-icon icon icon-bg"
                type="copy"
                onClick={() => copyToClipboard(title)}
              />
            )}
          </div>
          {type === "CHAIN" ? (
            <div className="chain-wrapper">
              {chainedPosts.map((post, index) => (
                <div className="chain-item" key={post._id}>
                  <div className="chain-item-id">{index + 1}</div>
                  <div
                    className="chain-item-title"
                    onClick={() => goToPost(post._id, _id)}
                  >
                    {post.title}
                  </div>
                  {/* <div>
                    {post.title}
                  </div> */}
                </div>
              ))}
            </div>
          ) : (
            <div style={{ flex: "1" }} className="relative">
              <div
                className="content"
                dangerouslySetInnerHTML={{ __html: marked(content) }}
              ></div>
              <Icon
                type="copy"
                className="copy-icon icon icon-bg"
                onClick={() => copyToClipboard(content)}
              />
            </div>
          )}
          {type === "QUIZ" && solution && (
            <div className="quiz-solution">{solution}</div>
          )}
          <div className="tags">
            {tags.map((tag, index) => (
              <Tag key={index}>{tag.toUpperCase()}</Tag>
            ))}
          </div>
        </div>

        <Icon
          className="back-icon icon icon-bg"
          onClick={goBack}
          type="caret-left"
        />
        <Icon
          size={12}
          onClick={handleEdit}
          className="edit-icon icon icon-bg"
          type="edit"
        />
        {!!index && <span className="index">{`#${index}`}</span>}
        {status === "POSTED" && (
          <div
            className="canonical-url"
            onClick={() => copyToClipboard(canonicalURL)}
          >
            {canonicalURL}
          </div>
        )}
      </Card>
      <Controls note={viewNote} view="right" />
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

const mapStateToProps = ({ viewNote, notes, chains }) => ({
  notes,
  viewNote,
  chains,
});

export default withRouter(connect(mapStateToProps)(NoteView));
