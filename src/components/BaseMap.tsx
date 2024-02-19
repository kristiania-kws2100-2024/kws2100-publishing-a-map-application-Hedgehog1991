import { Map, View } from "ol";
import React, { Dispatch, SetStateAction } from "react";
import { Layer } from "ol/layer";
import { useGeographic } from "ol/proj";


import {defaults, ScaleLine} from "ol/control";
import {extend} from "ol/array";

useGeographic()

//Values associated with the initial render of the webpage.
export const map = new Map({
    view: new View({
        center: [10, 61],
        zoom: 7,
    }),
    controls: defaults().extend([new ScaleLine()])
});

//set the rules for what is displayed in the return part of the application.
//Base for most of the other inputs.
export const BaseMap = React.createContext<{
    map: Map;
    setBaseLayer: (layer: Layer) => void;
    setFeatureLayers: Dispatch<SetStateAction<Layer[]>>;
    featureLayers: Layer[];
}>({
    map,
    setBaseLayer: () => {},
    setFeatureLayers: () => {},
    featureLayers: [],
});
