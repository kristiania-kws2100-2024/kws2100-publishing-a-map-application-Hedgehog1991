import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import { GeoJSON } from "ol/format";
import { Feature, MapBrowserEvent } from "ol";
import { Polygon, MultiPoint, MultiPolygon } from "ol/geom";
import "../../../public/oceanwind.json";
import { Fill, Stroke, Style } from "ol/style";
import React, { useContext, useEffect } from "react";
import { BaseMap } from "../../components/BaseMap";

//export type oceanwindLayer = VectorLayer<VectorSource<DefenceFeature>>

export interface OceanWindProperties {
  name: string;
  country: string;
  area: number;
  dist_coast: number;
}

export type OceanWindFeature = {
  getProperties(): OceanWindProperties;
} & Feature<MultiPolygon>;

function addRandomColor(): string {
  const letters = "0123456789ABCDEF";
  let color = "#";
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

export const OceanwindLayer = new VectorLayer({
  className: "oceanwind",
  source: new VectorSource({
    url: "oceanwind.json",
    format: new GeoJSON(),
  }),
  style: function (feature) {
    const randomColor = addRandomColor();
    return new Style({
      fill: new Fill({
        color: "rgba(194,198,238,0.11)", // Apply alpha value if needed
      }),
      stroke: new Stroke({
        color: randomColor,
        width: 3,
      }),
    });
  },
});

export const selectedStyle = new Style({
  stroke: new Stroke({
    color: "rgb(95,113,190)",
    width: 3,
  }),
  fill: new Fill({
    color: "rgba(194,198,238,0.35)",
  }),
});
