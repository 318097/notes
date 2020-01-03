import React, { useState, useEffect } from "react";
import { Input, Select } from "antd";
import { connect } from "react-redux";
import { fetchNotes } from "../store/actions";

const { Search } = Input;
const { Option } = Select;

const status = ["ALL", "DRAFT", "READY", "POSTED"];

const Filters = ({ dispatch, session }) => {
  const [filters, setFilters] = useState({
    search: "",
    status: "ALL"
  });

  useEffect(() => {
    if (session) dispatch(fetchNotes(filters));
  }, [session, filters]);

  const setFilterValues = (key, value) =>
    setFilters(prev => ({ ...prev, [key]: value }));

  return (
    <div className="flex align-center">
      <Search
        allowClear
        className="input-width"
        placeholder="Search..."
        defaultValue={filters && filters.search}
        onSearch={value => setFilterValues("search", value)}
      />
      <Select
        className="input-width"
        placeholder="Status"
        value={filters && filters.status}
        onChange={value => setFilterValues("status", value)}
      >
        {status.map(state => (
          <Option key={state}>{state}</Option>
        ))}
      </Select>
    </div>
  );
};

const mapStateToProps = ({ session }) => ({ session });

export default connect(mapStateToProps)(Filters);
