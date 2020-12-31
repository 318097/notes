import React, { useState, useEffect, Fragment } from "react";
import { connect } from "react-redux";
import { withRouter, Route, Switch, Redirect } from "react-router-dom";
import axios from "axios";
import "./App.scss";
import { setSession, getChains, setKey } from "./store/actions";
import ProtectedRoute from "./ProtectedRoute";
import Header from "./components/Header";
import Register from "./components/Register";
import Login from "./components/Login";
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
  settingsDrawerVisibility,
  setKey,
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
          setActivePage();
        } catch (err) {
          console.log("Error:", err);
        } finally {
          setTimeout(() => setLoading(false), 100);
        }
      } else setLoading(false);
    };
    isAccountActive();
  }, []);

  const setActivePage = async () => {
    let activePage;

    if (quickAddModalVisibility) activePage = "quick-add";
    else if (addModalVisibility) activePage = "add";
    else if (settingsDrawerVisibility) activePage = "setting";
    else activePage = window.location.pathname.slice(1);
    setKey({ activePage });
  };

  return (
    <div className="container" id="react-ui">
      <Navigation />
      <div className="contentWrapper">
        <Header />
        <div className="content">
          {!loading && (
            <Switch>
              <Route path="/register" exact component={Register} />
              <Route path="/login" exact component={Login} />
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
              <ProtectedRoute
                session={session}
                path="/stats"
                exact
                component={Stats}
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
  settingsDrawerVisibility,
}) => ({
  session,
  settings,
  appLoading,
  quickAddModalVisibility: quickAddModalMeta.visibility,
  addModalVisibility: modalMeta.visibility,
  settingsDrawerVisibility,
});

const mapActionToProps = {
  setSession,
  getChains,
  setKey,
};

export default withRouter(connect(mapStateToProps, mapActionToProps)(App));
