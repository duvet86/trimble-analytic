import React, { SFC } from "react";
import { RouteComponentProps } from "react-router";
import { Redirect, Route } from "react-router";

import { getTokenFromSession } from "lib/authApi";
import { IRouteProps } from "routes/types";

const AuthenticatedRoute: SFC<IRouteProps> = ({ component, ...props }) => {
  const boundRender = (routeProps: RouteComponentProps) =>
    getTokenFromSession() != null ? (
      React.createElement(component, routeProps)
    ) : (
      <Redirect
        to={{
          pathname: "/login",
          state: { from: routeProps.location }
        }}
      />
    );

  return <Route exact {...props} render={boundRender} />;
};

export default AuthenticatedRoute;