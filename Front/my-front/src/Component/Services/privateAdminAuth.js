import React from 'react';
import { Redirect, Route } from 'react-router-dom';

const PrivateAdminRoute = ({ component: Component, ...rest }) => {
  const isAdmin = localStorage.getItem('isAdmin')

  if (!isAdmin) {
    return <Redirect to="/home" />;
  }
  
  return <Route {...rest} render={(props) => <Component {...props} />} />;
};

export default PrivateAdminRoute;
