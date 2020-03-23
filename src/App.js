import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { withRouter, Route, Switch, Redirect } from "react-router-dom";
import axios from "axios";

import "./App.scss";

import { setSession, fetchNotes, setSettings } from "./store/actions";

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
import { isLoggedIn, getLocalSession } from "./authService";

axios.defaults.baseURL = "http://localhost:7000/api";
axios.defaults.headers.common["external-source"] = "NOTES_APP";

const App = ({ history, dispatch, session }) => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isLoggedIn()) {
      dispatch(
        setSession({
          loggedIn: true,
          serverUrl: sessionStorage.getItem("serverUrl") || "local",
          ...(getLocalSession() || {})
        })
      );
    }
  }, []);

  useEffect(() => {
    if (!session) return;

    setBaseUrl(session.serverUrl);
    dispatch(fetchNotes());
    setLoading(false);
    // getSettings();
  }, [session]);

  const setBaseUrl = serverUrl => {
    if (serverUrl === "server")
      axios.defaults.baseURL = "https://bubblegum-server.herokuapp.com/api";
    else axios.defaults.baseURL = "http://localhost:7000/api";
  };

  // const isAccountActive = async token => {
  //   if (token) {
  //     try {
  //       await axios.post(`/auth/account-status`, { token });
  //       axios.defaults.headers.common["authorization"] = token;
  //       dispatch(
  //         setSession({
  //           loggedIn: true,
  //           info: "ON_LOAD",
  //           ...(getLocalSession() || {})
  //         })
  //       );
  //     } catch (err) {
  //       // sendAppNotification();
  //     }
  //   } else setLoading(false);
  // };

  const getSettings = async () => {
    const {
      data: { settings }
    } = await axios.get(`/users/${session.userId}/settings`);
    console.log("settings", settings);
    dispatch(setSettings(settings));
  };

  return (
    <div className="container">
      <Header />
      <div className="content">
        {!loading && (
          <Switch>
            <Route
              path="/signup"
              exact
              component={Signup}
              dispatch={dispatch}
            />
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
            <Route path="/" exact render={() => <Redirect to="/home" />} />
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
