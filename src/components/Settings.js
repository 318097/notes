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
  const [data, setData] = useState("");

  useEffect(() => {
    const fetchTags = async () => {
      const {
        data: { tags }
      } = await axios.get("/posts/tags");
      dispatch(
        setTags(
          tags.map(({ _id, color, name }) => ({
            _id,
            color,
            label: name.toUpperCase(),
            value: name
          }))
        )
      );
    };
    if (!session) return;
    fetchTags();
  }, [session]);

  const handleClose = () => dispatch(toggleSettingsDrawer(false));

  const addTag = async () => {
    await axios.post("/posts/tags", { name: data });
    setData("");
  };

  return (
    <Drawer
      title="Settings"
      placement="right"
      closable={true}
      onClose={handleClose}
      visible={settingsDrawerVisibility}
    >
      <Wrapper>
        <h3>Tags</h3>
        {tags.map(({ label }) => (
          <Tag key={label}>{label}</Tag>
        ))}
        <div style={{ marginTop: "8px" }}>
          <Input
            placehoder="Tag name"
            style={{ width: "150px" }}
            value={data}
            onChange={({ target: { value } }) => setData(value)}
          />
          <Button onClick={addTag}>Add</Button>
        </div>
      </Wrapper>
    </Drawer>
  );
};

const mapStateToProps = ({ session, settingsDrawerVisibility, tags }) => ({
  session,
  settingsDrawerVisibility,
  tags
});

export default connect(mapStateToProps)(Settings);
