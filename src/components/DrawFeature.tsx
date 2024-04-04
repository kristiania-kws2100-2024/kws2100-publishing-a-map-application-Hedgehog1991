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
import { Simulate } from "react-dom/test-utils";
import keyDown = Simulate.keyDown;

// reference code.
// https://openlayers.org/en/latest/examples/draw-features.html

type GeometryOptions =
  | "Point"
  | "LineString"
  | "Polygon"
  | "Circle"
  | "Disabled";

export function DrawFeature() {
  const calculateAreaInSquareKm = (polygon: Polygon): number => {
    const polygon3857 = polygon.clone().transform("EPSG:4326", "EPSG:3857");
    const areaInSquareMeters = getArea(polygon3857.getExtent());
    return areaInSquareMeters / 1000000;
  };
  const calculateLengthInKm = (geometry: LineString): number => {
    const geometry3857 = geometry.clone().transform("EPSG:4326", "EPSG:3857");
    const lengthInMeters = getLength(geometry3857);
    return lengthInMeters / 1000;
  };

  const { map } = useContext(BaseMap);

  const typeSelect = useRef<HTMLSelectElement>(null);
  const undoButton = useRef<HTMLInputElement>(null);
  const source = new VectorSource({ wrapX: true });
  const [lineLength, setLineLength] = useState<number>(0);
  const [area, setArea] = useState<number>(0);
  const vectorLayer = new VectorLayer({ source });

  const featureStyle = new Style({
    stroke: new Stroke({ color: "grey", width: 2 }),
    fill: new Fill({ color: "grey" }),
    text: new Text({
      text: "",
      stroke: new Stroke({ color: "white", width: 2 }),

      //style more text here
    }),
  });
  useLayer(vectorLayer, true);

  useEffect(() => {
    let draw: Draw;
    const addInteraction = (type: GeometryOptions) => {
      if (type !== "Disabled") {
        draw = new Draw({
          source: source,
          type: type as GeometryType,
          style: featureStyle,
        });

        // draw.on

        draw.on("drawend", async (event: DrawEvent) => {
          const geometry = event.feature.getGeometry();

          if (geometry instanceof LineString) {
            const lengthInKilometers = calculateLengthInKm(geometry);
            setLineLength(lengthInKilometers);
            const lengthLabel = new Text({
              text: lengthInKilometers.toFixed(2) + " km",
              offsetY: -60,
              font: " 14px AnonymicePro Nerd Font Propo",
              fill: new Fill({ color: "white" }),
              stroke: new Stroke({ color: "grey", width: 1 }),
            });
            event.feature.setStyle(
              new Style({
                stroke: new Stroke({ color: "white", width: 1 }),
                text: lengthLabel,
              }),
            );
          }
          if (geometry instanceof Polygon) {
            const areaInSquareKilometers = calculateAreaInSquareKm(geometry);
            setArea(areaInSquareKilometers);
            const areaLabel = new Text({
              text: areaInSquareKilometers.toFixed(2) + " km²",
              offsetY: -60,
              font: " 14px AnonymicePro Nerd Font Propo",
              stroke: new Stroke({ color: "white", width: 2 }),
            });
            event.feature.setStyle(
              new Style({
                stroke: new Stroke({ color: "white", width: 2 }),
                fill: new Fill({ color: "gray" }),
                text: areaLabel,
              }),
            );
          }
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
      <div className="row">
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
        <p>Area: {area && area.toFixed(2)} km</p>
      </div>
    </div>
  );
}
