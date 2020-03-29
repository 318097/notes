import React from "react";
import styled from "styled-components";
import { connect } from "react-redux";
import { Spin, Divider, Switch, Icon as AntIcon } from "antd";
import { withRouter, Link } from "react-router-dom";

import {
  setSession,
  toggleSettingsDrawer,
  setModalMeta
} from "../store/actions";
import Icon from "./Icon";

const antIcon = <AntIcon type="loading" spin />;

const Container = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 4px;
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
      color: #424242;
      & > span {
        text-decoration: underline;
        font-size: 2.4rem;
        color: #2b2b2b;
      }
    }
  }
  .controls {
    flex: 0 0 auto;
    display: flex;
    align-items: center;
  }
`;

// const UserInfo = styled.div`
//   display: flex;
//   height: 24px;
//   padding: 0px 10px;
//   margin: 0;
//   margin-right: 6px;
//   border-radius: 20px;
//   position: relative;
//   .username {
//     margin: 0;
//     margin-right: 9px;
//     padding: 0 2px;
//     position: relative;
//     top: 2px;
//     font-size: 1.2rem;
//     font-weight: bold;
//   }
// `;

const Header = ({ history, dispatch, appLoading, session }) => {
  const signOut = async () => {
    dispatch(setSession(null));
    sessionStorage.clear();
    return history.push("/signin");
  };

  return (
    <Container>
      <h3>
        <Link to="/home">
          <span>N</span>otes App {appLoading && <Spin indicator={antIcon} />}
        </Link>
      </h3>
      {session && (
        <div className="controls">
          <Icon type="home" onClick={() => history.push("/home")} />
          <Icon
            type="plus"
            onClick={() => dispatch(setModalMeta({ visibility: true }))}
          />
          <Icon type="upload" onClick={() => history.push("/upload")} />
          <Divider type="vertical" />
          {/* <div>
            Server{" "}
            <Switch
              checked={session.serverUrl === "server"}
              onChange={() => {
                const newValue =
                  session.serverUrl === "server" ? "localhost" : "server";
                dispatch(setSession({ serverUrl: newValue }));
                sessionStorage.setItem("serverUrl", newValue);
              }}
            />
          </div> */}
          {/* 
          <UserInfo>
            <div className="username">{session.name}</div>
             <ProfileIcon>
              {session.photoURL ? (
                <img src={session.photoURL} alt="Profile pic" />
              ) : (
                <Icon type="user" />
              )}
            </ProfileIcon>
          </UserInfo> */}
          <Icon
            type="setting"
            onClick={() => dispatch(toggleSettingsDrawer(true))}
          />
          <Icon type="logout" onClick={signOut} />
        </div>
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
