import React, { useState, useEffect, useContext, useMemo } from "react";
import {BaseMap} from "../../components/BaseMap";

interface ShelterJson {
    properties: ShelterProperties;
    geometry: {
        type: "Point";
        coordinates: number[];
    };
}

export interface ShelterProperties {
    romnr: number;
    plasser: number;
    adresse: string;
}

export function SearchShelter() {
    const [value, setValue] = useState("");
    const [shelterNames, setShelterNames] = useState<string[]>([]);
    const [shelters, setShelters] = useState<ShelterJson[]>([]);

    const { map, featureLayers } = useContext(BaseMap);

    const shelterLayer = useMemo(
        () => featureLayers.find((l) => l.getClassName() === "shelter"),
        [featureLayers]
    );

    useEffect(() => {
        fetch("./fluktsrom.json")
            .then((response) => response.json())
            .then((data) => {
                const names = data.features.map(
                    (feature: any) => feature.properties.adresse
                );
                setShelters(data.features);
                setShelterNames(names);
            });
    }, []);

    const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setValue(event.target.value);
    };

    const onSearch = (searchTerm: string) => {
        setValue(searchTerm);
        console.log("search ", searchTerm);
    };

    const onSelect = (shelter: ShelterProperties) => {
        const selectedShelter = shelters.find(
            (s) => s.properties.adresse === shelter.adresse
        );
        if (selectedShelter) {
            map.getView().animate({
                center: selectedShelter.geometry.coordinates,
                zoom: 12
            });
        }
    };

    return (
        <div className="searchShelter">
            <div className="search-container">
                Find Shelter
                <div className="search-inner">
                    <input
                        className={"searchinput"}
                        type="text"
                        value={value}
                        onChange={onChange}
                    />

                </div>
                <div className="dropdown">
                    {shelters
                        .filter((s) => {
                            const searchTerm = value.toLowerCase();
                            const shelterAddress = s.properties.adresse.toLowerCase();
                            return searchTerm && shelterAddress.startsWith(searchTerm);
                        })
                        .map((s, index) => (
                            <div
                                onClick={() => onSelect(s.properties)}
                                className="dropdown-row"
                                key={index}
                            >
                                {s.properties.adresse}
                            </div>
                        ))}
                </div>
            </div>
        </div>
    );
}




