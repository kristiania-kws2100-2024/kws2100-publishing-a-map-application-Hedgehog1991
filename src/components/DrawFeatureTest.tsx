import React, { useEffect, useRef, useContext, useState } from "react";
import Draw, { DrawEvent } from "ol/interaction/Draw";
import { Vector as VectorSource } from "ol/source";
import { BaseMap } from "./BaseMap";
import { useLayer } from "./useLayer";
import VectorLayer from "ol/layer/Vector";
import { GeometryType } from "ol/render/webgl/MixedGeometryBatch";
import { getLength } from "ol/sphere";
import { getArea } from "ol/extent";
import { Fill, Stroke, Style, Text } from "ol/style";
import { Circle, Geometry, LineString, Point, Polygon } from "ol/geom";

// reference code.
// https://openlayers.org/en/latest/examples/draw-features.html

type GeometryOptions =
  | "Point"
  | "LineString"
  | "Polygon"
  | "Circle"
  | "Disabled";
export function DrawFeatureTest() {
  const { map } = useContext(BaseMap);

  const typeSelect = useRef<HTMLSelectElement>(null);
  const undoButton = useRef<HTMLInputElement>(null);
  const source = new VectorSource({ wrapX: true });
  const [lineLength, setLineLength] = useState<number>();
  const vectorLayer = new VectorLayer({ source });

  useLayer(vectorLayer, true);

  useEffect(() => {
    let draw: Draw;
    const addInteraction = (type: GeometryOptions) => {
      if (type !== "Disabled") {
        draw = new Draw({
          source: source,
          type: type as GeometryType,
          style: (feature) => {
            const geometry = feature.getGeometry() as
              | LineString
              | Circle
              | Polygon;
            const geometry3857 = geometry
              .clone()
              .transform("EPSG:4326", "EPSG:3857");
            const lengthInMeters = getLength(geometry3857);
            const lengthInKilometers = lengthInMeters / 1000;
            if (feature.getGeometry()?.getType() === "LineString") {
              // console.log(getLength(feature.getGeometry() as Geometry))
              console.log(lengthInKilometers.toFixed(2));
              setLineLength(lengthInKilometers);
            }
            return new Style({
              stroke: new Stroke({ color: "red", width: 5 }),
              fill: new Fill({ color: "blue" }),
              text: new Text({
                text: lengthInKilometers.toFixed(2).toString(),
                offsetY: -70,
                font: " 18px AnonymicePro Nerd Font Propo",
                fill: new Fill({ color: "yellow" }),
                stroke: new Stroke({ color: "black", width: 2 }),
              }),
            });
          },
        });
        map.addInteraction(draw);
      }
    };
    if (typeSelect.current && undoButton.current) {
      typeSelect.current.onchange = () => {
        map.removeInteraction(draw);

        if (typeSelect.current) {
          addInteraction(typeSelect.current.value as GeometryOptions);
        }
      };
      undoButton.current.addEventListener("mouseup", () => {
        source.clear();
      });

      if (typeSelect.current) {
        addInteraction(typeSelect.current.value as GeometryOptions);
      }
    }
  }, []);

  return (
    <div>
      <div className="rowTest">
        <div className="col-auto">
          <span className="input-group">
            <label className="input-group-text" htmlFor="type">
              Draw Map:
            </label>
            <select className="form-select" id="type" ref={typeSelect}>
              <option value="Disabled">Disabled</option>
              <option value="Point">Point</option>
              <option value="LineString">LineString</option>
              <option value="Polygon">Polygon</option>
              <option value="Circle">Circle</option>
            </select>
            <input
              className="form-control"
              type="button"
              value="Undo"
              id="undo"
              ref={undoButton}
            />
          </span>
        </div>
        <p>Distance: {lineLength && lineLength.toFixed(2)} km</p>
      </div>
    </div>
  );
}
