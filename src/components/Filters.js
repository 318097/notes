import React from "react";
import { Input, Select, Icon } from "antd";
import { connect } from "react-redux";
import { setFilter, setKey } from "../store/actions";
import SelectCollection from "./SelectCollection";
import config from "../config";
import {
  statusFilter,
  socialStatusFilter,
  noteType,
  sortFilter,
  visibilityFilter,
  ratingsFilter,
} from "../constants";

const { Search } = Input;
const { Option } = Select;

const validateFilters = ({
  socialStatus,
  status,
  search,
  tags = [],
  sortFilter,
  rating,
  type,
} = {}) =>
  socialStatus ||
  status ||
  search ||
  tags.length ||
  sortFilter !== "createdAt" ||
  rating ||
  type;

const Filters = ({
  dispatch,
  filters,
  notes,
  meta,
  activeCollection,
  settings,
  displayType,
  showAllFilters,
}) => {
  const setFilterValues = (filter) => {
    const props = Object.entries(filter);
    let extraFilters = {};
    if (props.length === 1) {
      const [key, value] = props[0];
      if (key === "status" && value === "POSTED")
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
        onClick={() => dispatch(setKey({ showAllFilters: !showAllFilters }))}
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
        allowClear
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
          allowClear
          className="input-width"
          style={{ width: "66px" }}
          placeholder="Note Type"
          value={filters.type}
          onChange={(value) => setFilterValues({ type: value })}
        >
          {noteType.map(({ label, value }) => (
            <Option key={value} value={value}>
              {label}
            </Option>
          ))}
        </Select>
      )}
      {showAllFilters && (
        <Select
          allowClear
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
        allowClear
        className="input-width"
        placeholder="Post Status"
        value={filters.status}
        onChange={(value) => setFilterValues({ status: value })}
      >
        {statusFilter.map(({ label, value }) => (
          <Option key={value} value={value}>
            {label}
          </Option>
        ))}
      </Select>
      {showAllFilters && (
        <Select
          allowClear
          className="input-width"
          placeholder="Social Status"
          value={filters.socialStatus}
          onChange={(value) => setFilterValues({ socialStatus: value })}
        >
          {socialStatusFilter.map(({ label, value }) => (
            <Option key={value} value={value}>
              {label}
            </Option>
          ))}
        </Select>
      )}
      <Select
        allowClear
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
          allowClear
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
              tags: undefined,
              socialStatus: undefined,
              status: undefined,
              search: undefined,
              rating: undefined,
              type: undefined,
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
        <span className="showing-count">
          {displayType === "CARD"
            ? `${notes.length}/${meta.count}`
            : `${filters.page}/${Math.ceil(meta.count / config.LIMIT)}`}
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
  settings,
  displayType,
  showAllFilters,
}) => ({
  filters,
  notes,
  meta,
  activeCollection,
  settings,
  displayType,
  showAllFilters,
});

export default connect(mapStateToProps)(Filters);
