import React from "react";
import styled from "styled-components";
import Filters from "./Filters";

const Container = styled.header`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  padding: 8px 28px 12px;
  position: sticky;
  top: 0;
  z-index: 10;
`;

const Header = () =>
  ["home", "stats"].includes(window.location.pathname.slice(1)) ? (
    <Container>
      <Filters />
    </Container>
  ) : null;

export default Header;
