import React, { useState, Fragment } from "react";
import marked from "marked";
import styled from "styled-components";
import { Tag, Popconfirm } from "antd";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";

import Icon from "../Icon";
import { setNoteToEdit, deleteNote } from "../../store/actions";
import MCard from "@bit/ml318097.mui.card";

const Card = ({
  post,
  setNoteToEdit,
  deleteNote,
  view = "CARD",
  dropdownView
}) => {
  const [showDropdown, setShowDropdown] = useState(false);

  const { title = "", content = "", type = "DROP", tags = [], _id } =
    post || {};
  const showTitle = type !== "DROP" || view === "UPLOAD";
  const showContent =
    view === "UPLOAD" ||
    view === "EXPANDED" ||
    (view === "CARD" && type !== "POST");

  if (!post) return <Fragment />;

  return (
    <MCard className="card">
      {post.type === "DROP" && (
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
          <Tag key={tag}>{tag.toUpperCase()}</Tag>
        ))}
      </div>
      {/* {dropdownView && <Dropdown/>} */}
    </MCard>
  );
};

const mapStateToProps = ({ notes }) => ({ notes });
const mapDispatchToProps = { setNoteToEdit, deleteNote };

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Card));
