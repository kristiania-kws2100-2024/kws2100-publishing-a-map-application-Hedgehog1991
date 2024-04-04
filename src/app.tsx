import React, {
  MutableRefObject,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { View } from "ol";

import "./app.css";
import { Layer } from "ol/layer";
import TileLayer from "ol/layer/Tile";
import { OSM, StadiaMaps } from "ol/source";
import { map, BaseMap } from "./components/BaseMap";
import { DistrictDefenseCheckbox } from "./modules/forsvarsdistrikter(Polygon)/DistrictDefenseCheckbox";
import { SheltersCheckbox } from "./modules/tilfluktsrom(pointAdvanced)/SheltersCheckbox";
import { SearchShelter } from "./modules/tilfluktsrom(pointAdvanced)/findShelter";
import { BaseLayerSelector } from "./components/BaseLayerSelector";
import { DrawFeature } from "./components/DrawFeature";
import { AirportLayerCheckbox } from "./modules/flyplasser(pointBasic)/AirportCheckbox";
import { DrawFeatureTest } from "./components/DrawFeatureTest";
import { OceanWindCheckbox } from "./modules/windturbines(multiPolygon)/OceanWindCheckbox";
import { DockLayer } from "./modules/docks(cluster)/DockLayer";
import { DockLayerCheckbox } from "./modules/docks(cluster)/DockLAyerCheckBox";
import Minimap from "./components/MiniMap";

export function Application() {
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

  function handleZoomToUser(e: React.MouseEvent) {
    e.preventDefault();
    navigator.geolocation.getCurrentPosition((pos) => {
      const { latitude, longitude } = pos.coords;
      //map is connected to the mapContext.tsx
      map.getView().animate({
        center: [longitude, latitude],
        zoom: 12,
      });
    });
  }

  function handleZoom(
    e: React.MouseEvent,
    center: [number, number],
    zoom: number,
  ) {
    e.preventDefault();
    map.getView().animate({
      center: center,
      zoom: zoom,
    });
  }

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

  return (
    <BaseMap.Provider
      value={{ map, featureLayers, setFeatureLayers, setBaseLayer }}
    >
      <header></header>
      <a className={"mylocation"} href={"#"} onClick={handleZoomToUser}>
        My Location
      </a>
      <a
        className={"zoomOut"}
        href="#"
        onClick={(e) => handleZoom(e, [10, 61], 5)}
      >
        Zoom Out
      </a>
      <SearchShelter />
      <BaseLayerSelector />
      <DrawFeature />
      <Minimap />
      <nav style={{}}>
        <DistrictDefenseCheckbox />
        <SheltersCheckbox />
        <AirportLayerCheckbox />
        <OceanWindCheckbox />
        <DockLayerCheckbox />
      </nav>
      <main className={"mainback"}>
        <div ref={mapRef}></div>
      </main>
    </BaseMap.Provider>
  );
}
