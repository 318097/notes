import React, { useState, useEffect } from "react";
import { Radio, Switch } from "antd";
import styled from "styled-components";
import { connect } from "react-redux";

import { updateNote } from "../../store/actions";
import { copyToClipboard, generateSlug } from "../../utils";
import Icon from "../Icon";

const ControlsWrapper = styled.div`
  background: white;
  margin-bottom: 8px;
  width: 218px;
  padding: 12px;
  border-radius: 12px;
  border: 1px solid #f2f2f2;
  box-shadow: 3px 3px 3px #f2f2f2;
  .header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 8px;
  }
  .hashtag {
    margin: 1px 2px;
    padding: 1px 3px;
    font-size: 1.3rem;
    display: inline-block;
  }
  .slug {
    background: #21009a;
    text-overflow: ellipsis;
    width: 100%;
    color: white;
    padding: 2px 4px;
    overflow: hidden;
    text-align: center;
    border-radius: 4px;
  }
`;

const defaultTags = [
  "#Web",
  "#WebDevelopment",
  "#Tech",
  "#Coding",
  "#Developer"
];

const Controls = ({ note, dispatch }) => {
  const [hashtags, setHashtags] = useState([]);

  useEffect(() => {
    if (!note) return;
    setHashtags([...defaultTags, ...note.tags.map(tag => `#${tag}`)]);
  }, [note]);

  const updateProperties = async (key, value) =>
    await dispatch(updateNote({ _id: note._id, [key]: value }));

  const slug = generateSlug(note.title, "_");
  return (
    <div className="controls">
      <ControlsWrapper>
        <div className="header">
          <h4>Name</h4>
          <Icon type="copy" onClick={() => copyToClipboard(slug)} />
        </div>
        <div className="slug">{slug}</div>

        <div className="divider"></div>

        <div className="header">
          <h4>Hashtags</h4>
          <Icon
            type="copy"
            onClick={() => copyToClipboard(hashtags.join(" "))}
          />
        </div>
        <div>
          {note &&
            hashtags.map(tag => (
              <span className="hashtag" key={tag}>
                {tag}
              </span>
            ))}
        </div>
      </ControlsWrapper>
      <ControlsWrapper>
        <div className="flex align-center">
          <span style={{ marginRight: "4px" }}>Visible</span>
          <Switch
            checked={note && note.visible}
            onChange={value => updateProperties("visible", value)}
          />
        </div>
      </ControlsWrapper>
      <ControlsWrapper>
        <div>
          <div className="header">
            <h4>Status</h4>
          </div>
          <Radio.Group
            onChange={({ target: { value } }) =>
              updateProperties("status", value)
            }
            value={note && note.status}
          >
            {["DRAFT", "READY", "POSTED"].map(state => (
              <Radio className="radio-box" key={state} value={state}>
                {state}
              </Radio>
            ))}
          </Radio.Group>
        </div>
      </ControlsWrapper>
      <ControlsWrapper>
        <div>
          <div className="header">
            <h4>Social status</h4>
          </div>
          <Radio.Group
            onChange={({ target: { value } }) =>
              updateProperties("socialStatus", value)
            }
            value={(note && note.socialStatus) || "NONE"}
          >
            {["NONE", "READY", "POSTED"].map(state => (
              <Radio className="radio-box" key={state} value={state}>
                {state}
              </Radio>
            ))}
          </Radio.Group>
        </div>
      </ControlsWrapper>
    </div>
  );
};

export default connect()(Controls);
