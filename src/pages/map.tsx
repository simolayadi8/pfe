import { useEffect, useRef, useState } from "react";
import {
  MapContainer,
  TileLayer,
  LayersControl,
  FeatureGroup,
  useMap,
  GeoJSON,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { GeoSearchControl, OpenStreetMapProvider } from "leaflet-geosearch";
import "leaflet-geosearch/dist/geosearch.css";
import DefaultLayout from "@/layouts/default";
import { useTheme } from "next-themes";
import { useNavigate } from "react-router-dom";

const Loader2 = () => (
  <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
);

const DefaultIcon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});
L.Marker.prototype.options.icon = DefaultIcon;

const MapControls = ({ onZoneLoaded }: { onZoneLoaded: (bounds: L.LatLngBounds) => void }) => {
  const map = useMap();
  const featureGroup = useRef(L.featureGroup());

  useEffect(() => {
    const provider = new OpenStreetMapProvider();
    const searchControl = new GeoSearchControl({
      provider,
      style: "bar",
      showMarker: true,
      autoClose: true,
      searchLabel: "Rechercher..."
    });

    map.addControl(searchControl);

    map.on("layeradd", (e) => {
      if (e.layer instanceof L.GeoJSON) {
        const bounds = e.layer.getBounds();
        if (bounds.isValid()) onZoneLoaded(bounds);
      }
    });

    return () => {
      map.removeControl(searchControl);
    };
  }, [map, onZoneLoaded]);

  return <FeatureGroup ref={featureGroup} />;
};

export default function MapPage() {
  const [zoneData, setZoneData] = useState<any>(null);
  const [parcellesData, setParcellesData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [mapBounds, setMapBounds] = useState<L.LatLngBounds | null>(null);
  const { resolvedTheme } = useTheme();
  const navigate = useNavigate();

  useEffect(() => {
    // Charger les données de zone existantes
    fetch("/data/zone.geojson")
      .then((res) => res.json())
      .then((data) => {
        setZoneData(data);
      })
      .catch(() => {
        // Si le fichier zone.geojson n'existe pas, ce n'est pas grave
      });

    // Charger les parcelles
    fetch("/data/parcelles.geojson")
      .then((res) => res.json())
      .then((data) => {
        setParcellesData(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Erreur lors du chargement des parcelles:", error);
        setLoading(false);
      });
  }, []);

  const onEachFeature = (feature: any, layer: any) => {
    if (feature.properties && feature.properties.id) {
      layer.bindPopup(`
        <div>
          <h3><strong>Parcelle ${feature.properties.id}</strong></h3>
          <p>Cliquez pour voir les détails dans l'analyse</p>
        </div>
      `);
    }
  };

  const getParcelleStyle = (feature: any) => {
    const colors = ['#ff7800', '#00ff78', '#7800ff', '#ff0078', '#78ff00'];
    const parcelleId = feature.properties?.id || 1;
    return {
      color: colors[(parcelleId - 1) % colors.length],
      weight: 3,
      opacity: 0.8,
      fillOpacity: 0.3
    };
  };

  return (
    <DefaultLayout>
      <div className="w-full p-4">
        <div className="bg-white dark:bg-gray-900 text-center py-4 rounded shadow-md mb-4">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
            Visualisation des Parcelles Agricoles
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mt-2">
            5 parcelles avec données NDVI et rendement disponibles
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 p-2 rounded-xl shadow-lg border border-gray-300 dark:border-gray-700">
          <div className="h-[70vh] relative">
            {loading && (
              <div className="absolute z-[1000] w-full h-full bg-white dark:bg-black/70 flex items-center justify-center">
                <Loader2 />
              </div>
            )}

            <MapContainer
              zoom={9}
              scrollWheelZoom={true}
              className="h-full rounded-xl"
              center={[33.773, -6.876]}
              bounds={[
                [33.768, -6.883],
                [33.780, -6.864]
              ]}
              boundsOptions={{ padding: [20, 20] }}
            >
              <LayersControl position="topright">
                <LayersControl.BaseLayer checked name="OpenStreetMap">
                  <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                  />
                </LayersControl.BaseLayer>

                <LayersControl.BaseLayer name="Satellite Esri">
                  <TileLayer
                    url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
                    attribution="Tiles &copy; Esri"
                  />
                </LayersControl.BaseLayer>

                <LayersControl.BaseLayer name="Topographique (OTM)">
                  <TileLayer 
                    url="https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png" 
                    attribution='&copy; OpenTopoMap'
                  />
                </LayersControl.BaseLayer>

                {zoneData && (
                  <LayersControl.Overlay name="Zone d'étude">
                    <GeoJSON
                      data={zoneData}
                      style={{ color: "#ff7800", weight: 2 }}
                      eventHandlers={{
                        add: (e) => {
                          const bounds = (e.target as any).getBounds?.();
                          if (bounds) setMapBounds(bounds);
                        },
                      }}
                    />
                  </LayersControl.Overlay>
                )}

                {parcellesData && (
                  <LayersControl.Overlay checked name="Parcelles">
                    <GeoJSON
                      data={parcellesData}
                      style={getParcelleStyle}
                      onEachFeature={onEachFeature}
                      eventHandlers={{
                        add: (e) => {
                          const bounds = (e.target as any).getBounds?.();
                          if (bounds) setMapBounds(bounds);
                        },
                      }}
                    />
                  </LayersControl.Overlay>
                )}
              </LayersControl>

              <MapControls onZoneLoaded={(b) => setMapBounds(b)} />
            </MapContainer>
          </div>

          {/* Boutons d'action */}
          <div className="flex justify-center gap-4 mt-6">
            <button
              onClick={() => navigate("/analysis")}
              className={`px-6 py-2 font-semibold rounded-full shadow-md transition-all duration-300 hover:scale-105
                ${resolvedTheme === "dark"
                  ? "bg-blue-600 text-white hover:bg-blue-500"
                  : "bg-blue-500 text-white hover:bg-blue-600"
                }`}
            >
              📊 Analyser
            </button>
          </div>
        </div>
      </div>
    </DefaultLayout>
  );
}

