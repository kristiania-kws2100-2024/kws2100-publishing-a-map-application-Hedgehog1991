import React, {
  MutableRefObject,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { map, BaseMap } from "../../components/BaseMap";
import { MapBrowserEvent, Overlay } from "ol";
import VectorSource from "ol/source/Vector";
import { offset } from "ol/sphere";
import { useFeatures } from "../../components/useFeature";
import { clear } from "ol/obj";
import {
  OceanWindFeature,
  OceanwindLayer,
  OceanWindProperties,
  selectedStyle,
} from "./OceanWIndLayer";

//multipolygon works exaclty the same as polygon.

export function OceanWindCheckbox() {
  const { setFeatureLayers } = useContext(BaseMap);
  const [checked, setChecked] = useState(false);

  const overlay = useMemo(() => new Overlay({}), []);
  const overlayRef = useRef() as MutableRefObject<HTMLDivElement>;

  useEffect(() => {
    overlay.setElement(overlayRef.current);
    map.addOverlay(overlay);
    return () => {
      map.removeOverlay(overlay);
    };
  }, [checked]);

  const [selectedPark, setSelectedPark] = useState<
    OceanWindFeature | undefined
  >();

  function oceanClick(e: MapBrowserEvent<MouseEvent>) {
    const source = OceanwindLayer.getSource() as VectorSource<OceanWindFeature>;

    const selectedPark = source.getFeaturesAtCoordinate(
      e.coordinate,
    ) as OceanWindFeature[];

    if (selectedPark.length === 1) {
      setSelectedPark(selectedPark[0]);
      overlay.setPosition(e.coordinate);
    } else {
      setSelectedPark(undefined);
      overlay.setPosition(undefined);
    }
  }
  useEffect(() => {
    if (checked) {
      setFeatureLayers((old) => [...old, OceanwindLayer]);
      map.on("click", oceanClick);
    }
    return () => {
      setFeatureLayers((old) => old.filter((l) => l !== OceanwindLayer));
      map.un("click", oceanClick);
      overlay.setPosition(undefined);
    };
  }, [checked]);

  //Simple color change jesus fucking christ
  const { activeFeatures, setActiveFeature } = useFeatures<OceanWindFeature>(
    (l) => l.getClassName() === "oceanwind",
  );
  useEffect(() => {
    activeFeatures?.setStyle(selectedStyle);

    return () => activeFeatures?.setStyle(undefined);
  }, [activeFeatures]);

  return (
    <div onMouseLeave={() => setActiveFeature(undefined)}>
      <label>
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => setChecked(e.target.checked)}
        />
        Oceanwind UK {checked ? "" : ""}
      </label>
      <div
        onMouseEnter={() => activeFeatures}
        ref={overlayRef}
        className={"district-overlay"}
      >
        {selectedPark && (
          <>
            {(selectedPark.getProperties() as OceanWindProperties).name}
            <br />{" "}
          </>
        )}
      </div>
    </div>
  );
}
