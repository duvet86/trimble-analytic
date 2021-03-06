import React, { Component } from "react";
import { RouteComponentProps, withRouter } from "react-router-dom";

import { Log } from "@mis/common";

import ErrorBoundary from "./ErrorBoundary";

interface IState {
  error: unknown;
}

class ErrorBoundaryContainer extends Component<RouteComponentProps, IState> {
  public static getDerivedStateFromError(error: Error) {
    // Update state so the next render will show the fallback UI.
    return { error };
  }

  public state: IState = {
    error: undefined
  };

  public componentDidCatch(error: Error) {
    Log.error("Caught by ErrorBoundary", error);
  }

  public componentDidUpdate(prevProps: RouteComponentProps) {
    if (this.props.location !== prevProps.location) {
      if (this.state.error != null) {
        this.setState({
          error: undefined
        });
      }
    }
  }

  public render() {
    const error = this.state.error;
    if (error != null) {
      const errorMessage =
        error instanceof Error
          ? error.stack || error.message
          : JSON.stringify(error);
      return <ErrorBoundary errorMessage={errorMessage} />;
    }

    return this.props.children;
  }
}

export default withRouter(ErrorBoundaryContainer);
