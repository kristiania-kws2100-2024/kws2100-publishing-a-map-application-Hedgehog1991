import { useContext, useEffect } from "react";
import { BaseMap } from "./BaseMap";
import { Layer } from "ol/layer";

export function useLayer(layer: Layer, checked: boolean) {
  const { setFeatureLayers } = useContext(BaseMap);

  useEffect(() => {
    if (checked) {
      setFeatureLayers((old) => [...old, layer]);
    }
    return () => {
      setFeatureLayers((old) => old.filter((l) => l !== layer));
    };
  }, [checked]);
}
