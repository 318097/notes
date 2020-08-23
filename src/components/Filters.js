import React from "react";
import { Input, Select, Icon } from "antd";
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

const sortFilter = [
  { label: "NONE", value: "" },
  { label: "INDEX", value: "index" },
  { label: "LIVE ID", value: "liveId" },
  { label: "CREATED", value: "createdAt" },
];

const visibilityFilter = [
  { label: "ALL", value: "" },
  { label: "VISIBLE", value: "visible" },
  { label: "INVISIBLE", value: "invisible" },
];

const validateFilters = ({
  socialStatus,
  status,
  search,
  tags = [],
  sortFilter,
} = {}) =>
  socialStatus || status || search || tags.length || sortFilter !== "createdAt";

const Filters = ({
  dispatch,
  filters,
  notes,
  meta,
  activeCollection,
  session,
  settings,
}) => {
  const setFilterValues = (filter) => dispatch(setFilter({ ...filter }));

  const setActive = (id) => dispatch(setActiveCollection(id));

  const { tags = [] } = settings;
  return (
    <div className="flex center align-center" style={{ flexShrink: 0 }}>
      <Select
        onChange={setActive}
        className="input-width"
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
        style={{ minWidth: "100px", margin: "2px" }}
        mode="multiple"
        placeholder="Tags"
        value={filters.tags}
        onChange={(values) => setFilterValues({ tags: values })}
      >
        {tags.map(({ label }) => (
          <Option key={label} value={label}>
            {label}
          </Option>
        ))}
      </Select>
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
        className="input-width"
        placeholder="Sort"
        value={filters.sortFilter}
        onChange={(value) => setFilterValues({ sortFilter: value })}
      >
        {sortFilter.map(({ label, value }) => (
          <Option key={value} value={value}>
            {label}
          </Option>
        ))}
      </Select>
      <Select
        className="input-width"
        placeholder="Visibility"
        value={filters.visibility}
        onChange={(value) => setFilterValues({ visibility: value })}
      >
        {visibilityFilter.map(({ label, value }) => (
          <Option key={value} value={value}>
            {label}
          </Option>
        ))}
      </Select>
      {!!validateFilters(filters) && (
        <Icon
          style={{ margin: "0 4px" }}
          className="icon"
          type="close"
          onClick={() =>
            setFilterValues({
              tags: [],
              socialStatus: "",
              status: "",
              search: "",
              visibility: "visible",
              sortOrder: "DESC",
              sortFilter: "createdAt",
            })
          }
        />
      )}

      <Icon
        style={{ margin: "0 4px" }}
        className="icon"
        onClick={() =>
          setFilterValues({
            sortOrder: filters.sortOrder === "ASC" ? "DESC" : "ASC",
          })
        }
        type={
          filters.sortOrder === "ASC" ? "sort-ascending" : "sort-descending"
        }
      />

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
  activeCollection,
  session,
  settings,
}) => ({
  filters,
  notes,
  meta,
  activeCollection,
  session,
  settings,
});

export default connect(mapStateToProps)(Filters);
