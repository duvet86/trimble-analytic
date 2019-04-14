import React from "react";
import { create } from "react-test-renderer";

import LoadingContainer from "loading/LoadingContainer";
import BaseLoading from "loading/BaseLoading";

// Mock setTimeout.
jest.useFakeTimers();

describe("<LoadingContainer />", () => {
  it("Component with error shows error message.", () => {
    const error = {
      error: "ERROR"
    };
    const component = create(
      <LoadingContainer isLoading={true} error={error}>
        <div>Child</div>
      </LoadingContainer>
    );

    const instance = component.root;

    const childComponent = instance.find(el => {
      return el.children && el.children[0] === JSON.stringify(error);
    });
    expect(childComponent).toBeDefined();
  });

  it("Component not loading show children.", () => {
    const component = create(
      <LoadingContainer isLoading={false}>
        <div>Child</div>
      </LoadingContainer>
    );

    const instance = component.root;

    expect(instance.instance.state.pastDelay).toStrictEqual(false);
    expect(instance.children.length).toEqual(1);

    const childComponent = instance.find(el => {
      return el.children && el.children[0] === "Child";
    });
    expect(childComponent).toBeDefined();
  });

  it("Component not loading and outside delay shows children.", () => {
    const component = create(
      <LoadingContainer isLoading={false}>
        <div>Child</div>
      </LoadingContainer>
    );

    // Fast-forward until all timers have been executed.
    jest.runAllTimers();

    const instance = component.root;

    expect(instance.instance.state.pastDelay).toStrictEqual(false);
    expect(instance.children.length).toEqual(1);

    const childComponent = instance.find(el => {
      return el.children && el.children[0] === "Child";
    });
    expect(childComponent).toBeDefined();

    // Rerender component, test shouldComponentUpdate.
    const renderSpy = jest.spyOn(instance.instance, "render");
    component.update(
      <LoadingContainer isLoading={true}>
        <div>Child</div>
      </LoadingContainer>
    );

    expect(instance.instance.state.pastDelay).toStrictEqual(false);
    expect(instance.instance.delay).toBeDefined();
    expect(renderSpy).not.toHaveBeenCalled();

    jest.runAllTimers();

    const loadingComponent = instance.findByType(BaseLoading);
    expect(loadingComponent).toBeDefined();
  });

  it("Component loading within delay return null.", () => {
    const component = create(
      <LoadingContainer isLoading={true}>
        <div>Child</div>
      </LoadingContainer>
    );

    const instance = component.root;

    expect(instance.instance.state.pastDelay).toStrictEqual(false);
    expect(component.toJSON()).toBeNull();
  });

  it("Component loading outside delay shows spinner.", () => {
    const component = create(
      <LoadingContainer isLoading={true}>
        <div>Child</div>
      </LoadingContainer>
    );

    // Fast-forward until all timers have been executed.
    jest.runAllTimers();

    const instance = component.root;

    expect(instance.instance.state.pastDelay).toStrictEqual(true);
    const childComponent = instance.findByType(BaseLoading);
    expect(childComponent).toBeDefined();
  });

  it("Component unmounted clears timeout.", () => {
    const component = create(
      <LoadingContainer isLoading={true}>
        <div>Child</div>
      </LoadingContainer>
    );

    component.unmount();

    const clearTimeoutSpy = jest.spyOn(window, "clearTimeout");
    expect(clearTimeoutSpy).toHaveBeenCalledTimes(1);
  });
});