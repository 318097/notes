import React, { Fragment } from "react";
import { Popover, Icon as AntIcon } from "antd";

import { StyledIcon } from "../styled";

const Icon = ({ label, type, onClick, ...props }) => (
  <Fragment>
    {label ? (
      <Popover placement="bottom" content={label}>
        <StyledIcon type={type} onClick={onClick} {...props} />
      </Popover>
    ) : (
      <AntIcon type={type} onClick={onClick} {...props} />
    )}
  </Fragment>
);

export default Icon;
