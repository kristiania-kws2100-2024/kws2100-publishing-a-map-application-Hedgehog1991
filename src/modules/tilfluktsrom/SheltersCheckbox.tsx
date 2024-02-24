
import {  MapBrowserEvent } from "ol";
import { FeatureLike } from "ol/Feature";
import React, { useContext, useEffect, useState } from "react";
import { BaseMap } from "../../components/BaseMap";
import { useLayer } from "../../components/useLayer";
import {activeShelterStyle, sheltersLayer, ShelterFeature} from "./SheltersLayer";


export function SheltersCheckbox() {
  const { map } = useContext(BaseMap);
  const [checked, setChecked] = useState(false);

  const [activeFeature, setActiveFeature] = useState<ShelterFeature>();

  function handlePointerMove(e: MapBrowserEvent<MouseEvent>) {
    const resolution = map.getView().getResolution();
    if (!resolution || resolution > 800) {
      return;
    }
    const features: FeatureLike[] = [];
    map.forEachFeatureAtPixel(e.pixel, (f) => features.push(f), {
      hitTolerance: 5,
      layerFilter: (l) => l === sheltersLayer,
    });
    if (features.length === 1) {
      setActiveFeature(features[0] as ShelterFeature);
    } else {
      setActiveFeature(undefined);
    }
  }
  useLayer(sheltersLayer, checked);

  useEffect(() => {
    activeFeature?.setStyle(activeShelterStyle);
    return () => activeFeature?.setStyle(undefined);
  }, [activeFeature]);

  useEffect(() => {
    if (checked) {
      map?.on("click", handlePointerMove);
    }
    return () => map?.un("click", handlePointerMove);
  }, [checked]);

  return (
    <div>
      <label>
        <input
          type={"checkbox"}
          checked={checked}
          onChange={(e) => setChecked(e.target.checked)}
        />
        Shelters
        {activeFeature &&
          " Space:" + activeFeature.getProperties().plasser }

      </label>
    </div>
  );
}
