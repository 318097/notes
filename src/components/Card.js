import React, { useState, Fragment } from "react";
import marked from "marked";
import styled from "styled-components";
import { Tag, Icon, Popover, Popconfirm } from "antd";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";

import { editNote, deleteNote } from "../store/actions";

const Wrapper = styled.div`
  background: white;
  padding: 5px 0 10px 5px;
  position: relative;
  height: 100%;
  width: 100%;
  border-radius: 5px;
  border: 1px solid lightgrey;
  box-shadow: 3px 3px 3px lightgrey;
  transition: 1s;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  ,
  .title {
    font-size: 16px;
    text-align: center;
    margin-bottom: 5px;
  }
  .content {
    padding: 5px;
    word-wrap: break-word;
    flex: 1 1 auto;
    width: 100%;
    pre {
      text-align: left;
      font-size: 12px;
      margin: 0 auto;
      border: 1px solid lightgrey;
      padding: 5px;
      & > code {
        background: initial;
        padding: initial;
        border-radius: initial;
      }
    }
    code {
      background: tomato;
      padding: 2px 4px;
      border-radius: 10px;
    }
    p {
      text-align: left;
    }
  }
  .tags {
    text-align: left;
    .ant-tag {
      margin-right: 3px;
      padding: 0px 4px;
      font-size: 9px;
    }
  }
  .back-icon {
    position: absolute;
    background: lightgrey;
    top: -7px;
    left: -9px;
    z-index: 10;
    padding: 5px;
    border-radius: 30px;
    transition: 1s;
    &:hover {
      color: grey;
      transform: scale(1.2);
    }
  }
`;

const DropdownWrapper = styled.div`
  position: absolute;
  top: 4px;
  right: 4px;
  .dropdown-icon {
    padding: 2px;
    border-radius: 50%;
  }
  .dropdown {
    display: flex;
    flex-direction: column;
    position: absolute;
    background: lightgrey;
    padding: 5px;
    right: -3px;
    top: 19px;
    border-radius: 15px;
    & > * {
      margin: 2px 0;
    }
  }
`;

const Card = ({
  note,
  editNote,
  deleteNote,
  view = "CARD",
  dropdownView,
  history
}) => {
  const [showDropdown, setShowDropdown] = useState(false);

  const { title = "", content = "", type = "DROP", tags = [], _id } =
    note || {};
  const showTitle = type !== "DROP" || view === "UPLOAD";
  const showContent =
    view === "UPLOAD" ||
    view === "EXPANDED" ||
    (view === "CARD" && type !== "POST");

  const handleFavorite = () => {};

  const handleEdit = () => {
    editNote(_id);
    setShowDropdown(false);
  };

  const handleDelete = () => {
    deleteNote(_id);
    setShowDropdown(false);
  };

  const handleDropdownClick = e => {
    e.stopPropagation();
    setShowDropdown(prevState => !prevState);
  };

  const handleTagClick = e => {
    e.stopPropagation();
  };

  if (!note) return <Fragment />;

  return (
    <Wrapper className="card">
      {showTitle && <h3 className="title">{title}</h3>}
      {showContent && (
        <div
          className="content"
          dangerouslySetInnerHTML={{ __html: marked(content) }}
        ></div>
      )}
      <div className="tags">
        {tags.map((tag, index) => (
          <Tag onClick={handleTagClick} key={index}>
            {tag.toUpperCase()}
          </Tag>
        ))}
      </div>
      {dropdownView && (
        <DropdownWrapper className="dropdown-wrapper">
          <Icon
            className="dropdown-icon"
            type="more"
            onClick={handleDropdownClick}
          />
          {showDropdown && (
            <div className="dropdown" onClick={e => e.stopPropagation()}>
              <Popover placement="right" content="Favorite">
                <Icon onClick={handleFavorite} type="heart" />
              </Popover>
              <Popover placement="right" content="Edit">
                <Icon onClick={handleEdit} type="edit" />
              </Popover>
              <Popover placement="right" content="Delete">
                <Popconfirm
                  title="Delete?"
                  onConfirm={handleDelete}
                  placement="right"
                  okText="Yes"
                  cancelText="No"
                >
                  <Icon type="delete" />
                </Popconfirm>
              </Popover>
            </div>
          )}
        </DropdownWrapper>
      )}
      {view === "EXPANDED" && (
        <Icon
          className="back-icon"
          onClick={() => history.push("/home")}
          type="caret-left"
        />
      )}
    </Wrapper>
  );
};

const mapStateToProps = ({ notes }) => ({ notes });
const mapDispatchToProps = { editNote, deleteNote };

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Card));
