import React, { Fragment } from 'react'
import styled from 'styled-components';
import { connect } from 'react-redux';
import { Spin, Icon } from 'antd';

import { signInWithGoogle, auth } from '../firebase';
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
    & > span{
      font-size: 150%;
      color: #2b2b2b;
      font-weight: bold;
    }
  }
`

const Header = ({ dispatch, appLoading, session }) => {
  const signOut = async () => {
    await auth.signOut();
    dispatch(setSession(null));
  };

  return (
    <Container>
      <h3>
        <span>N</span>otes{' '}{appLoading && <Spin indicator={antIcon} />}
      </h3>
      <div style={{ display: 'flex' }}>
        {
          session ? (
            <Fragment>
              <UserInfo>
                <div className="username">
                  {session.displayName}
                </div>
                <ProfileIcon onClick={signOut}><img src={session.photoURL} alt="Profile pic" /></ProfileIcon>
              </UserInfo>
              <AddNote />
            </Fragment>
          ) :
            <StyledIcon type="google" onClick={signInWithGoogle} />
        }
      </div>
    </Container>
  );
}

const mapStateToProps = ({ appLoading, session }) => ({ appLoading, session });

export default connect(mapStateToProps)(Header);
