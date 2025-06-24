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
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Button } from "@heroui/button";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure } from "@heroui/modal";

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

interface ParcelleData {
  id: number;
  rendement: { [year: string]: number };
  ndvi: { [year: string]: number[] };
}

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

const ZoomToParcelles = () => {
  const map = useMap();
  
  const zoomToParcelles = () => {
    // Coordonnées approximatives de la zone des parcelles
    const bounds = L.latLngBounds([
      [33.768, -6.883],
      [33.780, -6.864]
    ]);
    map.fitBounds(bounds, { padding: [20, 20] });
  };

  useEffect(() => {
    // Créer un contrôle personnalisé pour le zoom
    const ZoomControl = L.Control.extend({
      onAdd: function() {
        const container = L.DomUtil.create('div', 'leaflet-bar leaflet-control leaflet-control-custom');
        container.style.backgroundColor = 'white';
        container.style.width = '30px';
        container.style.height = '30px';
        container.style.cursor = 'pointer';
        container.style.display = 'flex';
        container.style.alignItems = 'center';
        container.style.justifyContent = 'center';
        container.style.fontSize = '16px';
        container.innerHTML = '⌖';
        container.title = 'Zoomer sur les parcelles';
        
        container.onclick = function() {
          zoomToParcelles();
        };
        
        return container;
      }
    });

    const zoomControl = new ZoomControl({ position: 'topleft' });
    map.addControl(zoomControl);

    return () => {
      map.removeControl(zoomControl);
    };
  }, [map]);

  return null;
};

export default function MapPage() {
  const [zoneData, setZoneData] = useState<any>(null);
  const [parcellesData, setParcellesData] = useState<any>(null);
  const [rendementData, setRendementData] = useState<any[]>([]);
  const [ndviData, setNdviData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [mapBounds, setMapBounds] = useState<L.LatLngBounds | null>(null);
  const [selectedParcelle, setSelectedParcelle] = useState<ParcelleData | null>(null);
  const { resolvedTheme } = useTheme();
  const navigate = useNavigate();
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  useEffect(() => {
    // Charger toutes les données
    Promise.all([
      fetch("/data/zone.geojson").then(res => res.json()).catch(() => null),
      fetch("/data/parcelles.geojson").then(res => res.json()),
      fetch("/data/rendement.csv").then(res => res.text()),
      fetch("/data/NDVI_Parcelles.csv").then(res => res.text())
    ]).then(([zone, parcelles, rendementCsv, ndviCsv]) => {
      setZoneData(zone);
      setParcellesData(parcelles);
      
      // Parser les données de rendement
      const rendementLines = rendementCsv.split('\n').slice(1);
      const rendementParsed = rendementLines.map(line => {
        const [parcelle, annee, rendement] = line.split(',');
        return { parcelle: parseInt(parcelle), annee: parseInt(annee), rendement: parseFloat(rendement) };
      }).filter(item => !isNaN(item.parcelle));
      setRendementData(rendementParsed);

      // Parser les données NDVI
      const ndviLines = ndviCsv.split('\n').slice(1);
      const ndviParsed = ndviLines.map(line => {
        const parts = line.split(';');
        if (parts.length >= 7) {
          return {
            parcelle: parseInt(parts[0]),
            annee: parseInt(parts[1]),
            ndvi: [
              parseFloat(parts[2]),
              parseFloat(parts[3]),
              parseFloat(parts[4]),
              parseFloat(parts[5]),
              parseFloat(parts[6])
            ]
          };
        }
        return null;
      }).filter(item => item && !isNaN(item.parcelle));
      setNdviData(ndviParsed);
      
      setLoading(false);
    }).catch(error => {
      console.error("Erreur lors du chargement des données:", error);
      setLoading(false);
    });
  }, []);

  const getParcelleData = (parcelleId: number): ParcelleData => {
    const rendements: { [year: string]: number } = {};
    const ndvis: { [year: string]: number[] } = {};
    
    rendementData.forEach(item => {
      if (item.parcelle === parcelleId) {
        rendements[item.annee.toString()] = item.rendement;
      }
    });

    ndviData.forEach(item => {
      if (item.parcelle === parcelleId) {
        ndvis[item.annee.toString()] = item.ndvi;
      }
    });

    return {
      id: parcelleId,
      rendement: rendements,
      ndvi: ndvis
    };
  };

  const onEachFeature = (feature: any, layer: any) => {
    if (feature.properties && feature.properties.id) {
      const parcelleId = feature.properties.id;
      
      layer.bindPopup(`
        <div style="min-width: 200px;">
          <h3><strong>Parcelle ${parcelleId}</strong></h3>
          <p>Cliquez pour voir les détails</p>
          <button onclick="window.showParcelleDetails(${parcelleId})" 
                  style="background: #0066cc; color: white; border: none; padding: 8px 16px; border-radius: 4px; cursor: pointer; margin-top: 8px;">
            Voir les détails
          </button>
        </div>
      `);

      layer.on('click', () => {
        const data = getParcelleData(parcelleId);
        setSelectedParcelle(data);
        onOpen();
      });
    }
  };

  // Fonction globale pour les popups
  useEffect(() => {
    (window as any).showParcelleDetails = (parcelleId: number) => {
      const data = getParcelleData(parcelleId);
      setSelectedParcelle(data);
      onOpen();
    };
  }, [rendementData, ndviData]);

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
            5 parcelles avec données NDVI et rendement disponibles - Cliquez sur une parcelle pour voir les détails
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
              <ZoomToParcelles />
            </MapContainer>
          </div>

          {/* Boutons d'action */}
          <div className="flex justify-center gap-4 mt-6">
            <Button
              color="primary"
              variant="shadow"
              onPress={() => navigate("/analysis")}
            >
              Analyser
            </Button>
            <Button
              color="secondary"
              variant="shadow"
              onPress={() => navigate("/prediction")}
            >
              Modèle STAFNet
            </Button>
          </div>
        </div>

        {/* Modal pour les détails de la parcelle */}
        <Modal 
          isOpen={isOpen} 
          onOpenChange={onOpenChange}
          size="2xl"
          scrollBehavior="inside"
          placement="center"
          className="z-[9999]"
          style={{ zIndex: 9999 }}
          backdrop="blur"
          classNames={{
            backdrop: "z-[9998]",
            wrapper: "z-[9999]",
            base: "z-[9999]"
          }}
        >
          <ModalContent>
            {(onClose) => (
              <>
                <ModalHeader className="flex flex-col gap-1">
                  <h2>Détails de la Parcelle {selectedParcelle?.id}</h2>
                  <p className="text-sm text-gray-500">Données historiques</p>
                </ModalHeader>
                <ModalBody>
                  {selectedParcelle && (
                    <div className="space-y-6">
                      {/* Données historiques de rendement */}
                      <Card>
                        <CardHeader>
                          <h3 className="text-lg font-bold">Rendements Historiques</h3>
                        </CardHeader>
                        <CardBody>
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            {Object.entries(selectedParcelle.rendement).map(([year, value]) => (
                              <div key={year} className="text-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                                <p className="font-bold text-lg">{year}</p>
                                <p className="text-blue-600 font-semibold">{value} kg/ha</p>
                              </div>
                            ))}
                          </div>
                        </CardBody>
                      </Card>

                      {/* Données NDVI */}
                      <Card>
                        <CardHeader>
                          <h3 className="text-lg font-bold">Évolution NDVI</h3>
                        </CardHeader>
                        <CardBody>
                          <div className="space-y-3">
                            {Object.entries(selectedParcelle.ndvi).map(([year, values]) => (
                              <div key={year} className="border-l-4 border-green-500 pl-4">
                                <p className="font-semibold mb-2">{year}</p>
                                <div className="grid grid-cols-5 gap-2 text-sm">
                                  {values.map((ndvi, index) => (
                                    <div key={index} className="text-center p-2 bg-green-50 dark:bg-green-900/20 rounded">
                                      <p className="text-xs text-gray-500">Mois {index + 1}</p>
                                      <p className="font-semibold">{ndvi.toFixed(3)}</p>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            ))}
                          </div>
                        </CardBody>
                      </Card>
                    </div>
                  )}
                </ModalBody>
                <ModalFooter>
                  <Button color="danger" variant="light" onPress={onClose}>
                    Fermer
                  </Button>
                  <Button 
                    color="primary" 
                    onPress={() => {
                      onClose();
                      navigate("/analysis");
                    }}
                  >
                    Voir l'analyse complète
                  </Button>
                </ModalFooter>
              </>
            )}
          </ModalContent>
        </Modal>
      </div>
    </DefaultLayout>
  );
}

