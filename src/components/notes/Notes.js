import React from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import styled from "styled-components";

import Card from "./Card";

import { MessageWrapper } from "../../styled";

const Wrapper = styled.div`
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  .card-wrapper {
    width: 215px;
    height: 115px;
    margin: 7px;
    cursor: pointer;
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

const Notes = ({ data, appLoading, history }) => {
  const handleClick = _id => event => {
    event.stopPropagation();
    history.push(`/note/${_id}`);
  };

  return (
    <section>
      {data.length ? (
        <Wrapper>
          {data.map(note => (
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
    </section>
  );
};

const mapStateToProps = ({ notes, appLoading }) => ({
  data: notes,
  appLoading
});

export default withRouter(connect(mapStateToProps)(Notes));
