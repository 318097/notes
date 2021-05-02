import React from "react";
import { Card } from "antd";
import styled from "styled-components";

const StyledCard = styled(Card)`
  display: flex;
  height: 300px;
  align-items: center;
  justify-content: center;
  img {
    max-width: 100%;
  }
`;

const ImageCard = ({ raw }) => {
  const src = raw;

  return (
    <StyledCard size="small">
      <img alt="resource" src={src} />
    </StyledCard>
  );
};

export default ImageCard;
