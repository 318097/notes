import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { withRouter, Route, Switch, Redirect } from "react-router-dom";
import axios from "axios";

import "./App.scss";

import { auth, firestore } from "./firebase";
import { setSession, setSettings, fetchNotes } from "./store/actions";

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

const App = ({ location, history, dispatch, session, settings }) => {
  const [loading, setLoading] = useState(true);
  // const queryString = new URLSearchParams(location.search);
  // const mode = queryString.get('mode');
  // if (mode === 'add') {
  // }

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
        sessionStorage.setItem("notes-app", "logged-in");
        if (history.location.pathname === "/signin") history.push("/home");
      } else {
        setLoading(false);
        sessionStorage.clear();
      }
    });
  }, []);

  useEffect(() => {
    const fetchSettings = async email => {
      const querySnapshot = await firestore
        .collection("users")
        .where("email", "==", email)
        .get();

      querySnapshot.forEach(doc => {
        console.log(doc.data());
        dispatch(setSettings(doc.data().settings));
      });
    };
    if (!session) return;
    fetchSettings(session.email);
  }, [session]);

  useEffect(() => {
    if (!settings || !session) return;

    if (settings.server === "server")
      axios.defaults.baseURL = "https://bubblegum-server.herokuapp.com/api";
    else axios.defaults.baseURL = "http://localhost:7000/api";
    setLoading(false);
    dispatch(fetchNotes());
  }, [settings]);

  return (
    <div className="container">
      <Header />
      <AddNote />
      <div className="content">
        {!loading && (
          <Switch>
            <Route path="/signup" exact component={Signup} />
            <Route path="/signin" exact component={Signin} />
            <ProtectedRoute path="/home" exact component={Notes} />
            <ProtectedRoute path="/note/:id" exact component={NoteView} />
            <ProtectedRoute path="/upload" exact component={UploadContent} />
            <Route path="/" exact render={() => <Redirect to="/signin" />} />
            <Route component={NotFound} />
          </Switch>
        )}
      </div>
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
