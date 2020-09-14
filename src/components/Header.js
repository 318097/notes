import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { connect } from "react-redux";
import { Divider } from "antd";
import { withRouter, Link } from "react-router-dom";
import colors, { Icon } from "@codedrops/react-ui";
import { Icon as AntIcon } from "antd";
import _ from "lodash";
import Filters from "./Filters";

import {
  logout,
  toggleSettingsDrawer,
  setModalMeta,
  toggleStatsModal,
} from "../store/actions";

const Container = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 16px 12px;
  position: sticky;
  top: 0;
  z-index: 10;
  h3 {
    margin: 0;
    margin-left: 10px;
    a {
      color: ${colors.bar};
      text-transform: uppercase;
      font-family: RobotoMonoSemiBold;
      & > span {
        font-family: RobotoMonoBold;
        text-decoration: underline;
        font-size: 2rem;
        color: ${colors.bar};
      }
    }
  }
  .controls {
    flex: 0 0 auto;
    display: flex;
    align-items: center;
  }
`;

const UserInfo = styled.div`
  display: flex;
  height: 24px;
  padding: 0;
  margin: 0;
  margin-right: 6px;
  border-radius: 20px;
  background: #f3f3f3;
  align-items: center;
  .profile-icon {
    right: -4px;
    position: relative;
    top: 1;
  }
  .username {
    padding: 0 8px;
    text-transform: uppercase;
    font-size: 1rem;
  }
`;

const Header = ({ history, dispatch, session }) => {
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    setShowFilters(_.get(history, "location.pathname") === "/home");
  }, [history.location.pathname]);

  return (
    <Container>
      <h3>
        <Link to="/home">
          <span>N</span>otes App
        </Link>
      </h3>
      {showFilters && <Filters />}
      {session && (
        <div className="controls">
          <Icon background type="home" onClick={() => history.push("/home")} />
          <Icon
            background
            type="plus"
            onClick={() => dispatch(setModalMeta({ visibility: true }))}
          />
          <Icon
            background
            type="upload"
            onClick={() => history.push("/upload")}
          />
          <AntIcon
            className="stats-icon"
            type="line-chart"
            onClick={() => dispatch(toggleStatsModal(true))}
          />
          <Divider type="vertical" />

          <UserInfo>
            <div className="username">{session.name}</div>
            {/* <Icon className="profile-icon" type="user" /> */}
          </UserInfo>
          <Icon
            background
            type="settings"
            onClick={() => dispatch(toggleSettingsDrawer(true))}
          />
          <Icon background type="logout" onClick={() => dispatch(logout())} />
        </div>
      )}
    </Container>
  );
};

const mapStateToProps = ({ session, settings }) => ({
  session,
  settings,
});

export default withRouter(connect(mapStateToProps)(Header));
