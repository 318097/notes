import React from "react";
import { connect } from "react-redux";
import { Select } from "antd";
import _ from "lodash";
import { setActiveCollection } from "../store/actions";

const { Option } = Select;

const SelectCollection = ({
  collection,
  session,
  setActiveCollection,
  setCollection,
}) => {
  const handleChange = (id) => {
    setCollection ? setCollection(id) : setActiveCollection(id);
  };

  return (
    <Select
      onChange={handleChange}
      style={{ width: 120 }}
      placeholder="Collections"
      value={collection}
    >
      {Object.entries(_.get(session, "notesApp", [])).map(([id, config]) => (
        <Option key={id} value={id}>
          {_.get(config, "name", "")}
        </Option>
      ))}
    </Select>
  );
};

const mapStateToProps = ({ session }) => ({
  session,
});

const mapDispatchToProps = {
  setActiveCollection,
};

export default connect(mapStateToProps, mapDispatchToProps)(SelectCollection);
