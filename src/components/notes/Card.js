import React, { useState, Fragment } from "react";
import marked from "marked";
import styled from "styled-components";
import { Tag, Popconfirm } from "antd";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";

import Icon from "../Icon";
import { setNoteToEdit, deleteNote } from "../../store/actions";

const Wrapper = styled.div`
  background: white;
  padding: 5px 0 3px 5px;
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
  .drop-icon {
    position: absolute;
    right: 2px;
    bottom: 3px;
    z-index: 2;
  }
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
        padding: initial;
        border-radius: initial;
      }
    }
    code {
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
  setNoteToEdit,
  deleteNote,
  view = "CARD",
  dropdownView
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
    setNoteToEdit(_id);
    setShowDropdown(false);
  };

  const handleDelete = () => {
    deleteNote(_id);
    setShowDropdown(false);
  };

  const handleDropdownClick = event => {
    event.stopPropagation();
    setShowDropdown(prevState => !prevState);
  };

  const handleTagClick = event => {
    event.stopPropagation();
  };

  if (!note) return <Fragment />;

  return (
    <Wrapper className="card">
      {note.type === "DROP" && (
        <Icon className="drop-icon" type="thunderbolt" />
      )}
      {showTitle && <h3 className="title">{title}</h3>}
      {showContent && (
        <div
          className="content"
          dangerouslySetInnerHTML={{ __html: marked(content) }}
        ></div>
      )}
      <div className="tags">
        {tags.map(tag => (
          <Tag onClick={handleTagClick} key={tag}>
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
            <div
              className="dropdown"
              onClick={event => event.stopPropagation()}
            >
              <Icon onClick={handleFavorite} type="heart" />
              <Icon onClick={handleEdit} type="edit" />
              <Popconfirm
                title="Delete?"
                onConfirm={handleDelete}
                placement="right"
                okText="Yes"
                cancelText="No"
              >
                <Icon type="delete" />
              </Popconfirm>
            </div>
          )}
        </DropdownWrapper>
      )}
    </Wrapper>
  );
};

const mapStateToProps = ({ notes }) => ({ notes });
const mapDispatchToProps = { setNoteToEdit, deleteNote };

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Card));
