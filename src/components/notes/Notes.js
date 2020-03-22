import React, { useState, useEffect, Fragment } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import styled from "styled-components";
import { Tag } from "antd";
import marked from "marked";

import Card from "@bit/ml318097.mui.card";
import Icon from "@bit/ml318097.mui.icon";

import Filters from "../Filters";

import { MessageWrapper } from "../../styled";
import { fetchNotes } from "../../store/actions";

const Wrapper = styled.div`
  margin-top: 12px;
  display: grid;
  grid-template-columns: repeat(auto-fill, 215px);
  justify-content: center;
  grid-gap: 8px;
  .card-wrapper {
    height: 115px;
    cursor: pointer;
    position: relative;
    padding: 0px;
    .card {
      font-size: 1.4rem;
      &:hover {
        background: #f3f3f3;
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
        pre code {
          font-size: 1.1rem;
        }
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
    .bulb-icon {
      position: absolute;
      top: 5px;
      right: 5px;
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
          {notes.map(
            ({ title = "", content = "", type = "DROP", tags = [], _id }) => (
              <div
                className="card-wrapper"
                key={_id}
                onClick={handleClick(_id)}
              >
                <Card>
                  {type === "POST" && <h3 className="title">{title}</h3>}
                  {type === "DROP" && (
                    <div
                      className="content"
                      dangerouslySetInnerHTML={{ __html: marked(content) }}
                    ></div>
                  )}
                  <div className="tags">
                    {tags.map(tag => (
                      <Tag key={tag}>{tag.toUpperCase()}</Tag>
                    ))}
                  </div>
                  {type === "DROP" && (
                    <Icon className="bulb-icon" type="bulb" />
                  )}
                </Card>
              </div>
            )
          )}
        </Wrapper>
      ) : (
        <MessageWrapper>Empty</MessageWrapper>
      )}
      <br />
      {/* {notes.length && notes.length < meta.count && (
        <div className="flex center">
          <Button
            type="danger"
            onClick={() => dispatch(setFilter({ page: filters.page + 1 }))}
          >
            Load
          </Button>
        </div>
      )} */}
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
