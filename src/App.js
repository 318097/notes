import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import './App.scss';

import Header from './components/Header';
import Notes from './components/Notes';

import { setAddNoteModalVisibility } from './store/actions';

const App = ({ location, dispatch }) => {
  useEffect(() => {
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
