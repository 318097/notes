import React, { useState, useEffect, Fragment } from "react";
import { connect } from "react-redux";
import { withRouter, Route, Switch, Redirect } from "react-router-dom";
import axios from "axios";
import "./App.scss";
import { setSession, getChains } from "./store/actions";
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
import QuickAdd from "./components/notes/QuickAdd";
import Stats from "./components/Stats";
import Navigation from "./components/Navigation";

import { getToken, hasToken } from "./authService";
import config from "./config";

axios.defaults.baseURL = config.SERVER_URL;
axios.defaults.headers.common["authorization"] = getToken();
axios.defaults.headers.common["external-source"] = "NOTES_APP";

const App = ({
  setSession,
  session,
  appLoading,
  quickAddModalVisibility,
  addModalVisibility,
  getChains,
}) => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const isAccountActive = async () => {
      if (hasToken()) {
        try {
          const token = getToken();
          const { data } = await axios.post(`/auth/account-status`, { token });
          setSession({ loggedIn: true, info: "ON_LOAD", ...data });
          getChains();
        } catch (err) {
          console.log("Error:", err);
        } finally {
          setTimeout(() => setLoading(false), 300);
        }
      } else setLoading(false);
    };
    isAccountActive();
  }, []);

  return (
    <div className="container" id="react-ui">
      <Navigation />
      <div className="contentWrapper">
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
              <Route path="/" exact render={() => <Redirect to="/home" />} />
              <Route component={NotFound} />
            </Switch>
          )}
        </div>
      </div>
      {session && session.loggedIn && (
        <Fragment>
          {addModalVisibility && <AddNote />}
          {quickAddModalVisibility && <QuickAdd />}
          <Stats />
          <Settings />
        </Fragment>
      )}
      {(appLoading || loading) && <div className="spinner" />}
    </div>
  );
};

const mapStateToProps = ({
  session,
  settings,
  appLoading,
  quickAddModalMeta = {},
  modalMeta = {},
}) => ({
  session,
  settings,
  appLoading,
  quickAddModalVisibility: quickAddModalMeta.visibility,
  addModalVisibility: modalMeta.visibility,
});

const mapActionToProps = {
  setSession,
  getChains,
};

export default withRouter(connect(mapStateToProps, mapActionToProps)(App));
