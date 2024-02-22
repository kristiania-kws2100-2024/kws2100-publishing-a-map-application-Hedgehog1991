import React, { useEffect, useRef, useContext } from 'react';
import Draw from 'ol/interaction/Draw';
import { Vector as VectorSource } from 'ol/source';
import { BaseMap } from './BaseMap';
import { useLayer } from './useLayer';
import VectorLayer from 'ol/layer/Vector';
import {GeometryType} from "ol/render/webgl/MixedGeometryBatch";


// reference code.
// https://openlayers.org/en/latest/examples/draw-features.html



// type GeometryOptions = 'Point' | 'LineString' | 'Polygon' | 'Circle' | 'None';
export const DrawComponent: React.FC = () => {

    const { map } = useContext(BaseMap);

    const typeSelect = useRef<HTMLSelectElement>(null);
    const undoButton = useRef<HTMLInputElement>(null);
    const source = new VectorSource({ wrapX: true });
    const vectorLayer = new VectorLayer({ source });

    useLayer(vectorLayer, true);

    let draw: Draw; // global so we can remove it later
    const addInteraction = (type: String) => {
        if (type !== 'None') {
            draw = new Draw({
                source: source,
                type: type as GeometryType,
            });
            map.addInteraction(draw);
        }
    };

    useEffect(() => {
        if (typeSelect.current && undoButton.current) {
            typeSelect.current.onchange = () => {
                map.removeInteraction(draw);
                if (typeSelect.current) {
                    addInteraction(typeSelect.current.value);
                }
            };
          undoButton.current.addEventListener('click', () => { source.clear()
          });

            if (typeSelect.current) {
                addInteraction(typeSelect.current.value);
            }
        }
    }, []);

    return (
        <div>
            <div className="row">
                <div className="col-auto">
          <span className="input-group">
            <label className="input-group-text" htmlFor="type">Geometry type:</label>
            <select className="form-select" id="type" ref={typeSelect}>
              <option value="None">Disabled</option>
              <option value="Point">Point</option>
              <option value="LineString">LineString</option>
              <option value="Polygon">Polygon</option>
              <option value="Circle">Circle</option>
            </select>
            <input className="form-control" type="button" value="Undo" id="undo" ref={undoButton} />
          </span>
                </div>
            </div>
        </div>
    );
};
