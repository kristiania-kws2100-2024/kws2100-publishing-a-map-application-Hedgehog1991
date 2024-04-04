import React, { useContext, useEffect, useRef, useState } from "react";
import Map from "ol/Map";
import View from "ol/View";
import TileLayer from "ol/layer/Tile";
import XYZ from "ol/source/XYZ";
import { Layer } from "ol/layer";
import { fromLonLat, transformExtent } from "ol/proj";
import { BaseMap } from "./BaseMap";
import { StadiaMaps } from "ol/source";
import { invert } from "ol/transform";
import { Simulate } from "react-dom/test-utils";
import durationChange = Simulate.durationChange; // Import the BaseMap context

const Minimap: React.FC = () => {
  const { map } = useContext(BaseMap); // Access the map from BaseMap context
  const [minimapMap, setMinimapMap] = useState<Map | null>(null);
  const minimapViewExtent = useRef<number[]>([]);

  useEffect(() => {
    // Create a new Map instance for the minimap
    const minimapMapInstance = new Map({
      view: new View({
        center: [10, 61],
        zoom: 4,
        projection: "EPSG:3857", // Assuming main map projection is EPSG:3857
      }),
      layers: [
        // Add a background layer (e.g., OpenStreetMap) to the minimap
        new TileLayer({
          source: new StadiaMaps({
            layer: "outdoors",
            apiKey: "69dfeec6-dedf-4d6d-8344-154bbd2724d9",
          }),
        }),
      ],
    });
    setMinimapMap(minimapMapInstance);

    // Clean up on unmount
    return () => {
      if (minimapMapInstance) {
        minimapMapInstance.setTarget();
      }
    };
  }, []);

  useEffect(() => {
    if (minimapMap && map) {
      // Sync main map view changes with the minimap
      map.on("moveend", () => {
        const mainMapView = map.getView();
        const mainMapCenter = mainMapView.getCenter();

        // Update minimap view
        const minimapView = minimapMap.getView();
        minimapView.setCenter(mainMapCenter);
        minimapView.setZoom(mainMapView.getZoom()! / 3.5); // Set the zoom to be twice the main map's zoom

        // Calculate the position and size of the rectangle
        const mainMapExtent = mainMapView.calculateExtent(map.getSize());
        const transformedExtent = transformExtent(
          mainMapExtent,
          mainMapView.getProjection(),
          "EPSG:3857",
        );
        minimapViewExtent.current = transformedExtent as [
          number,
          number,
          number,
          number,
        ];
      });
    }
  }, [map, minimapMap]);

  return (
    <div
      className="minimap"
      style={{
        position: "absolute",
        bottom: "20px",
        right: "10px",
        width: "200px",
        height: "200px",
        border: "1px dotted black",
        zIndex: 5,
      }}
    >
      <div
        id="minimap"
        style={{ width: "100%", height: "100%" }}
        ref={(el) => el && minimapMap && minimapMap.setTarget(el)}
      >
        {minimapMap && minimapViewExtent.current && (
          <div
            style={{
              position: "absolute",
              border: "12px dotted",
              borderColor: "rgba(215,201,169,0.18)",
              pointerEvents: "none",
              boxSizing: "border-box",
              zIndex: 6,

              left: `${(minimapViewExtent.current[0] / 20037508.34 + 0.5) * 100}%`,
              top: `${(1 - (minimapViewExtent.current[3] / 20037508.34 + 0.5)) * 100}%`,
              width: `${((minimapViewExtent.current[2] - minimapViewExtent.current[0]) / 20037508.34) * 100}%`,
              height: `${((minimapViewExtent.current[3] - minimapViewExtent.current[1]) / 20037508.34) * 100}%`,
            }}
          ></div>
        )}
      </div>
    </div>
  );
};
export default Minimap;
