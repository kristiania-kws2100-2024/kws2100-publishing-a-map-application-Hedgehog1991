//https://kystinfo.no/

import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import { GeoJSON } from "ol/format";
import { Feature } from "ol";
import { Point } from "ol/geom";
import { FeatureLike } from "ol/Feature";
import { Fill, RegularShape, Stroke, Style, Text } from "ol/style";
import React, { useState } from "react";
import Cluster from "ol/source/Cluster";

import { measureTextHeight } from "ol/render/canvas";
import { map } from "../../components/BaseMap";

const clusterSource = new Cluster({
  distance: 50, // should try to add some slider stuff here.
  source: new VectorSource({
    url: "./Fiskerihavner.json",
    format: new GeoJSON(),
  }),
});

export const DockLayer = new VectorLayer({
  source: clusterSource,
  style: clusterStyle,
});

export interface DockProps {
  kompleksnavn: string;
  id: number;
}

export type clusterFeature = { getProperties(): DockProps } & Feature<Point>;

export function clusterStyle(f: FeatureLike) {
  const features = f.getProperties().features;
  const totalDocks = features.length;

  const minSize = 15;
  const maxSize = 70;

  let radius = totalDocks;
  if (radius < 15) {
    radius = Math.max(radius, minSize);
  }
  if (radius > 70) {
    radius = Math.min(radius, maxSize);
  }

  let locationNames = features
    .map((feature: clusterFeature) => feature.getProperties().kompleksnavn)
    .join(", ");

  return new Style({
    image: new RegularShape({
      stroke: new Stroke({ color: "white", width: 1, lineDash: [5, 3] }),
      fill: new Fill({
        color: "rgba(37,108,196,0.55)",
      }),
      points: 100,
      angle: 1,
      radius: radius,
      rotation: 1.1,
    }),
    text: new Text({
      text: `( ${totalDocks.toString()} ) \n ${locationNames} `,
      offsetY: 0,
      offsetX: 0,
      font: `${18}px AnonymicePro Nerd Font Propo`,
      fill: new Fill({ color: "white" }),
      stroke: new Stroke({ color: "black" }),
    }),
  });
}
