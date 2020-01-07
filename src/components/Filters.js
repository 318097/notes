import React from "react";
import { Input, Select } from "antd";
import { connect } from "react-redux";
import { setFilter } from "../store/actions";

const { Search } = Input;
const { Option } = Select;

const status = ["ALL", "DRAFT", "READY", "POSTED"];

const Filters = ({ dispatch, session, filters }) => {
  const setFilterValues = (key, value) => dispatch(setFilter({ [key]: value }));

  return (
    <div className="flex align-center">
      <Search
        allowClear
        className="input-width"
        placeholder="Search..."
        defaultValue={filters.search}
        onSearch={value => setFilterValues("search", value)}
      />
      <Select
        className="input-width"
        placeholder="Status"
        value={filters.status}
        onChange={value => setFilterValues("status", value)}
      >
        {status.map(state => (
          <Option key={state}>{state}</Option>
        ))}
      </Select>
    </div>
  );
};

const mapStateToProps = ({ session, filters }) => ({ session, filters });

export default connect(mapStateToProps)(Filters);
