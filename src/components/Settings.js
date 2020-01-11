import React, { useState, useEffect } from "react";
import { Drawer, Tag } from "antd";
import { connect } from "react-redux";
import axios from "axios";
import { Input, Button } from "antd";

import { toggleSettingsDrawer, setTags } from "../store/actions";

const Settings = ({
  settings,
  settingsDrawerVisibility,
  dispatch,
  tags,
  session
}) => {
  const [data, setData] = useState("");

  useEffect(() => {
    if (!session) return;
    const fetchTags = async () => {
      const {
        data: { tags }
      } = await axios.get("/posts/tags");
      dispatch(setTags(tags));
    };
    setTimeout(fetchTags, 5000);
  }, [session]);

  const handleClose = () => dispatch(toggleSettingsDrawer(false));

  const addTag = async () => {
    await axios.post("/posts/tags", { name: data });
    setData("");
  };

  return (
    <Drawer
      title="Settings"
      placement="bottom"
      closable={true}
      onClose={handleClose}
      visible={settingsDrawerVisibility}
    >
      <section>
        <h3>Tags</h3>
        {tags.map(tag => (
          <Tag key={tag.name}>{tag.name}</Tag>
        ))}
        <div style={{ marginTop: "3px" }}>
          <Input
            placehoder="Tag name"
            style={{ width: "150px" }}
            value={data}
            onChange={({ target: { value } }) => setData(value)}
          />
          <Button onClick={addTag}>Add</Button>
        </div>
      </section>
    </Drawer>
  );
};

const mapStateToProps = ({
  settings,
  settingsDrawerVisibility,
  tags,
  session
}) => ({
  settings,
  settingsDrawerVisibility,
  tags,
  session
});

export default connect(mapStateToProps)(Settings);
