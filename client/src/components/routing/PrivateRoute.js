import React, { useContext } from "react";
import { Route, Redirect } from "react-router-dom";

import AuthContext from "../../context/auth/authContext";

const PrivateRoute = ({ component: Component, ...rest }) => {
  const authContext = useContext(AuthContext);

  const { isAuthenticated, loading } = authContext;

  return (
    //if the user is not authenticated redirect them to the login page
    //else
    //show them the component they are currently in
    <Route
      {...rest}
      render={(props) =>
        !isAuthenticated && !loading ? (
          <Redirect to="/login" />
        ) : (
          <Component {...props} />
        )
      }
    />
  );
};

export default PrivateRoute;
