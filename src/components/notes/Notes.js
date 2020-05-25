import React, { useState, useEffect, Fragment } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import styled from "styled-components";
import { Button, Icon as AntIcon } from "antd";
import marked from "marked";
import colors, { Card, Icon, Tag } from "@codedrops/react-ui";
import Dropdown from "./Dropdown";
import Filters from "../Filters";
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
  gap: 20px;
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
      overflow-x: hidden;
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
        left: 0;
        transform: translateY(-50%);
      }
      .tags {
        position: absolute;
        bottom: 4px;
        left: 4px;
        text-align: left;
        .tag {
          cursor: pointer;
          padding: 0px 4px;
          font-size: 0.8rem;
        }
      }
    }
    .status-row {
      position: absolute;
      top: calc(100% + 4px);
      width: 100%;
      display: flex;
      align-items: center;
      padding-left: 2px;
      .anticon {
        margin: 0 1px;
      }
      .dot {
        margin: 0 1px;
        background: lightgrey;
        border-radius: 20px;
        display: inline-block;
        width: max-content;
        font-size: 0.8rem;
        padding: 0 8px;
      }
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
  note: {
    title = "",
    content = "",
    type = "DROP",
    tags = [],
    _id,
    status,
    visible,
    socialStatus,
  },
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
      </Card>
      <div className="status-row">
        {type === "DROP" && (
          <Icon className="bulb-icon" type="bulb" size={12} />
        )}
        <AntIcon type={`${visible ? "eye" : "eye-invisible"}`} />
        <div
          className="dot"
          style={{
            background: status === "POSTED" ? "lightgreen" : "lightgrey",
          }}
        >
          STATUS
        </div>
        <div
          className="dot"
          style={{
            background: status === "POSTED" ? "lightgreen" : "lightgrey",
          }}
        >
          SOCIAL
        </div>
      </div>
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
