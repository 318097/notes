import React from "react";
import { Input, Select } from "antd";
import { connect } from "react-redux";
import { setFilter } from "../store/actions";

const { Search } = Input;
const { Option } = Select;

const status = ["ALL", "DRAFT", "READY", "POSTED"];
const socialStatus = ["NONE", "DRAFT", "READY", "POSTED"];

const Filters = ({ dispatch, filters, notes, meta, tags }) => {
  const setFilterValues = (key, value) => dispatch(setFilter({ [key]: value }));

  return (
    <div className="flex center align-center" style={{ flexShrink: 0 }}>
      <Search
        allowClear
        className="input-width"
        placeholder="Search..."
        defaultValue={filters.search}
        onSearch={value => setFilterValues("search", value)}
      />
      <Select
        className="input-width"
        placeholder="Post Status"
        value={filters.status}
        onChange={value => setFilterValues("status", value)}
      >
        {status.map(state => (
          <Option key={state}>{state}</Option>
        ))}
      </Select>
      <Select
        className="input-width"
        placeholder="Social Status"
        value={filters.socialStatus}
        onChange={value => setFilterValues("socialStatus", value)}
      >
        {socialStatus.map(state => (
          <Option key={state}>{state}</Option>
        ))}
      </Select>
      <Select
        style={{ minWidth: "150px", margin: "2px" }}
        mode="multiple"
        placeholder="Tags"
        value={filters.tags}
        onChange={values => setFilterValues("tags", values)}
      >
        {tags.map(({ label, value, _id }) => (
          <Option key={_id} value={value}>
            {label}
          </Option>
        ))}
      </Select>
      <span className="showingCount">
        Showing {notes.length} of {meta && meta.count}
      </span>
    </div>
  );
};

const mapStateToProps = ({ filters, notes, meta, tags }) => ({
  filters,
  notes,
  meta,
  tags
});

export default connect(mapStateToProps)(Filters);
