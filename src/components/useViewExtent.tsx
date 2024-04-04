import { useContext, useEffect, useMemo, useState } from "react";
import "./BaseMap";
import { BaseMap } from "./BaseMap";

export function useViewExtent() {
  //useContext is a hook that retrieves the context inside Mapcontext.
  const { map } = useContext(BaseMap);
  //useState for setting the initial state of the rendering.
  const [extent, setExtent] = useState(
    () => map.getView().getViewStateAndExtent().extent,
  );

  //Function to set the new extent of the view when the value changes.
  function setExtentFromView() {
    setExtent(map.getView().getViewStateAndExtent().extent);
  }
  //
  useEffect(() => {
    //add a change eventListener on the map view that calls setExtentFromView when
    //the view changes.
    map.getView().on("change", setExtentFromView);
    //set a delay trigger to make sure the first/initial extent state is captured
    //Before activating the listener.
    setTimeout(setExtentFromView, 200);
    //Cleanup
    return () => {
      map.getView().un("change", setExtentFromView);
    };
  }, [map.getView()]);

  return extent;
}
