import React, { useState, useEffect, Fragment } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import styled from "styled-components";
import { Button } from "antd";

import Card from "./Card";
import Filters from "../Filters";

import { MessageWrapper } from "../../styled";
import { setFilter, fetchNotes } from "../../store/actions";

const Wrapper = styled.div`
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  .card-wrapper {
    width: 215px;
    height: 115px;
    margin: 4px;
    cursor: pointer;
    position: relative;
    .card {
      .title,
      .content {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        font-size: 13px;
      }
      .content {
        overflow: hidden;
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
  filters,
  meta
}) => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (session) dispatch(fetchNotes());
  }, [session]);

  useEffect(() => {
    if (!appLoading) setLoading(false);
  }, [notes, appLoading]);

  const handleClick = _id => event => {
    event.stopPropagation();
    history.push(`/note/${_id}`);
  };

  if (loading) return <Fragment />;
  return (
    <section>
      <Filters className="filters" />
      {notes.length && !loading ? (
        <Wrapper>
          {notes.map(note => (
            <div
              className="card-wrapper"
              key={note._id}
              onClick={handleClick(note._id)}
            >
              <Card note={note} dropdownView={true} />
            </div>
          ))}
        </Wrapper>
      ) : (
        <MessageWrapper>Empty</MessageWrapper>
      )}
      <br />
      {notes.length && notes.length < meta.count && (
        <div className="flex center">
          <Button
            type="danger"
            onClick={() => dispatch(setFilter({ page: filters.page + 1 }))}
          >
            Load
          </Button>
        </div>
      )}
    </section>
  );
};

const mapStateToProps = ({ notes, meta, appLoading, session, filters }) => ({
  notes,
  appLoading,
  session,
  filters,
  meta
});

export default withRouter(connect(mapStateToProps)(Notes));
