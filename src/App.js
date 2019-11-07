import React from 'react';
import { connect } from 'react-redux';

import Notes from './components/Notes';
import AddNote from './components/AddNote';

const App = () => (
  <div>
    <AddNote />
    <Notes />
  </div>
);

const mapStateToProps = state => ({ notes: state.notes.notes });

export default connect(mapStateToProps)(App);
