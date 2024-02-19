import { Feature, MapBrowserEvent } from "ol";
import { Layer } from "ol/layer";
import { useContext, useEffect, useMemo, useState } from "react";
import { BaseMap } from "./BaseMap";
import { useViewExtent } from "./useViewExtent";
import VectorLayer from "ol/layer/Vector";

// The constraint <T extends Feature> ensures that only
// types conforming to the Feature structure can be used with the function.
export function useFeatures<T extends Feature>(
    layerPredicate: (layer: Layer) => boolean,
){


    const { featureLayers, map } = useContext(BaseMap);
    const viewExtent = useViewExtent();


    const layer = useMemo(
        () => featureLayers.find(layerPredicate) as VectorLayer<any>,
        [featureLayers, layerPredicate],
    );

//State management
    const [features, setFeatures] = useState<T[]>([]);
    const [activeFeatures, setActiveFeature ] = useState<T>();


    //visibility filter
    const visibleFeatures = useMemo(
        () => features.filter((f) => f.getGeometry()?.intersectsExtent(viewExtent)),
        [features, viewExtent],
    );



// function that sets the activeFeature based on the
// feature under the mouse pointer coordinate on the map
    function handlePointermove(e: MapBrowserEvent<MouseEvent>) {
        const features = layer?.getSource().getFeaturesAtCoordinate(e.coordinate);
        setActiveFeature(features?.length === 1 ? features[0] : undefined);
    }

    //event handler and cleanup
    useEffect(() => {
        if (layer) {
            map.on("pointermove", handlePointermove)
        }
    }, [map, layer]);



    //setting the feature by manipulating the potential layer by adding the feature to the layer
    function loadFeatures() {
        setFeatures(layer?.getSource()?.getFeatures() || []);
    }

    //Change to the useState manipulating the activeFeature, toggeling the feature on and off
    useEffect(()=> {
        layer?.on("change", loadFeatures);
        loadFeatures();
        return () => {
            layer?.un("change", loadFeatures);
            setFeatures([]);
        };
    }, [layer]);


    return {features, visibleFeatures, activeFeatures, setActiveFeature}
}