import React, { useState, useEffect, Fragment } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import styled from "styled-components";
import { Tag, Button } from "antd";
import marked from "marked";
import { Card, Icon } from "@codedrops/react-ui";
import Dropdown from "./Dropdown";
import Filters from "../Filters";
import colors from "../../colors";
import { MessageWrapper } from "../../styled";
import {
  fetchNotes,
  setNoteToEdit,
  deleteNote,
  setFilter,
} from "../../store/actions";

const NotesWrapper = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, 215px);
  justify-content: center;
  column-gap: 6px;
  .card-wrapper {
    margin: 3px 0;
    height: 115px;
    cursor: pointer;
    position: relative;
    padding: 0px;
    .card {
      width: 100%;
      height: 100%;
      font-size: 1.4rem;
      &:hover {
        background: ${colors.shade3};
      }
      .title {
        font-size: inherit;
        text-align: center;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
      }
      .content {
        font-size: inherit;
        width: 100%;
        overflow: auto;
        padding: 5px;
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
      }
      .tags {
        position: absolute;
        bottom: 9px;
        left: 3px;
        text-align: left;
        .ant-tag {
          cursor: pointer;
          margin-right: 3px;
          padding: 0px 4px;
          font-size: 1.1rem;
        }
      }
    }
    .draft-status {
      position: absolute;
      top: 6px;
      left: 6px;
      width: 8px;
      height: 8px;
      background: lightgrey;
      border-radius: 50%;
    }
    .bulb-icon {
      position: absolute;
      bottom: 6px;
      right: 4px;
      z-index: 10;
      color: green;
    }
  }
`;

const Notes = ({
  notes,
  appLoading,
  history,
  dispatch,
  session,
  meta,
  filters,
}) => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (session && !notes.length) dispatch(fetchNotes());
  }, [session, dispatch]);

  useEffect(() => {
    if (!appLoading) setLoading(false);
  }, [notes, appLoading]);

  if (loading) return <Fragment />;

  return (
    <section>
      <Filters className="filters" />
      {notes.length && !loading ? (
        <div
          style={{ overflow: "auto", height: "100%", paddingBottom: "30px" }}
        >
          <NotesWrapper>
            {notes.map((note) => (
              <NoteCard
                key={note._id}
                note={note}
                history={history}
                dispatch={dispatch}
              />
            ))}
          </NotesWrapper>
          {notes.length && notes.length < meta.count && (
            <div className="flex center">
              <Button
                type="danger"
                onClick={() =>
                  dispatch(setFilter({ page: filters.page + 1 }, false))
                }
              >
                Load
              </Button>
            </div>
          )}
        </div>
      ) : (
        <MessageWrapper>Empty</MessageWrapper>
      )}
    </section>
  );
};

const NoteCard = ({
  note: { title = "", content = "", type = "DROP", tags = [], _id, status },
  history,
  dispatch,
}) => {
  const [showDropdown, setShowDropdown] = useState(false);

  const handleClick = (_id) => (event) => {
    event.stopPropagation();
    history.push(`/note/${_id}`);
  };

  const onEdit = () => {
    dispatch(setNoteToEdit(_id));
  };

  const onDelete = () => {
    dispatch(deleteNote(_id));
  };

  return (
    <div className="card-wrapper" onClick={handleClick(_id)}>
      <Card>
        {type === "POST" && <h3 className="title">{title}</h3>}
        {type === "DROP" && (
          <div
            className="content"
            dangerouslySetInnerHTML={{ __html: marked(content) }}
          ></div>
        )}
        <div className="tags">
          {tags.map((tag) => (
            <Tag key={tag}>{tag.toUpperCase()}</Tag>
          ))}
        </div>
        {type === "DROP" && <Icon className="bulb-icon" type="bulb" />}
      </Card>
      {status === "DRAFT" && <div className="draft-status"></div>}
      <Dropdown
        showDropdown={showDropdown}
        setShowDropdown={setShowDropdown}
        onEdit={onEdit}
        onDelete={onDelete}
      />
    </div>
  );
};

const mapStateToProps = ({ notes, meta, appLoading, session, filters }) => ({
  notes,
  appLoading,
  session,
  filters,
  meta,
});

export default withRouter(connect(mapStateToProps)(Notes));
