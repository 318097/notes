import React, { useState, useEffect } from "react";
import { Drawer, Tag, Input, Button, message } from "antd";
import { connect } from "react-redux";
import _ from "lodash";
import short from "short-uuid";
import { toggleSettingsDrawer, setSession } from "../store/actions";
import axios from "axios";
import SelectCollection from "./SelectCollection";

const { TextArea } = Input;

const Settings = ({
  settingsDrawerVisibility,
  session,
  activeCollection,
  toggleSettingsDrawer,
  setSession,
}) => {
  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(false);
  const [active, setActive] = useState(activeCollection);

  useEffect(() => {
    if (!session.notesApp) return;
    setCollections(Object.entries(session.notesApp));
  }, [session.notesApp]);

  const [settingId = "", settingData = {}] =
    collections.find(([id]) => id === active) || [];

  const handleClose = () => toggleSettingsDrawer(false);

  const saveSettings = async (data) => {
    setLoading(true);
    try {
      const updatedSettings = {
        ..._.get(session, "notesApp", {}),
        [settingId]: data,
      };
      const newSettings = {
        notesApp: updatedSettings,
      };
      await axios.put(`/users/${session._id}`, newSettings);
      await setSession(newSettings);
      message.success(`Settings updated.`);
      toggleSettingsDrawer();
    } catch (err) {
    } finally {
      setLoading(false);
    }
  };

  return (
    <Drawer
      title="Settings"
      placement="right"
      closable={true}
      onClose={handleClose}
      visible={settingsDrawerVisibility}
    >
      <Header
        setCollections={setCollections}
        active={active}
        setActive={setActive}
      />
      <CollectionInfo
        settingData={settingData}
        saveSettings={saveSettings}
        loading={loading}
      />
    </Drawer>
  );
};

const Header = ({ setCollections, active, setActive }) => {
  const addNewCollection = () => {
    const id = short.generate();
    const details = {
      tags: [],
      name: "Untitled",
      caption: "",
      index: 1,
      liveId: 1,
    };
    setCollections((prev) => [...prev, [id, details]]);
    setActive(id);
  };

  return (
    <div className="flex space-between mb">
      <SelectCollection collection={active} setCollection={setActive} />
      <Button onClick={addNewCollection} icon="plus"></Button>
    </div>
  );
};

const CollectionInfo = ({ settingData, saveSettings, loading }) => {
  const [data, setData] = useState({});
  const [newTag, setNewTag] = useState({ label: "", color: "" });

  useEffect(() => {
    if (!settingData) return;
    setData({ ...settingData });
  }, [settingData]);

  const handleChange = (update) => setData((prev) => ({ ...prev, ...update }));

  const addNewTag = () => {
    const tags = _.get(data, "tags");
    handleChange({ tags: [...tags, newTag] });
    setNewTag({ label: "", color: "" });
  };

  const { name = "", tags = [] } = data;
  return (
    <div className="settings-content">
      <div className="setting-group">
        <h6>Name</h6>
        <Input
          placeholder="title"
          value={name}
          onChange={(e) => handleChange({ name: e.target.value })}
        />
      </div>
      <div className="setting-group">
        <h6>Tags</h6>
        <div>
          {tags.map(({ label, color }) => (
            <Tag style={{ marginBottom: "6px" }} key={label} color={color}>
              {label}
            </Tag>
          ))}
        </div>
        <div className="add-tag">
          <div className="add-tag-form">
            <Input
              size="small"
              className="tag-input"
              placeholder="Tag name"
              value={newTag.label}
              onChange={({ target: { value } }) =>
                setNewTag((prev) => ({ ...prev, label: value }))
              }
            />
            <Input
              size="small"
              className="tag-input"
              placeholder="Color code"
              value={newTag.color}
              onChange={({ target: { value } }) =>
                setNewTag((prev) => ({ ...prev, color: value }))
              }
            />
          </div>
          <Button size="small" onClick={addNewTag}>
            Add
          </Button>
        </div>
      </div>
      <div className="setting-group">
        <h6>Caption</h6>
        <TextArea
          rows={6}
          placeholder="Caption"
          value={data.caption}
          onChange={(e) => handleChange({ caption: e.target.value })}
        />
      </div>
      <Button
        disabled={loading}
        type="primary"
        style={{ marginTop: "20px" }}
        onClick={() => saveSettings(data)}
      >
        Save
      </Button>
    </div>
  );
};

const mapStateToProps = ({
  session,
  settingsDrawerVisibility,
  activeCollection,
}) => ({
  session: session || {},
  settingsDrawerVisibility,
  activeCollection,
});

export default connect(mapStateToProps, {
  toggleSettingsDrawer,
  setSession,
})(Settings);
