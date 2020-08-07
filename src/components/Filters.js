import React from "react";
import { Input, Select, Button } from "antd";
import { connect } from "react-redux";
import { setFilter, setActiveCollection } from "../store/actions";
import _ from "lodash";

const { Search } = Input;
const { Option } = Select;

const status = [
  { label: "ALL", value: "" },
  { label: "DRAFT", value: "DRAFT" },
  { label: "READY", value: "READY" },
  { label: "POSTED", value: "POSTED" },
];

const socialStatus = [
  { label: "NONE", value: "" },
  { label: "READY", value: "READY" },
  { label: "POSTED", value: "POSTED" },
];

const validateFilters = ({ socialStatus, status, search, tags = [] } = {}) =>
  socialStatus || status || search || tags.length;

const Filters = ({
  dispatch,
  filters,
  notes,
  meta,
  tags,
  activeCollection,
  session,
}) => {
  const setFilterValues = (filter) => dispatch(setFilter({ ...filter }));

  const setActive = (id) => {
    dispatch(setActiveCollection(id));
  };

  return (
    <div className="flex center align-center" style={{ flexShrink: 0 }}>
      <Select
        onChange={setActive}
        style={{ width: 120 }}
        placeholder="Collections"
        value={activeCollection}
      >
        {Object.entries(_.get(session, "notesApp", [])).map(([id, config]) => (
          <Option key={id} value={id}>
            {_.get(config, "name", "")}
          </Option>
        ))}
      </Select>
      <Search
        allowClear
        className="input-width"
        placeholder="Search..."
        defaultValue={filters.search}
        onSearch={(value) => setFilterValues({ search: value })}
      />
      <Select
        className="input-width"
        placeholder="Post Status"
        value={filters.status}
        onChange={(value) => setFilterValues({ status: value })}
      >
        {status.map(({ label, value }) => (
          <Option key={value} value={value}>
            {label}
          </Option>
        ))}
      </Select>
      <Select
        className="input-width"
        placeholder="Social Status"
        value={filters.socialStatus}
        onChange={(value) => setFilterValues({ socialStatus: value })}
      >
        {socialStatus.map(({ label, value }) => (
          <Option key={value} value={value}>
            {label}
          </Option>
        ))}
      </Select>
      <Select
        style={{ minWidth: "150px", margin: "2px" }}
        mode="multiple"
        placeholder="Tags"
        value={filters.tags}
        onChange={(values) => setFilterValues({ tags: values })}
      >
        {tags.map(({ label, value, _id }) => (
          <Option key={_id} value={value}>
            {label}
          </Option>
        ))}
      </Select>
      {!!validateFilters(filters) && (
        <Button
          type="dashed"
          onClick={() =>
            setFilterValues({
              tags: [],
              socialStatus: "",
              status: "",
              search: "",
            })
          }
        >
          Clear
        </Button>
      )}
      {meta && meta.count > 0 && (
        <span className="showingCount">
          Showing {notes.length} of {meta.count}
        </span>
      )}
    </div>
  );
};

const mapStateToProps = ({
  filters,
  notes,
  meta,
  tags,
  activeCollection,
  session,
}) => ({
  filters,
  notes,
  meta,
  tags,
  activeCollection,
  session,
});

export default connect(mapStateToProps)(Filters);
