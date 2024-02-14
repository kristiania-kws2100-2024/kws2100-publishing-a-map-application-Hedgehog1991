import React, {MutableRefObject, useEffect, useRef, useState} from "react";
import {Map} from "ol";

import "./app.css"
import {Layer} from "ol/layer";
import TileLayer from "ol/layer/Tile";
import {StadiaMaps} from "ol/source";
import {map, BaseMap} from "./components/BaseMap";

export function Application(){

    const [layers, setLayers] = useState<Layer[]>([
        // new TileLayer({ source: new OSM() }),
        new TileLayer({
            source: new StadiaMaps({
                //Add API KEY AFTER REGISTER AT STADIAMAPS
                layer: "alidade_smooth_dark", apiKey:"69dfeec6-dedf-4d6d-8344-154bbd2724d9",
                retina: true,
            }),
        }),
    ]);


    //Make sure that whatever is in the div element of mapRef remains the same
    //Across renders.
    const mapRef = useRef() as MutableRefObject<HTMLDivElement>;
    //A hook that runs once, when something is mounted, setting the target of the
    //map to whatever is the current value of mapRef.
    useEffect(() => map.setTarget(mapRef.current), []);
    //This hook make sure that the layer of the map are updated whenever the
    //layers state(useState?) is modified.
    useEffect(() => map.setLayers(layers), [layers]);



    return(
        <BaseMap.Provider value={{ map, layers, setLayers }}>
            <header>--Hello--</header>

            <main className={"mainback"}>
                <div ref={mapRef}></div>
            </main>
        </BaseMap.Provider>
    )
}