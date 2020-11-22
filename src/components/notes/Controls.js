import React, { useState, Fragment } from "react";
import { Radio, Switch, Input, Rate, Select } from "antd";
import styled from "styled-components";
import { connect } from "react-redux";
import moment from "moment";
import colors, { Icon, Tag } from "@codedrops/react-ui";
import { updateNote } from "../../store/actions";
import { copyToClipboard } from "../../utils";
import short from "short-uuid";
import { statusFilter } from "../../constants";

const { TextArea } = Input;
const { Option } = Select;

const ControlsWrapper = styled.div`
  background: white;
  margin-bottom: 8px;
  width: 218px;
  padding: 14px 12px;
  border-radius: 12px;
  border: 1px solid ${colors.shade2};
  box-shadow: 3px 3px 3px ${colors.shade2};
  .header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 4px;
  }
  .hashtag {
    font-size: 1rem;
  }
  .slug {
    background: ${colors.primary};
    width: 100%;
    color: white;
    padding: 4px;
    border-radius: 2px;
    font-size: 0.8rem;
    transition: 0.4s;
    cursor: pointer;
    margin-bottom: 6px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    &:hover {
      background: ${colors.orchid};
    }
  }
  .empty {
    opacity: 0.8;
    text-align: center;
    font-size: 1rem;
  }
  .resource-id {
    background: ${colors.strokeOne};
    border-radius: 50%;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 25px;
    height: 25px;
    font-size: 1.2rem;
    margin-right: 4px;
    cursor: pointer;
    transition: 0.4s;
    &:hover {
      background: ${colors.strokeTwo};
    }
  }
  .notes-container {
    padding: 8px 0px;
    .note {
      background: ${colors.feather};
      border-radius: 4px;
      padding: 8px;
      margin-bottom: 4px;
    }
  }
  .ant-radio-wrapper {
    font-size: 12px;
  }
`;

const Controls = ({ note, dispatch, view, chains = [] }) => {
  const {
    tags = [],
    _id,
    liveId,
    slug = "",
    index,
    createdAt,
    resources = [],
    visible,
    status,
    socialStatus,
    rating,
    notes: personalNotes = [],
    type,
    chainedTo = [],
  } = note || {};
  const [liveIdEditor, setLiveIdEditor] = useState(false);
  const [personalNote, setPersonalNote] = useState("");

  const updateProperties = async (update) =>
    await dispatch(updateNote({ _id, liveId, ...update }));

  const copy = (text) => () => {
    copyToClipboard(text);
  };

  const handleAddPersonalNote = () => {
    const newNote = [
      ...personalNotes,
      { _id: short.generate(), content: personalNote },
    ];
    updateProperties({ notes: newNote });
    setTimeout(() => setPersonalNote(""));
  };

  const updateLiveId = (e) => {
    const { value: id } = e.target;
    if (!/^\d+$/.test(id)) return;
    updateProperties({ liveId: id });
    setLiveIdEditor(false);
  };

  const toggleChain = (value) =>
    updateProperties({ updatedChainedTo: value, chainedTo });

  const hashtags = tags.map((tag) => `#${tag}`).join(" ");
  const rdySlug = `RDY${index}-${slug}`;
  const slugWithLiveId = `${liveId}-${slug}`;
  const addedDays = moment().diff(moment(createdAt), "days");

  if (view === "left") {
    return (
      <div className={`controls ${view}`}>
        <ControlsWrapper>
          <div className="header">
            <h4>Social status</h4>
          </div>
          <Radio.Group
            onChange={({ target: { value } }) =>
              updateProperties({ socialStatus: value })
            }
            value={socialStatus}
          >
            {["NONE", "READY", "POSTED"].map((state) => (
              <Radio className="radio-box" key={state} value={state}>
                {state}
              </Radio>
            ))}
          </Radio.Group>
        </ControlsWrapper>
        <ControlsWrapper>
          <h4>Rating</h4>
          <Rate
            value={rating || 0}
            onChange={(value) => updateProperties({ rating: value })}
          />
        </ControlsWrapper>
        <ControlsWrapper>
          <div className="header">
            <h4>Notes</h4>
            <Tag>
              {personalNotes.length ? `Total: ${personalNotes.length}` : null}
            </Tag>
          </div>
          <div className="notes-container">
            {personalNotes.length ? (
              personalNotes.map((note, index) => (
                <div key={note._id} className="note">
                  {`${index + 1}. ${note.content}`}
                </div>
              ))
            ) : (
              <div className="empty">Empty</div>
            )}
          </div>
          <div className="add-note-container">
            <TextArea
              rows={1}
              placeholder="Add Note.."
              value={personalNote}
              onChange={({ target: { value } }) => setPersonalNote(value)}
              onPressEnter={handleAddPersonalNote}
            />
          </div>
        </ControlsWrapper>
        {type !== "CHAIN" && (
          <ControlsWrapper>
            <div className="header">
              <h4>Chains</h4>
            </div>
            <Select
              mode="multiple"
              style={{ width: "100%" }}
              placeholder="Chains"
              value={chainedTo}
              onChange={toggleChain}
            >
              {chains.map(({ _id, title }) => (
                <Option key={_id} value={_id}>
                  {title}
                </Option>
              ))}
            </Select>
          </ControlsWrapper>
        )}
      </div>
    );
  }
  return (
    <div className={`controls ${view}`}>
      <ControlsWrapper>
        <div className="header">
          <h4>Status</h4>
          {liveId && (
            <Fragment>
              {liveIdEditor ? (
                <Input
                  style={{ width: "30px", height: "18px", fontSize: "1rem" }}
                  size="small"
                  defaultValue={liveId}
                  onBlur={updateLiveId}
                />
              ) : (
                <Tag
                  style={{ cursor: "pointer" }}
                  onDoubleClick={() => setLiveIdEditor(true)}
                >{`Live Id: ${liveId}`}</Tag>
              )}
            </Fragment>
          )}
        </div>
        <Radio.Group
          onChange={({ target: { value } }) =>
            updateProperties({ status: value })
          }
          value={status}
        >
          {statusFilter.map(({ label, value }) => (
            <Radio className="radio-box" key={value} value={value}>
              {label}
            </Radio>
          ))}
        </Radio.Group>
      </ControlsWrapper>

      <ControlsWrapper>
        <div className="slug" onClick={copy(rdySlug)}>
          {rdySlug}
        </div>
        {!!liveId && (
          <div className="slug" onClick={copy(slugWithLiveId)}>
            {slugWithLiveId}
          </div>
        )}
        <div className="header">
          <h4>Resources</h4>
          <Icon
            type="plus"
            className="icon-bg"
            size={10}
            onClick={() => dispatch(updateNote(note, "CREATE_RESOURCE"))}
          />
        </div>

        {resources.map((resource, index) => (
          <div key={resource} className="resource-id" onClick={copy(resource)}>
            {index + 1}
          </div>
        ))}

        <div className="divider"></div>

        <div className="header">
          <h4>Hashtags</h4>
          <Icon
            type="copy"
            className="icon-bg"
            onClick={() => copyToClipboard(hashtags.join(" "))}
          />
        </div>
        <div>
          {hashtags ? (
            <div className="hashtag">{hashtags}</div>
          ) : (
            <div className="empty">No Tags</div>
          )}
        </div>
        <div className="divider"></div>
        <div className="flex align-center">
          <span style={{ marginRight: "4px" }}>Visible</span>
          <Switch
            checked={visible}
            onChange={(value) => updateProperties({ visible: value })}
          />
        </div>
      </ControlsWrapper>
      <ControlsWrapper>
        <div>Added: {addedDays ? `${addedDays} day(s) ago` : "Today"}</div>
      </ControlsWrapper>
    </div>
  );
};

export default connect()(Controls);
