import React from "react";
import styled from "styled-components";
import { connect } from "react-redux";
import Filters from "./Filters";

const Container = styled.header`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  padding: 8px 16px 12px;
  position: sticky;
  top: 0;
  z-index: 10;
`;

const Header = ({ activePage }) =>
  ["home", "stats"].includes(activePage) ? (
    <Container>{<Filters />}</Container>
  ) : null;

const mapStateToProps = ({ activePage }) => ({ activePage });

export default connect(mapStateToProps)(Header);
