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
  .card {
    position: relative;
    height: auto;
    margin: 0;
    min-height: unset;
    cursor: pointer;
    width: 100%;
    font-size: 1.1rem;
    overflow: visible;
    padding: 20px 8px;
    &:hover {
      background: ${colors.featherDark};
    }
    .title {
      font-size: inherit;
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
    }
  }
  .card.today,
  .action-row.today {
    background: ${colors.feather};
  }
  .action-row {
    position: relative;
    padding: 6px;
    height: auto;
    min-height: unset;
    overflow: visible;
    width: 100%;
    top: 0px;
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

const NoteCard = ({
  note: {
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
  },
  handleClick,
  onEdit,
  onDelete,
  tagsCodes,
}) => {
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
      <Card className={`action-row ${addedDays ? null : "today"}`}>
        <div className="status-row">
          <div className="tags">
            {tags.map((tag) => (
              <Tag key={tag} color={tagsCodes[tag]}>
                {tag.toUpperCase()}
              </Tag>
            ))}
          </div>
          <div style={{ display: "flex", alignItems: "center" }}>
            <AntIcon type={`${visible ? "eye" : "eye-invisible"}`} />
            {type === "DROP" && (
              <Icon className="bulb-icon" type="bulb" size={12} />
            )}
          </div>
        </div>

        <div className="status-row">
          <div
            style={{
              display: "flex",
              alignItems: "center",
              height: "max-content",
            }}
          >
            <Tag color={status === "POSTED" ? "seagreen" : "orange"}>
              {status === "POSTED" ? `Live Id: ${liveId}` : status}
            </Tag>
          </div>

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

            {type === "CHAIN" && (
              <Tag
                color={chainedItems.length !== chainedPosts.length ? "red" : ""}
              >{`${chainedItems.length} chained`}</Tag>
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
