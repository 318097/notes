import React, { useState } from "react";
import { Input, Select, Icon } from "antd";
import { connect } from "react-redux";
import { setFilter, setKey } from "../store/actions";
import SelectCollection from "./SelectCollection";

const { Search } = Input;
const { Option } = Select;

const status = [
  { label: "ALL", value: "" },
  { label: "QUICK ADD", value: "QUICK_ADD" },
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
  { label: "RATING", value: "rating" },
  { label: "LIVE ID", value: "liveId" },
  { label: "CREATED", value: "createdAt" },
];

const visibilityFilter = [
  { label: "ALL", value: "" },
  { label: "VISIBLE", value: "visible" },
  { label: "INVISIBLE", value: "invisible" },
];

const ratingsFilter = [
  { label: "ALL", value: "" },
  { label: "5", value: "5" },
  { label: "4", value: "4" },
  { label: "3", value: "3" },
  { label: "2", value: "2" },
  { label: "1", value: "1" },
];

const validateFilters = ({
  socialStatus,
  status,
  search,
  tags = [],
  sortFilter,
  rating,
} = {}) =>
  socialStatus ||
  status ||
  search ||
  tags.length ||
  sortFilter !== "createdAt" ||
  rating;

const Filters = ({
  dispatch,
  filters,
  notes,
  meta,
  activeCollection,
  settings,
  displayType,
}) => {
  const [showAllFilters, setShowAllFilters] = useState(false);

  const setFilterValues = (filter) => {
    const props = Object.entries(filter);
    let extraFilters = {};
    if (props.length === 1) {
      const [key, value] = props[0];
      if (key === "search" && value)
        extraFilters = { status: "", visibility: "" };
      else if (key === "status" && value === "POSTED")
        extraFilters = { sortFilter: "liveId", sortOrder: "DESC" };
      else if (key === "status") extraFilters = { sortFilter: "createdAt" };
    }
    dispatch(setFilter({ ...filter, ...extraFilters }));
  };

  const { tags = [] } = settings;
  return (
    <div className="flex center align-center" style={{ flexShrink: 0 }}>
      <Icon
        type={showAllFilters ? "double-right" : "double-left"}
        className="icon icon-bg"
        onClick={() => setShowAllFilters((prev) => !prev)}
      />
      <Icon
        style={{ margin: "0 4px" }}
        className="icon icon-bg"
        type={displayType === "CARD" ? "table" : "border"}
        onClick={() =>
          dispatch(
            setKey({ displayType: displayType === "CARD" ? "TABLE" : "CARD" })
          )
        }
      />
      <SelectCollection collection={activeCollection} />
      {showAllFilters && (
        <Search
          allowClear
          className="input-width"
          placeholder="Search..."
          defaultValue={filters.search}
          onSearch={(value) => setFilterValues({ search: value })}
        />
      )}
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
      {showAllFilters && (
        <Select
          className="input-width"
          style={{ width: "66px" }}
          placeholder="Rating"
          value={filters.rating}
          onChange={(value) => setFilterValues({ rating: value })}
        >
          {ratingsFilter.map(({ label, value }) => (
            <Option key={value} value={value}>
              {label}
            </Option>
          ))}
        </Select>
      )}
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
      {showAllFilters && (
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
      )}
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
      {showAllFilters && (
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
      )}
      {!!validateFilters(filters) && (
        <Icon
          style={{ margin: "0 4px" }}
          className="icon icon-bg"
          type="close"
          onClick={() =>
            setFilterValues({
              tags: [],
              socialStatus: "",
              status: "",
              search: "",
              rating: "",
              visibility: "visible",
              sortOrder: "DESC",
              sortFilter: "createdAt",
            })
          }
        />
      )}

      <Icon
        style={{ margin: "0 4px" }}
        className="icon icon-bg"
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
        <span className="showing-count">{`${notes.length}/${meta.count}`}</span>
      )}
    </div>
  );
};

const mapStateToProps = ({
  filters,
  notes,
  meta,
  activeCollection,
  settings,
  displayType,
}) => ({
  filters,
  notes,
  meta,
  activeCollection,
  settings,
  displayType,
});

export default connect(mapStateToProps)(Filters);
