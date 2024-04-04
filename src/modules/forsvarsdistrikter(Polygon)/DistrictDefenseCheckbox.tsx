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
import {
  DefenceFeature,
  DefenceLayer,
  DefenceProperties,
  selectedStyle,
} from "./DefenceLayer";
import VectorSource from "ol/source/Vector";
import { offset } from "ol/sphere";
import { useFeatures } from "../../components/useFeature";
import { clear } from "ol/obj";

export function DistrictDefenseCheckbox() {
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

  const [selectedDistrict, setSelectedDistrict] = useState<
    DefenceFeature | undefined
  >();

  function districtClick(e: MapBrowserEvent<MouseEvent>) {
    const source = DefenceLayer.getSource() as VectorSource<DefenceFeature>;

    const clickedDistrict = source.getFeaturesAtCoordinate(
      e.coordinate,
    ) as DefenceFeature[];

    if (clickedDistrict.length === 1) {
      setSelectedDistrict(clickedDistrict[0]);
      overlay.setPosition(e.coordinate);
    } else {
      setSelectedDistrict(undefined);
      overlay.setPosition(undefined);
    }
  }
  useEffect(() => {
    if (checked) {
      setFeatureLayers((old) => [...old, DefenceLayer]);
      map.on("click", districtClick);
    }
    return () => {
      setFeatureLayers((old) => old.filter((l) => l !== DefenceLayer));
      map.un("click", districtClick);
      overlay.setPosition(undefined);
    };
  }, [checked]);

  //Simple color change
  const { activeFeatures, setActiveFeature } = useFeatures<DefenceFeature>(
    (l) => l.getClassName() === "Sivilforsvarsdistrikter",
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
        Defence Districts {checked ? " (Click Link in Tile)" : ""}
      </label>
      <div
        onMouseEnter={() => activeFeatures}
        ref={overlayRef}
        className={"district-overlay"}
      >
        {selectedDistrict && (
          <>
            {(selectedDistrict.getProperties() as DefenceProperties).navn}
            <br />{" "}
            {
              <a
                href={
                  (selectedDistrict.getProperties() as DefenceProperties).url
                }
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  color: "orange",
                  textDecoration: "underline",
                  fontSize: "small",
                }}
              >
                visit District
              </a>
            }{" "}
            <br />{" "}
            <a
              href={(selectedDistrict.getProperties() as DefenceProperties).url}
              target="_blank"
              rel="noopener noreferrer"
            >
              <img
                src={
                  (selectedDistrict.getProperties() as DefenceProperties).bilde
                }
                alt=""
              />
            </a>
          </>
        )}
      </div>
    </div>
  );
}
