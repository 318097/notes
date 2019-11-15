import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { withRouter, Route, Switch } from 'react-router-dom';

import { auth } from './firebase';

import './App.scss';

import Header from './components/Header';
import Notes from './components/Notes';
import Signup from './components/Signup';
import Signin from './components/Signin';

import { setAddNoteModalVisibility, setSession } from './store/actions';

const App = ({ location, history, dispatch, session }) => {
  // const queryString = new URLSearchParams(location.search);
  // const mode = queryString.get('mode');
  // if (mode === 'add') {
  //   dispatch(setAddNoteModalVisibility(true));
  // }

  useEffect(() => {
    auth.onAuthStateChanged(user => {
      if (user) {
        console.log(user);
        const { displayName: name, email, photoURL, uid } = user;
        dispatch(setSession({
          name, email, photoURL, uid
        }));
        history.push('/home');
      }
    });
  }, []);

  return (
    <div>
      <Header />
      <Switch>
        <Route path="/signup" exact component={Signup} />
        <Route path="/signin" exact component={Signin} />
        <Route path="/home" exact component={Notes} />
      </Switch>
    </div>
  );
}

const mapStateToProps = ({ notes, session }) => ({ notes, session });

export default withRouter(connect(mapStateToProps)(App));
