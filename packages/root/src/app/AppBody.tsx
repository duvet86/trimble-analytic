import React, { SFC } from "react";
// import { Route, Switch } from "react-router-dom";
// import { routeRenderers } from "app/routes";

import Grid from "@material-ui/core/Grid";

// import LoadAsync from "loading/LoadAsync";
// import NotFoundRoute from "routes/NotFoundRoute";

const AppBody: SFC = () => (
  <Grid container>
    <Grid item xs={12}>
      Test
      {/* <LoadAsync>
        <Switch>
          {routeRenderers.map(({ key, path, routeRenderer }) => (
            <Route key={key} exact path={path} render={routeRenderer} />
          ))}
          <NotFoundRoute />
        </Switch>
      </LoadAsync> */}
    </Grid>
  </Grid>
);

export default AppBody;