
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import { GeoJSON } from "ol/format";
import { Feature, MapBrowserEvent } from "ol";
import { Polygon } from "ol/geom";
import "../../../public/Sivilforsvarsdistrikter.json";
import { Fill, Stroke, Style } from "ol/style";
import React, {useContext, useEffect} from "react";
import {BaseMap} from "../../components/BaseMap";

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
            color: "rgba(103,107,76,0.06)"
        }),
            stroke: new Stroke({
        color: "rgb(141,90,0)", width: 3
    })
})
})


export const selectedStyle = new Style({
    stroke: new Stroke({
        color: "black",
        width: 3,
    }),
    fill: new Fill({
        color: [0,0,0,0.1],
    }),
});