import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import { Feature } from "ol";
import { LineString, MultiPoint, Point } from "ol/geom";
import { GeoJSON } from "ol/format";
import { Fill, RegularShape, Stroke, Style } from "ol/style";

//export type AirportLayer = VectorLayer<VectorSource<AirportFeature>>;

export type AirportFeature = {
  getProperties(): AirportProperties;
} & Feature<MultiPoint>;

export interface AirportProperties {
  navn: string;
}
export const airportLinesLayer = new VectorLayer({
  source: new VectorSource(),
  style: new Style({
    stroke: new Stroke({
      color: "blue",
      width: 2,
    }),
  }),
});

export const airportLayer = new VectorLayer({
  className: "navn",
  source: new VectorSource({
    url: "./flyplasser.json",
    format: new GeoJSON(),
  }),
  style: new Style({
    image: new RegularShape({
      stroke: new Stroke({ color: "white", width: 2 }),
      fill: new Fill({
        color: "rgb(103,177,250)",
      }),
      points: 3,
      angle: 0,
      radius: 12,
    }),
  }),
});
