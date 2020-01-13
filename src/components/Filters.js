import React from "react";
import { Input, Select } from "antd";
import { connect } from "react-redux";
import { setFilter } from "../store/actions";

import { tagList } from "../utils";

const { Search } = Input;
const { Option } = Select;

const status = ["ALL", "DRAFT", "READY", "POSTED"];
const socialStatus = ["NONE", "DRAFT", "READY", "POSTED"];

const Filters = ({ dispatch, session, filters, notes, meta }) => {
  const setFilterValues = (key, value) => dispatch(setFilter({ [key]: value }));

  return (
    <div className="flex center align-center" style={{ margin: "5px" }}>
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
        style={{ minWidth: "150px", margin: "0 2px" }}
        mode="multiple"
        placeholder="Tags"
        value={filters.tags}
        onChange={values => setFilterValues("tags", values)}
      >
        {tagList.map(({ label, value }) => (
          <Option key={value} value={value}>
            {label}
          </Option>
        ))}
      </Select>
      <span>
        Showing {notes.length} of {meta && meta.count}
      </span>
    </div>
  );
};

const mapStateToProps = ({ session, filters, notes, meta }) => ({
  session,
  filters,
  notes,
  meta
});

export default connect(mapStateToProps)(Filters);
