import { useContext, useEffect } from "react";
import { BaseMap } from "./BaseMap";
import { Layer } from "ol/layer";

export function useLayer(layer: Layer, checked: boolean) {
    const { setLayers } = useContext(BaseMap);

    useEffect(() => {
        if (checked) {
            setLayers((old) => [...old, layer]);
        }
        return () => {
            setLayers((old) => old.filter((l) => l !== layer));
        };
    }, [checked]);
}
