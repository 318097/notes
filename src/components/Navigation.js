import React from "react";
import styled from "styled-components";
import { connect } from "react-redux";
import { Divider } from "antd";
import colors from "@codedrops/react-ui";
import { Icon as AntIcon } from "antd";
import { withRouter } from "react-router-dom";
import {
  logout,
  toggleSettingsDrawer,
  setModalMeta,
  toggleStatsModal,
  setQuickAddModalMeta,
} from "../store/actions";

const StyledNavigation = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  background: ${colors.bar};
  padding: 10px;
  .app-name {
    color: ${colors.white};
    font-size: 2.6rem;
    position: relative;
    top: -4px;
  }
  nav {
    display: flex;
    flex-direction: column;
    .ant-icon {
      color: ${colors.chrome};
      height: 24px;
      width: 24px;
      font-size: 20px;
      margin-top: 10px;
      &:hover {
        color: ${colors.orange};
      }
    }
  }
`;

const Navigation = ({
  logout,
  toggleSettingsDrawer,
  setModalMeta,
  toggleStatsModal,
  setQuickAddModalMeta,
  history,
  session,
}) => {
  if (!session) return null;

  return (
    <StyledNavigation>
      <div className="app-name">N</div>
      <nav>
        <AntIcon
          className="ant-icon"
          type="home"
          onClick={() => history.push("/home")}
        />
        <AntIcon
          className="ant-icon"
          type="line-chart"
          onClick={() => toggleStatsModal(true)}
        />
        <Divider />
        <AntIcon
          className="ant-icon"
          type="plus"
          onClick={() => setModalMeta({ visibility: true })}
        />
        <AntIcon
          className="ant-icon"
          type="fire"
          onClick={() => setQuickAddModalMeta({ visibility: true })}
        />
        <AntIcon
          className="ant-icon"
          type="upload"
          onClick={() => history.push("/upload")}
        />

        <Divider />
        <AntIcon
          className="ant-icon"
          type="setting"
          onClick={() => toggleSettingsDrawer(true)}
        />
        <AntIcon className="ant-icon" type="logout" onClick={() => logout()} />
      </nav>
    </StyledNavigation>
  );
};

const mapStateToProps = ({ session }) => ({
  session,
});

const mapDispatchToProps = {
  logout,
  toggleSettingsDrawer,
  setModalMeta,
  toggleStatsModal,
  setQuickAddModalMeta,
};

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(Navigation)
);
