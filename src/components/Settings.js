import React, { useState, useEffect } from "react";
import { Drawer, Tag, Input, Button, message } from "antd";
import { connect } from "react-redux";
import _ from "lodash";
import short from "short-uuid";
import { toggleSettingsDrawer, setSession } from "../store/actions";
import axios from "axios";
import SelectCollection from "./SelectCollection";

const { TextArea } = Input;

const DEFAULT_SETTING_STATE = {
  tags: [],
  name: "Untitled",
  caption: "",
  index: 1,
  liveId: 1,
};

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
  const [showJSON, setShowJSON] = useState(true);

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
      width={400}
      title="Settings"
      className="react-ui"
      placement="right"
      closable={true}
      onClose={handleClose}
      visible={settingsDrawerVisibility}
    >
      <Header
        setCollections={setCollections}
        active={active}
        setActive={setActive}
        showJSON={showJSON}
        setShowJSON={setShowJSON}
      />
      {showJSON ? (
        <JSONView
          settingData={settingData}
          saveSettings={saveSettings}
          loading={loading}
        />
      ) : (
        <CollectionInfo
          settingData={settingData}
          saveSettings={saveSettings}
          loading={loading}
        />
      )}
    </Drawer>
  );
};

const Header = ({
  setCollections,
  active,
  setActive,
  showJSON,
  setShowJSON,
}) => {
  const addNewCollection = () => {
    const id = short.generate();
    setCollections((prev) => [...prev, [id, DEFAULT_SETTING_STATE]]);
    setActive(id);
  };

  return (
    <div className="flex space-between mb">
      <SelectCollection collection={active} setCollection={setActive} />
      <div className="fcc">
        <Button
          type={showJSON ? "primary" : "dashed"}
          className="mr"
          onClick={() => setShowJSON((prev) => !prev)}
        >
          JSON
        </Button>
        <Button onClick={addNewCollection} icon="plus"></Button>
      </div>
    </div>
  );
};

const JSONView = ({ settingData, saveSettings, loading }) => {
  const [data, setData] = useState({});

  useEffect(() => {
    if (!settingData) return;
    setData(JSON.stringify(settingData, undefined, 2));
  }, [settingData]);

  const validateJSON = () => {
    try {
      JSON.parse(data);
    } catch (err) {
      message.error("Invalid JSON");
    }
  };

  return (
    <div className="settings-content">
      <TextArea
        rows={24}
        value={data}
        onChange={(e) => setData(e.target.value)}
        onBlur={validateJSON}
      />
      <Button
        disabled={loading}
        type="primary"
        className="mt"
        onClick={() => saveSettings(JSON.parse(data))}
      >
        Save
      </Button>
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
              placeholder="Tag name"
              value={newTag.label}
              onChange={({ target: { value } }) =>
                setNewTag((prev) => ({ ...prev, label: value }))
              }
            />
            <input
              type="color"
              className="color-input"
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
