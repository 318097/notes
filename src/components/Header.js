import React, { Fragment } from "react";
import styled from "styled-components";
import { connect } from "react-redux";
import { Spin, Icon, Divider, Popover, Switch } from "antd";
import { withRouter, Link } from "react-router-dom";

import { auth } from "../firebase";
import {
  setSession,
  toggleSettingsDrawer,
  setSettings
} from "../store/actions";

import AddNote from "./notes/AddNote";
import Filters from "./Filters";

import { StyledIcon, ProfileIcon } from "../styled";

const antIcon = <Icon type="loading" spin />;

const Container = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
  padding: 10px;
  position: sticky;
  top: 0;
  background: inherit;
  z-index: 10;
  h3 {
    flex: 1 1 auto;
    margin: 0;
    margin-left: 10px;
    text-transform: uppercase;
    transition: 2s;
    font-weight: bold;
    a {
      font-family: LuckiestGuy;
      color: #424242;
      & > span {
        font-family: LuckiestGuy;
        text-decoration: underline;
        font-size: 150%;
        color: #2b2b2b;
      }
    }
  }
  .filters {
    flex: 1 1 auto;
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
  background: #dcdcdc;
  padding: 0px 10px;
  margin: 0;
  margin-right: 6px;
  border-radius: 20px;
  position: relative;
  .username {
    margin: 0;
    margin-right: 9px;
    padding: 0 2px;
    position: relative;
    top: 2px;
    font-size: 13px;
    font-weight: bold;
    font-family: Saira;
  }
`;

const Header = ({ history, dispatch, appLoading, session, settings }) => {
  const signOut = async () => {
    await auth.signOut();
    dispatch(setSession(null));
    return history.push("/signin");
  };

  return (
    <Container>
      <h3>
        <Link to="/home">
          <span>N</span>otes {appLoading && <Spin indicator={antIcon} />}
        </Link>
      </h3>
      {session && (
        <Fragment>
          <Filters className="filters" />
          <div className="controls">
            <div>
              Server{" "}
              <Switch
                checked={settings.server === "server"}
                onChange={() =>
                  dispatch(
                    setSettings({
                      server:
                        settings.server === "server" ? "localhost" : "server"
                    })
                  )
                }
              />
            </div>
            <Popover placement="bottom" content="Home">
              <StyledIcon type="home" onClick={() => history.push("/home")} />
            </Popover>
            <AddNote />
            <Popover placement="bottom" content="Upload">
              <StyledIcon
                type="upload"
                onClick={() => history.push("/upload")}
              />
            </Popover>
            <Divider style={{ background: "black" }} type="vertical" />
            <UserInfo>
              <div className="username">{session.name}</div>
              <ProfileIcon>
                {session.photoURL ? (
                  <img src={session.photoURL} alt="Profile pic" />
                ) : (
                  <StyledIcon type="user" />
                )}
              </ProfileIcon>
            </UserInfo>
            <Popover placement="bottom" content="Settings">
              <StyledIcon
                type="setting"
                onClick={() => dispatch(toggleSettingsDrawer(true))}
              />
            </Popover>
            <Popover placement="bottom" content="Logout">
              <StyledIcon type="logout" onClick={signOut} />
            </Popover>
          </div>
        </Fragment>
      )}
    </Container>
  );
};

const mapStateToProps = ({ appLoading, session, settings }) => ({
  appLoading,
  session,
  settings
});

export default withRouter(connect(mapStateToProps)(Header));
