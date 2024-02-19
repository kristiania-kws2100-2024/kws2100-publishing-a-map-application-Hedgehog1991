import React, {MutableRefObject, useEffect, useMemo, useRef, useState} from "react";
import {View} from "ol";

import "./app.css"
import {Layer} from "ol/layer";
import TileLayer from "ol/layer/Tile";
import {OSM, StadiaMaps} from "ol/source";
import {map, BaseMap} from "./components/BaseMap";
import {DistrictDefenseCheckbox} from "./modules/forsvarsdistrikter/DistrictDefenseCheckbox";
import {SheltersCheckbox} from "./modules/tilfluktsrom/SheltersCheckbox";
import {SearchShelter} from "./modules/tilfluktsrom/findShelter";
import {BaseLayerSelector} from "./components/BaseLayerSelector";





export function Application(){

   // const [layers, setLayers] = useState<Layer[]>([
        // new TileLayer({ source: new OSM() }),
      //  new TileLayer({
       //     source: new StadiaMaps({
                //https://client.stadiamaps.com/
        //        layer: "alidade_smooth_dark", apiKey:"69dfeec6-dedf-4d6d-8344-154bbd2724d9",
         //       retina: true,
       //     }),
     //   }),
  //  ]);


    const [view, setView] = useState(new View({ center: [10, 59], zoom: 8 }));
    useEffect(() => map.setView(view), [view]);
    const [baseLayer, setBaseLayer] = useState<Layer>(
        new TileLayer({ source: new OSM() }),
    );
    const [featureLayers, setFeatureLayers] = useState<Layer[]>([]);
    const layers = useMemo(
        () => [baseLayer, ...featureLayers],
        [baseLayer, featureLayers],
    );
    const projection = useMemo(
        () => baseLayer.getSource()!.getProjection(),
        [baseLayer],
    );
    useEffect(() => {
        if (projection)
            setView(
                (old) =>
                    new View({
                        center: old.getCenter(),
                        zoom: old.getZoom(),
                        projection: projection,
                    }),
            );
    }, [projection]);
    useEffect(() => map.setLayers(layers), [layers]);






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
        <BaseMap.Provider value={{ map,featureLayers, setFeatureLayers, setBaseLayer }}>
            <header></header>
            <SearchShelter/>

                <BaseLayerSelector/>
            <nav>
                <DistrictDefenseCheckbox/>
                <SheltersCheckbox/>

            </nav>
            <main className={"mainback"}>
                <div ref={mapRef}></div>
            </main>
        </BaseMap.Provider>
    );
}