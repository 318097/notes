import React, { useEffect } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import styled from "styled-components";
import { Button } from "antd";

import Card from "./Card";

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
      &:hover {
        background: #efefef;
      }
      .content {
        overflow: hidden;
      }
    }
  }
`;

const Notes = ({ notes, appLoading, history, dispatch, session, filters }) => {
  useEffect(() => {
    if (session) dispatch(fetchNotes());
  }, [session]);

  const handleClick = _id => event => {
    event.stopPropagation();
    history.push(`/note/${_id}`);
  };

  return (
    <section>
      {notes.length ? (
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
        !appLoading && <MessageWrapper>Empty</MessageWrapper>
      )}
      {notes.length > 0 && (
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

const mapStateToProps = ({ notes, appLoading, session, filters }) => ({
  notes,
  appLoading,
  session,
  filters
});

export default withRouter(connect(mapStateToProps)(Notes));
