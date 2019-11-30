import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { withRouter, Route, Switch, Redirect } from 'react-router-dom';
import axios from 'axios';

import { auth } from './firebase';

import './App.scss';

import ProtectedRoute from './ProtectedRoute';

import Header from './components/Header';
import Notes from './components/Notes';
import Signup from './components/Signup';
import Signin from './components/Signin';
import NotFound from './components/NotFound';
import NoteView from './components/NoteView';
import UploadContent from './components/UploadContent';
import Settings from './components/Settings';

import { setAddNoteModalVisibility, setSession } from './store/actions';

// axios.defaults.baseURL = 'https://bubblegum-server.herokuapp.com/api';
axios.defaults.baseURL = 'http://localhost:7000/api';
axios.defaults.headers.common["external-source"] = 'NOTES_APP';

const App = ({ location, history, dispatch, session }) => {
  // const queryString = new URLSearchParams(location.search);
  // const mode = queryString.get('mode');
  // if (mode === 'add') {
  //   dispatch(setAddNoteModalVisibility(true));
  // }

  useEffect(() => {
    auth.onAuthStateChanged(user => {
      if (user) {
        console.log('Auth user: ', user);
        const { displayName: name, email, photoURL, uid } = user;
        dispatch(setSession({
          name, email, photoURL, uid
        }));
        sessionStorage.setItem('notes-app', 'logged-in');

        if (history.location.pathname === '/signin')
          history.push('/home');
      } else {
        sessionStorage.clear();
      }
    });
  }, []);

  return (
    <div className="container">
      <Header />
      <Switch>
        <Route path="/signup" exact component={Signup} />
        <Route path="/signin" exact component={Signin} />
        <ProtectedRoute path="/home" exact component={Notes} />
        <ProtectedRoute path="/note/:id" exact component={NoteView} />
        <ProtectedRoute path="/upload" exact component={UploadContent} />
        <Route path="/" exact render={() => <Redirect to="/signin" />} />
        <Route component={NotFound} />
      </Switch>
      <Settings />
    </div>
  );
}

const mapStateToProps = ({ notes, session }) => ({ notes, session });

export default withRouter(connect(mapStateToProps)(App));
