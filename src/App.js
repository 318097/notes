import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import { auth } from './firebase';

import './App.scss';

import Header from './components/Header';
import Notes from './components/Notes';

import { setAddNoteModalVisibility, setSession } from './store/actions';

const App = ({ location, dispatch }) => {
  useEffect(() => {
    auth.onAuthStateChanged(user => {
      if (user) {
        const { displayName, email, photoURL, uid } = user;
        dispatch(setSession({
          displayName, email, photoURL, uid
        }));
      }
    });

    const queryString = new URLSearchParams(location.search);
    const mode = queryString.get('mode');
    if (mode === 'add') {
      dispatch(setAddNoteModalVisibility(true));
    }
  }, []);

  return (
    <div>
      <Header />
      <Notes />
    </div>
  );
}

const mapStateToProps = state => ({ notes: state.notes });

export default withRouter(connect(mapStateToProps)(App));
