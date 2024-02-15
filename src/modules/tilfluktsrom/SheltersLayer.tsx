import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import {GeoJSON} from "ol/format";
import {Feature} from "ol";
import {Point} from "ol/geom";
import {FeatureLike} from "ol/Feature";
import {Fill, RegularShape, Stroke, Style, Text} from "ol/style";
import {offset} from "ol/sphere";


export const sheltersLayer = new VectorLayer({
    source: new VectorSource({
        url: "../../../public/Offentligetilfluktsrom.json",
        format: new GeoJSON(),
    }),
    style: shelterStyle,
});

type ShelterProps = {
    "romnr": number,
    "plasser": number,
    "adresse": string
};

type ShelterFeature = { getProperties(): ShelterProps} & Feature<Point>;


export function shelterStyle(f: FeatureLike) {
    const feature = f as ShelterFeature;
    const shelter = feature.getProperties();

    return new Style({
        image: new RegularShape({
            stroke: new Stroke({color: "black", width: 2}),
            fill: new Fill({
                color: "yellow",
            }),
            points: 4,
            angle: 90,
            radius2: 3 + shelter.plasser / 10,
        })
    })
}

export function activeShelterStyle(f: FeatureLike, resolution: number){
    const feature = f as ShelterFeature;
    const shelter = feature.getProperties();
    return new Style({
        image: new RegularShape({
            stroke: new Stroke({ color: "black", width: 3}),
            fill: new Fill({
                color: "yellow",
            }),
            points: 3,
            angle: 40,
            radius: 3 + shelter.plasser % 10
        }),
        text:
            resolution < 300 ? new Text({text: shelter.adresse,
        offsetY: -18,
        font: "bold 22px sans-serif",
        fill: new Fill({color: "black"}),
        stroke: new Stroke({color: "yellow", width: 2}),
        }) : undefined,
    });
}