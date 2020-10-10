import React, { useState, Fragment } from "react";
import styled from "styled-components";
import { Icon as AntIcon } from "antd";
import marked from "marked";
import moment from "moment";
import colors, { Card, Icon, Tag } from "@codedrops/react-ui";
import Dropdown from "./Dropdown";

const StyledCard = styled.div`
  margin-bottom: 16px;
  .card {
    break-inside: avoid-column;
    position: relative;
    height: auto;
    margin: 0;
    min-height: unset;
    cursor: pointer;
    width: 100%;
    font-size: 1.3rem;
    overflow: visible;
    padding: 20px 8px;
    &:hover {
      background: ${colors.feather};
    }
    .title {
      font-size: inherit;
      text-align: center;
    }
    .post-title {
      margin: 30px 0;
      font-size: 1.6rem;
    }
    .content {
      font-size: inherit;
      width: 100%;
      margin-top: 8px;
      overflow-x: auto;
      padding: 0;
    }
  }
  .action-row {
    position: relative;
    padding: 6px;
    height: auto;
    min-height: unset;
    overflow: visible;
    width: 100%;
    top: 0px;
    .tags {
      text-align: left;
    }
    .tag {
      cursor: pointer;
      padding: 0px 4px;
      font-size: 0.8rem;
    }
    .status-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      .anticon {
        margin: 0 2px;
      }
    }
    .index {
      font-style: italic;
      color: ${colors.bar};
      margin: 2px;
      font-size: 1rem;
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
    socialStatus,
    index,
    liveId,
    createdAt,
  },
  handleClick,
  onEdit,
  onDelete,
  tagsCodes,
}) => {
  const [showDropdown, setShowDropdown] = useState(false);

  const createdToday =
    moment(createdAt).format("DD-MM-YYYY") === moment().format("DD-MM-YYYY");
  return (
    <StyledCard>
      <Card onClick={handleClick(_id)}>
        <h3 className={`title ${type === "POST" ? "post-title" : ""}`}>
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
      <Card className="action-row">
        <div className="tags">
          {tags.map((tag) => (
            <Tag key={tag}>{tag.toUpperCase()}</Tag>
          ))}
        </div>
        <div className="status-row">
          <div
            style={{
              display: "flex",
              alignItems: "center",
              height: "max-content",
            }}
          >
            {status !== "POSTED" && socialStatus !== "POSTED" && (
              <Fragment>
                {status !== "DRAFT" && (
                  <div
                    className="state"
                    style={{
                      background: status === "POSTED" ? "seagreen" : "orange",
                    }}
                  >
                    STATUS
                  </div>
                )}
                {socialStatus !== "NONE" && (
                  <div
                    className="state"
                    style={{
                      background:
                        socialStatus === "POSTED" ? "seagreen" : "orange",
                    }}
                  >
                    SOCIAL STATUS
                  </div>
                )}
              </Fragment>
            )}
            {liveId && <span className="state">{`Live Id: ${liveId}`}</span>}
          </div>

          <div style={{ display: "flex", alignItems: "center" }}>
            <AntIcon type={`${visible ? "eye" : "eye-invisible"}`} />
            {type === "DROP" && (
              <Icon className="bulb-icon" type="bulb" size={12} />
            )}
            {createdToday && <Tag>Today</Tag>}
            {!!index && <span className="index">{`#${index}`}</span>}
          </div>
        </div>
      </Card>
    </StyledCard>
  );
};

export default NoteCard;
