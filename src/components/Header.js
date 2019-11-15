import React from 'react'
import styled from 'styled-components';
import { connect } from 'react-redux';
import { Spin, Icon, Divider } from 'antd';
import { withRouter } from 'react-router-dom';

import { auth } from '../firebase';
import { setSession } from '../store/actions';

import AddNote from './AddNote';
import { StyledIcon, ProfileIcon } from '../styled';

const antIcon = <Icon type="loading" spin />;

const UserInfo = styled.div`
display: flex;
background: #dcdcdc;
padding: 0px 10px;
margin: 0;
margin-right: 6px;
border-radius: 20px;
position: relative;
.username{
  margin: 0;
  margin-right: 9px;
  padding: 0 2px;
  position: relative;
  top: 2px;
  font-size: 13px;
  font-weight: bold;
}
`

const Container = styled.header`
  display: flex;
  // background: #fff;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
  padding: 10px;
  h3{
    flex: 1 1 70%;
    margin: 0;
    margin-left: 10px;
    text-transform: uppercase;
    vertical-align: center;
    color: #424242;
    transition: 2s;
    font-weight: bold;
    & > span{
      text-decoration: overline;
      font-size: 150%;
      color: #2b2b2b;
    }
  }
`

const Header = ({ history, dispatch, appLoading, session }) => {
  const signOut = async () => {
    await auth.signOut();
    dispatch(setSession(null));
    return history.push('/signin');
  };

  return (
    <Container>
      <h3>
        <span>N</span>otes{' '}{appLoading && <Spin indicator={antIcon} />}
      </h3>
      {
        session && (
          <div style={{ display: 'flex' }}>
            <AddNote />
            <Divider type="vertical" />
            <UserInfo>
              <div className="username">
                {session.name}
              </div>
              <ProfileIcon>
                {
                  session.photoURL ?
                    <img src={session.photoURL} alt="Profile pic" /> :
                    <StyledIcon type="user" />
                }
              </ProfileIcon>
            </UserInfo>
            <StyledIcon type="logout" onClick={signOut} />
          </div>
        )
      }
    </Container>
  );
}

const mapStateToProps = ({ appLoading, session }) => ({ appLoading, session });

export default withRouter(connect(mapStateToProps)(Header));
