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
import { initialState } from "../store/reducer";

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
    <div className="flex center" style={{ flexShrink: 0 }}>
      <SelectCollection
        style={{ margin: "2px" }}
        collection={activeCollection}
        resetFilter={true}
        setFilterValues={() => setFilterValues({ ...initialState.filters })}
      />
      {showAllFilters && (
        <Search
          allowClear
          style={{ width: "120px" }}
          className="form-field"
          placeholder="Search..."
          defaultValue={filters.search}
          onSearch={(value) => setFilterValues({ search: value })}
        />
      )}
      <Select
        allowClear
        style={{ minWidth: "100px", width: "auto" }}
        className="form-field"
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
          className="form-field"
          style={{ width: "76px" }}
          placeholder="Type"
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
          className="form-field"
          style={{ width: "90px" }}
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
        className="form-field"
        placeholder="Status"
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
          className="form-field"
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
        className="form-field"
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
          className="form-field"
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
              sortFilter: "index",
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

      {meta && meta.count > 0 && (
        <span className="showing-count">
          {displayType === "CARD"
            ? `${notes.length}/${meta.count}`
            : `${filters.page}/${Math.ceil(meta.count / config.LIMIT)}`}
        </span>
      )}
      <Icon
        type={showAllFilters ? "double-left" : "double-right"}
        className="icon icon-bg"
        onClick={() => dispatch(setKey({ showAllFilters: !showAllFilters }))}
      />
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
