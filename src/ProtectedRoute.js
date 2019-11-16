import React from 'react'
import { Redirect, Route } from 'react-router-dom';

const ProtectedRoute = ({ component: Component, path, ...rest }) => {
  const isLoggedIn = sessionStorage.getItem('notes-app');
  return (
    <Route path={path} render={() => isLoggedIn ? <Component {...rest} /> : <Redirect to="/signin" />} />
  )
};

export default ProtectedRoute;
