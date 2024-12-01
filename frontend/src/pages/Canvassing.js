import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, GeoJSON, useMap } from 'react-leaflet';
import { useAuth } from '../contexts/AuthContext';
import districtData from '../data/neukirchen.json';
import 'leaflet/dist/leaflet.css';

const Canvassing = () => {
  const { user } = useAuth();
  const [selectedArea, setSelectedArea] = useState(null);
  const [visitData, setVisitData] = useState({});

  const MapController = () => {
    const map = useMap();
    
    useEffect(() => {
      // Berechne die Bounds für Neukirchen-Vluyn
      const coordinates = districtData.features[0].geometry.coordinates[0];
      const bounds = coordinates.reduce((bounds, coord) => {
        return [
          [
            Math.min(bounds[0][0], coord[1]),
            Math.min(bounds[0][1], coord[0])
          ],
          [
            Math.max(bounds[1][0], coord[1]),
            Math.max(bounds[1][1], coord[0])
          ]
        ];
      }, [[90, 180], [-90, -180]]);
      
      map.fitBounds(bounds, { padding: [20, 20] });
    }, [map]);

    return null;
  };

  const getDistrictStyle = () => ({
    fillColor: '#2196F3',
    weight: 2,
    opacity: 1,
    color: 'white',
    dashArray: '3',
    fillOpacity: 0.7
  });

  const onEachDistrict = (feature, layer) => {
    const districtName = feature.properties.name;
    
    layer.bindPopup(`
      <div class="p-3">
        <h3 class="font-bold">${districtName}</h3>
        <p class="mt-2">Klicken Sie, um diesen Bezirk auszuwählen</p>
      </div>
    `);

    layer.on({
      mouseover: (e) => {
        const layer = e.target;
        layer.setStyle({
          weight: 5,
          color: '#666',
          dashArray: '',
          fillOpacity: 0.7
        });
      },
      mouseout: (e) => {
        const layer = e.target;
        layer.setStyle(getDistrictStyle());
      },
      click: (e) => {
        setSelectedArea(feature);
      }
    });
  };

  return (
    <div className="h-[calc(100vh-6rem)]">
      <div className="grid grid-cols-4 gap-4 h-full">
        {/* Hauptkarte */}
        <div className="col-span-3 bg-white rounded-lg shadow-sm overflow-hidden relative">
          <MapContainer
            style={{ height: '100%', width: '100%' }}
            zoom={13}
            center={[51.4413742, 6.5467641]}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <GeoJSON
              data={districtData}
              style={getDistrictStyle}
              onEachFeature={onEachDistrict}
            />
            <MapController />
          </MapContainer>
        </div>

        {/* Seitenleiste */}
        <div className="space-y-4">
          {/* District Info */}
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              {selectedArea ? selectedArea.properties.name : 'Wählen Sie einen Bezirk'}
            </h2>
            {selectedArea && (
              <div className="space-y-4">
                <div>
                  <div className="text-sm text-gray-500 mb-1">Fortschritt</div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 rounded-full h-2"
                      style={{ width: '0%' }}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm text-gray-500">Haushalte</div>
                    <div className="text-lg font-semibold">-</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">Besucht</div>
                    <div className="text-lg font-semibold">-</div>
                  </div>
                </div>

                <button
                  className="w-full bg-blue-600 text-white rounded-md px-4 py-2 hover:bg-blue-700 transition-colors"
                >
                  Canvassing starten
                </button>
              </div>
            )}
          </div>

          {/* Statistiken */}
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <h3 className="font-semibold text-gray-900 mb-3">Statistiken</h3>
            <div className="space-y-2 text-sm text-gray-600">
              <p>Bezirk wird eingerichtet...</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Canvassing;