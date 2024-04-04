import { useContext, useEffect, useState } from "react";
import { BaseMap } from "../../components/BaseMap";
import { airportLayer } from "./AirportLayer";
import React from "react";

export function AirportLayerCheckbox() {
  const { setFeatureLayers } = useContext(BaseMap);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    if (checked) {
      setFeatureLayers((old) => [...old, airportLayer]);
    }
    return () => {
      setFeatureLayers((old) => old.filter((l) => l !== airportLayer));
    };
  }, [checked]);

  return (
    <div>
      <label>
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => setChecked(e.target.checked)}
        />
        Airports
      </label>
    </div>
  );
}
