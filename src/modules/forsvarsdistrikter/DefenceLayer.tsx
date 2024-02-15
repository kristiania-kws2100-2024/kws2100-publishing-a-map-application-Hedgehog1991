
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import { GeoJSON } from "ol/format";
import { Feature, MapBrowserEvent } from "ol";
import { Polygon } from "ol/geom";
import "../../../public/Sivilforsvarsdistrikter.json";
import { Fill, Stroke, Style } from "ol/style";

export type defenceLayer = VectorLayer<VectorSource<DefenceFeature>>

export interface DefenceProperties {
    navn: string;
    url: string;
    bilde: string;
}

export type DefenceFeature = {
    getProperties() : DefenceProperties;
} & Feature<Polygon>

export const DefenceLayer = new VectorLayer({
    className: "Sivilforsvarsdistrikter",
    source: new VectorSource({
        url: "Sivilforsvarsdistrikter.json",
        format: new GeoJSON(),
    }),
    style: new Style({
        fill: new Fill({
            color: "rgba(200,206,100,0.1)"
        }),
            stroke: new Stroke({
        color: "green",
    })
})
})