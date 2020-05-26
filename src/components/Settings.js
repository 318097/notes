import React, { useState, useEffect } from "react";
import { Drawer, Tag, Input, Button } from "antd";
import { connect } from "react-redux";
import axios from "axios";
import styled from "styled-components";

import { toggleSettingsDrawer, setTags } from "../store/actions";

const Wrapper = styled.div`
  .ant-tag {
    margin: 2px 4px 2px 0;
  }
`;

const Settings = ({ session, settingsDrawerVisibility, dispatch, tags }) => {
  const handleClose = () => dispatch(toggleSettingsDrawer(false));
  return (
    <Drawer
      title="Settings"
      placement="right"
      closable={true}
      onClose={handleClose}
      visible={settingsDrawerVisibility}
    >
      <TagsList session={session} dispatch={dispatch} tags={tags} />
    </Drawer>
  );
};

const TagsList = ({ session, dispatch, tags }) => {
  const [data, setData] = useState({});

  useEffect(() => {
    if (!session) return;
    fetchTags();
  }, [session]);

  const fetchTags = async () => {
    const {
      data: { tags },
    } = await axios.get("/posts/tags");
    dispatch(
      setTags(
        tags.map(({ _id, color, name }) => ({
          _id,
          color,
          label: name.toUpperCase(),
          value: name,
        }))
      )
    );
  };

  const addTag = async () => {
    await axios.post("/posts/tags", { ...data });
    setData({});
    fetchTags();
  };
  return (
    <Wrapper>
      <h3>Tags</h3>
      {tags.map(({ label, color }) => (
        <Tag key={label} color={color}>
          {label}
        </Tag>
      ))}
      <div style={{ marginTop: "8px" }}>
        <Input
          placeholder="Tag name"
          value={data.name}
          onChange={({ target: { value } }) =>
            setData((prev) => ({ ...prev, name: value }))
          }
        />
        <br />
        <Input
          placeholder="Color code"
          value={data.color}
          onChange={({ target: { value } }) =>
            setData((prev) => ({ ...prev, color: value }))
          }
        />
        <br />
        <Button onClick={addTag}>Add</Button>
      </div>
    </Wrapper>
  );
};

const mapStateToProps = ({ session, settingsDrawerVisibility, tags }) => ({
  session,
  settingsDrawerVisibility,
  tags,
});

export default connect(mapStateToProps)(Settings);
