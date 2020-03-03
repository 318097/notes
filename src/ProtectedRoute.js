import React from "react";
import { Redirect, Route } from "react-router-dom";
import { connect } from "react-redux";
const ProtectedRoute = ({ component: Component, path, session, ...rest }) => {
  const isLoggedIn = !!session;
  return (
    <Route
      path={path}
      render={() =>
        isLoggedIn ? <Component {...rest} /> : <Redirect to="/signin" />
      }
    />
  );
};

export default ProtectedRoute;
