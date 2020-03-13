import React from "react";
import { StyledIcon } from "../styled";

const Icon = ({ type, onClick, ...props }) => (
  <StyledIcon type={type} onClick={onClick} {...props} />
);

export default Icon;
