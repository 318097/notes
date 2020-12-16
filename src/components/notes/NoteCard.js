import React, { useState } from "react";
import styled from "styled-components";
import { Icon as AntIcon } from "antd";
import marked from "marked";
import moment from "moment";
import colors, { Card, Icon, Tag } from "@codedrops/react-ui";
import Dropdown from "./Dropdown";

const StyledCard = styled.div`
  margin-bottom: 16px;
  break-inside: avoid-column;
  .card,
  .action-row {
    border: 1px solid ${colors.bg};
    box-shadow: ${colors.bg} 3px 3px 3px;
    position: relative;
    width: 100%;
    height: auto;
    min-height: unset;
    overflow: visible;
    &:hover {
      background: ${colors.featherDark};
    }
  }
  .card {
    margin: 0;
    cursor: pointer;
    font-size: 1rem;
    padding: 20px 8px;
    .title {
      font-size: 1.2rem;
      text-align: center;
    }
    .post-title {
      margin: 30px 0;
      font-size: 1.5rem;
    }
    .content {
      font-size: inherit;
      width: 100%;
      margin-top: 8px;
      overflow-x: auto;
      padding: 0;
      pre,
      code {
        font-size: 1rem;
      }
    }
  }
  .card.today,
  .action-row.today {
    background: ${colors.feather};
  }
  .action-row {
    padding: 6px;
    top: 0px;
    &:hover {
      background: ${colors.white};
    }
    .status-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      .anticon {
        margin: 0 2px;
      }
    }
  }
`;

const NoteCard = ({ note, handleClick, onEdit, onDelete, tagsCodes }) => {
  const {
    title = "",
    content = "",
    type = "DROP",
    tags = [],
    _id,
    status,
    visible,
    index,
    liveId,
    createdAt,
    rating,
    chainedPosts = [],
    chainedItems = [],
    chainedTo = [],
  } = note;
  const [showDropdown, setShowDropdown] = useState(false);
  const addedDays = moment().diff(moment(createdAt), "days");
  return (
    <StyledCard>
      <Card
        onClick={(e) => handleClick(e, _id)}
        className={`card ${addedDays ? null : "today"}`}
      >
        <h3 className={`title ${type === "DROP" ? "" : "post-title"}`}>
          {title}
        </h3>

        {["DROP", "QUIZ"].includes(type) && (
          <div
            className="content"
            dangerouslySetInnerHTML={{ __html: marked(content) }}
          ></div>
        )}
        <Dropdown
          showDropdown={showDropdown}
          setShowDropdown={setShowDropdown}
          onEdit={() => onEdit(_id)}
          onDelete={() => onDelete(_id)}
        />
      </Card>
      <Card className={`action-row ${addedDays ? "" : "today"}`}>
        <div className="status-row">
          <div className="tags">
            {tags.map((tag) => (
              <Tag key={tag} color={tagsCodes[tag]}>
                {tag.toUpperCase()}
              </Tag>
            ))}
          </div>
          <div style={{ display: "flex", alignItems: "center" }}>
            {type === "CHAIN" && (
              <Tag
                color={chainedItems.length !== chainedPosts.length ? "red" : ""}
              >{`${chainedItems.length} posts`}</Tag>
            )}
            {chainedTo && chainedTo.length ? (
              <Tag>{`In ${chainedTo.length} chains`}</Tag>
            ) : null}
            {!visible && <AntIcon type="eye-invisible" />}
            {type === "DROP" && <Icon type="bulb" size={12} />}
            {type === "CHAIN" && <AntIcon type="deployment-unit" size={12} />}
          </div>
        </div>

        <div className="status-row">
          <Tag color={status === "POSTED" ? "seagreen" : "orange"}>
            {status === "POSTED" ? `Live Id: ${liveId}` : status}
          </Tag>
          <div style={{ display: "flex", alignItems: "center" }}>
            {!!rating && (
              <Tag>
                {rating}
                <AntIcon
                  type="star"
                  style={{
                    fontSize: "12px",
                  }}
                />
              </Tag>
            )}
            <Tag>{addedDays ? `${addedDays}d ago` : "Today"}</Tag>
            {index && <Tag>{`#${index}`}</Tag>}
          </div>
        </div>
      </Card>
    </StyledCard>
  );
};

export default NoteCard;
