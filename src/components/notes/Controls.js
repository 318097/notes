import React, { useState, useEffect } from "react";
import { Radio, Switch } from "antd";
import styled from "styled-components";
import { connect } from "react-redux";

import { updateNote } from "../../store/actions";
import { copyToClipboard } from "../../utils";
import Icon from "../Icon";

const ControlsWrapper = styled.div`
  background: white;
  margin-bottom: 8px;
  width: 200px;
  padding: 14px;
  border-radius: 12px;
  border: 1px solid lightgrey;
  box-shadow: 3px 3px 3px lightgrey;
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

  const updateProperties = key => async ({ target: { value } }) =>
    await dispatch(updateNote({ _id: note._id, [key]: value }));

  return (
    <div className="controls">
      <ControlsWrapper>
        <div>
          Visible{" "}
          <Switch
            checked={note && note.visible}
            onChange={updateProperties("visible")}
          />
        </div>
      </ControlsWrapper>
      <ControlsWrapper>
        <div>
          <div className="header">
            <h4>Status</h4>
          </div>
          <Radio.Group
            onChange={updateProperties("status")}
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
            onChange={updateProperties("socialStatus")}
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
      <ControlsWrapper>
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
    </div>
  );
};

export default connect()(Controls);
