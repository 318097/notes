import React, { useEffect, useRef } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import styled from "styled-components";
import { Button } from "antd";
import colors from "@codedrops/react-ui";
import { MessageWrapper } from "../../styled";
import NoteCard from "./NoteCard";
import {
  setNoteToEdit,
  deleteNote,
  setFilter,
  setSession,
} from "../../store/actions";
import { extractTagCodes } from "../../utils";
import config from "../../config";

const PageWrapper = styled.div`
  margin-bottom: 25px;
  .page-splitter {
    display: block;
    width: 80%;
    margin: 20px 30px 25px;
    position: relative;
    span {
      padding: 0 12px;
      display: inline-block;
      position: relative;
      left: 20px;
      background: ${colors.strokeTwo};
      font-size: 1rem;
      color: white;
    }
    &:after {
      content: "";
      z-index: -1;
      display: block;
      width: 100%;
      height: 1px;
      position: absolute;
      top: 50%;
      background: ${colors.strokeTwo};
    }
  }
  .notes-wrapper {
    columns: 240px;
    padding: 0 28px;
    column-gap: 12px;
  }
`;

const scrollToPosition = (ref, offset) => {
  let position = 0;
  const increment = offset / 10;
  const interval = setInterval(() => {
    ref.scrollTop = position;
    position += increment;
    if (position >= offset) clearInterval(interval);
  }, 50);
};

const Notes = ({
  notes,
  history,
  dispatch,
  meta,
  filters,
  appLoading,
  tagsCodes,
}) => {
  const scrollRef = useRef();

  useEffect(() => {
    dispatch(setFilter({}));
  }, []);

  useEffect(() => {
    if (!scrollRef.current) return;
    const offset = sessionStorage.getItem("scroll");
    scrollToPosition(scrollRef.current, offset);
    sessionStorage.clear();
  }, [scrollRef]);

  const handleClick = (_id) => (event) => {
    event.stopPropagation();
    history.push(`/note/${_id}`);
    sessionStorage.setItem("scroll", scrollRef.current.scrollTop);
    dispatch(setSession({ retainPage: true }));
  };

  const onEdit = (_id) => dispatch(setNoteToEdit(_id));

  const onDelete = (_id) => dispatch(deleteNote(_id));

  const noteChunks = Array(Math.ceil(notes.length / config.LIMIT))
    .fill(null)
    .map((_, index) =>
      notes.slice(index * config.LIMIT, index * config.LIMIT + config.LIMIT)
    );

  return (
    <section>
      {notes.length ? (
        <div
          style={{ overflow: "auto", height: "100%", paddingBottom: "30px" }}
          ref={scrollRef}
        >
          {noteChunks.map((chunk, index) => (
            <PageWrapper key={index}>
              <div className="notes-wrapper">
                {chunk.map((note) => (
                  <NoteCard
                    key={note._id}
                    note={note}
                    history={history}
                    handleClick={handleClick}
                    onEdit={onEdit}
                    onDelete={onDelete}
                    tagsCodes={tagsCodes}
                  />
                ))}
              </div>
              {index < noteChunks.length - 1 && (
                <div className="page-splitter">
                  <span>{`Page: ${index + 2}`}</span>
                </div>
              )}
            </PageWrapper>
          ))}
          {notes.length && notes.length < meta.count && (
            <div className="flex center">
              <Button
                onClick={() =>
                  dispatch(setFilter({ page: filters.page + 1 }, false))
                }
              >
                Load
              </Button>
            </div>
          )}
        </div>
      ) : appLoading ? null : (
        <MessageWrapper>Empty</MessageWrapper>
      )}
    </section>
  );
};

const mapStateToProps = ({ notes, meta, appLoading, filters, settings }) => ({
  notes,
  appLoading,
  filters,
  meta,
  tagsCodes: extractTagCodes(settings.tags),
});

export default withRouter(connect(mapStateToProps)(Notes));
