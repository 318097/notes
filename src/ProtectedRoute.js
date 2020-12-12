import React from "react";
import { Redirect, Route } from "react-router-dom";
import { connect } from "react-redux";
import _ from "lodash";

const ProtectedRoute = ({
  component: Component,
  path,
  loggedIn,
  session,
  ...rest
}) => {
  return (
    <Route
      path={path}
      render={() =>
        loggedIn ? <Component {...rest} /> : <Redirect to="/login" />
      }
    />
  );
};

const mapStateToProps = (state) => ({
  loggedIn: _.get(state, "session.loggedIn"),
});

export default connect(mapStateToProps)(ProtectedRoute);
