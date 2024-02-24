import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import {GeoJSON} from "ol/format";
import {Feature} from "ol";
import {Point} from "ol/geom";
import {FeatureLike} from "ol/Feature";
import { Fill, RegularShape, Stroke, Style, Text } from "ol/style";
import React from "react";

export const sheltersLayer = new VectorLayer({
    source: new VectorSource({
        url: "./fluktsrom.json",
        format: new GeoJSON(),
    }),
    style: shelterStyle,
});

export interface ShelterProps {
    adresse: string;
    plasser: number;
    romnr: number;
};

export type ShelterFeature = { getProperties(): ShelterProps } & Feature<Point>;function shelterStyle(f: FeatureLike) {
    const feature = f as ShelterFeature;
    const shelter = feature.getProperties();
    return new Style({
        image: new RegularShape({
            stroke: new Stroke({ color: "black", width: 2 }),
            fill: new Fill({
                color: "yellow",
            }),
            points: 4,
            angle: 0,
            radius: 10 + shelter.plasser / 750,
            rotation: 4
        }),
    });
}

export function activeShelterStyle(f: FeatureLike, resolution: number) {
    const feature = f as ShelterFeature;
    const shelter = feature.getProperties();
    return new Style({
        image: new RegularShape({
            stroke: new Stroke({ color: "darkgreen", width: 3 }),
            fill: new Fill({
                color: "black",
            }),
            points: 4,
            angle: 90,
            radius: 10 + shelter.plasser / 700,
        }),
        text:
            resolution < 800
                ? new Text({
                    text: shelter.adresse + "\n Available Space: " + shelter.plasser.toString() ,

                    offsetY: -70,
                    font: " 18px AnonymicePro Nerd Font Propo",
                    fill: new Fill({ color: "orange" }),
                    stroke: new Stroke({ color: "black", width: 2 }),
                })
                : undefined,
    });
}
