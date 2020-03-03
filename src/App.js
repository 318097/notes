import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { withRouter, Route, Switch, Redirect } from "react-router-dom";
import axios from "axios";

import "./App.scss";

import { auth } from "./firebase";
import { setSession, fetchNotes } from "./store/actions";

import ProtectedRoute from "./ProtectedRoute";

import Header from "./components/Header";
import Signup from "./components/Signup";
import Signin from "./components/Signin";
import NotFound from "./components/NotFound";
import Notes from "./components/notes/Notes";
import NoteView from "./components/notes/NoteView";
import UploadContent from "./components/notes/UploadContent";
import Settings from "./components/Settings";
import AddNote from "./components/notes/AddNote";

axios.defaults.headers.common["external-source"] = "NOTES_APP";

const App = ({ history, dispatch, session, settings }) => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    auth.onAuthStateChanged(user => {
      if (user) {
        const { displayName: name, email, photoURL, uid } = user;
        dispatch(
          setSession({
            name,
            email,
            photoURL,
            uid
          })
        );
        if (history.location.pathname === "/signin") history.push("/home");
      } else {
        setLoading(false);
        sessionStorage.clear();
      }
    });
  }, []);

  useEffect(() => {
    if (!session) return;

    // if (settings.server === "server")
    // axios.defaults.baseURL = "https://bubblegum-server.herokuapp.com/api";
    axios.defaults.baseURL = "http://localhost:7000/api";
    setLoading(false);
    dispatch(fetchNotes());
  }, [session]);

  return (
    <div className="container">
      <Header />
      <div className="content">
        {!loading && (
          <Switch>
            <Route path="/signup" exact component={Signup} />
            <Route path="/signin" exact component={Signin} />
            <ProtectedRoute
              session={session}
              path="/home"
              exact
              component={Notes}
            />
            <ProtectedRoute
              session={session}
              path="/note/:id"
              exact
              component={NoteView}
            />
            <ProtectedRoute
              session={session}
              path="/upload"
              exact
              component={UploadContent}
            />
            <Route path="/" exact render={() => <Redirect to="/signin" />} />
            <Route component={NotFound} />
          </Switch>
        )}
      </div>
      <AddNote />
      <Settings />
    </div>
  );
};

const mapStateToProps = ({ notes, session, settings }) => ({
  notes,
  session,
  settings
});

export default withRouter(connect(mapStateToProps)(App));
