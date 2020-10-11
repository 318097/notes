import React from "react";
import styled from "styled-components";
import { connect } from "react-redux";
import { Divider } from "antd";
import colors, { Icon } from "@codedrops/react-ui";
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
  justify-content: flex-end;
  padding: 20px 10px;
  background: ${colors.bar};
  .icon,
  .ant-icon {
    background: ${colors.bg};
    margin: 4px 0;
    height: 24px;
    width: 24px;
    border-radius: 50%;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    &:hover {
      background: ${colors.strokeTwo};
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
      <Icon background type="home" onClick={() => history.push("/home")} />
      <AntIcon
        className="ant-icon"
        type="line-chart"
        onClick={() => toggleStatsModal(true)}
      />
      <Divider />
      <Icon
        background
        type="plus"
        onClick={() => setModalMeta({ visibility: true })}
      />
      <AntIcon
        className="ant-icon"
        type="fire"
        onClick={() => setQuickAddModalMeta({ visibility: true })}
      />
      <Icon background type="upload" onClick={() => history.push("/upload")} />

      <Divider />
      <Icon
        background
        type="settings"
        onClick={() => toggleSettingsDrawer(true)}
      />
      <Icon background type="logout" onClick={() => logout()} />
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
