import React from "react";
import styled from "styled-components";
import { connect } from "react-redux";
import { Spin, Divider, Icon as AntIcon } from "antd";
import { withRouter, Link } from "react-router-dom";

import {
  setSession,
  toggleSettingsDrawer,
  setModalMeta,
} from "../store/actions";
import colors, { Icon } from "@codedrops/react-ui";

const antIcon = <AntIcon type="loading" spin />;

const Container = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 4px 16px;
  position: sticky;
  top: 0;
  z-index: 10;
  h3 {
    flex: 1 1 auto;
    margin: 0;
    margin-left: 10px;
    text-transform: uppercase;
    transition: 2s;
    font-weight: bold;
    a {
      color: ${colors.bar};
      & > span {
        text-decoration: underline;
        font-size: 2.4rem;
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
  background: lightgrey;
  align-items: center;
  .profile-icon {
    right: -4px;
    position: relative;
    top: 1;
  }
  .username {
    padding: 0 8px;
    text-transform: uppercase;
    font-size: 1.2rem;
  }
`;

const Header = ({ history, dispatch, appLoading, session, loading }) => {
  const signOut = async () => {
    dispatch(setSession(null));
    sessionStorage.clear();
    return history.push("/signin");
  };

  return (
    <Container>
      <h3>
        <Link to="/home">
          <span>N</span>otes App{" "}
          {(appLoading || loading) && <Spin indicator={antIcon} />}
        </Link>
      </h3>
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
          <Icon background type="logout" onClick={signOut} />
        </div>
      )}
    </Container>
  );
};

const mapStateToProps = ({ appLoading, session, settings }) => ({
  appLoading,
  session,
  settings,
});

export default withRouter(connect(mapStateToProps)(Header));
