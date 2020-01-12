import React, { useState, useEffect } from "react";
import { Popover, Divider, Radio, Switch } from "antd";
import styled from "styled-components";
import { connect } from "react-redux";

import { updateNote } from "../../store/actions";
import { copyToClipboard } from "../../utils";
import { StyledIcon } from "../../styled";

const ControlsWrapper = styled.div`
  width: 200px;
  height: 100%;
  overflow: auto;
  padding: 10px 5px;
  position: absolute;
  top: 0;
  right: -210px;
  background: white;
  border-radius: 5px;
  border: 1px solid lightgrey;
  box-shadow: 3px 3px 3px lightgrey;
  .hashtag {
    margin: 1px 2px;
    padding: 1px 3px;
    font-size: 0.7rem;
    background: #f5f5f5;
    display: inline-block;
  }
  .ant-divider {
    margin: 15px 0;
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
    setHashtags([...defaultTags, note.tags.map(tag => `#${tag}`)]);
  }, [note]);

  const changeState = key => async ({ target: { value } }) =>
    await dispatch(updateNote({ _id: note._id, [key]: value }));

  const changeVisibility = async value =>
    await dispatch(updateNote({ _id: note._id, visible: value }));

  return (
    <ControlsWrapper>
      <div className="flex space-between align-center">
        <h4>Hashtags</h4>
        <Popover placement="bottom" content="Copy to clipboard">
          <StyledIcon
            type="copy"
            onClick={() => copyToClipboard(hashtags.join(" "))}
          />
        </Popover>
      </div>
      <div>
        {note &&
          hashtags.map(tag => (
            <span className="hashtag" key={tag}>
              {tag}
            </span>
          ))}
      </div>
      <Divider />
      <div>
        <div className="flex space-between align-center">
          <h4>Status</h4>
        </div>
        <Radio.Group
          onChange={changeState("status")}
          value={note && note.status}
        >
          {["DRAFT", "READY", "POSTED"].map(state => (
            <Radio className="radio-box" key={state} value={state}>
              {state}
            </Radio>
          ))}
        </Radio.Group>
      </div>
      <Divider />
      <div>
        <div className="flex space-between align-center">
          <h4>Social status</h4>
        </div>
        <Radio.Group
          onChange={changeState("socialStatus")}
          value={(note && note.socialStatus) || "NONE"}
        >
          {["NONE", "READY", "POSTED"].map(state => (
            <Radio className="radio-box" key={state} value={state}>
              {state}
            </Radio>
          ))}
        </Radio.Group>
      </div>
      <Divider />
      <div>
        Visible{" "}
        <Switch checked={note && note.visible} onChange={changeVisibility} />
      </div>
    </ControlsWrapper>
  );
};

export default connect()(Controls);
