import React, { useContext, useEffect, useState } from "react";
import { BaseMap } from "../../components/BaseMap";
import { DockLayer } from "./DockLayer";
import { DefenceProperties } from "../forsvarsdistrikter(Polygon)/DefenceLayer";

export function DockLayerCheckbox() {
  const { setFeatureLayers } = useContext(BaseMap);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    if (checked) {
      setFeatureLayers((old) => [...old, DockLayer]);
    }
    return () => {
      setFeatureLayers((old) => old.filter((l) => l !== DockLayer));
    };
  }, [checked]);

  //need to add name/s on click or hover. alternativly list all names in circle

  return (
    <div>
      <label>
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => setChecked(e.target.checked)}
        />
        Fishing Docks
      </label>
    </div>
  );
}
