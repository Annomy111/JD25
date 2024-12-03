import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, GeoJSON, useMap, Popup } from 'react-leaflet';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import districtData from '../data/neukirchen.json';
import 'leaflet/dist/leaflet.css';

const VISIT_STATUS_OPTIONS = [
  { value: 'completed', label: 'Gespräch geführt' },
  { value: 'not_home', label: 'Nicht angetroffen' },
  { value: 'refused', label: 'Gespräch verweigert' },
  { value: 'to_revisit', label: 'Erneuter Besuch erforderlich' }
];

const VisitDialog = ({ isOpen, onClose, onSubmit, selectedDistrict }) => {
  const [formData, setFormData] = useState({
    address: '',
    status: 'completed',
    notes: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
    setFormData({
      address: '',
      status: 'completed',
      notes: ''
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Besuch dokumentieren</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="address">Adresse</Label>
            <Input
              id="address"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              required
            />
          </div>
          <div>
            <Label htmlFor="status">Status</Label>
            <Select
              value={formData.status}
              onValueChange={(value) => setFormData({ ...formData, status: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {VISIT_STATUS_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="notes">Notizen</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              rows={4}
            />
          </div>
          <Button type="submit" className="w-full">Speichern</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

const TuerZuTuer = () => {
  const { user } = useAuth();
  const [selectedArea, setSelectedArea] = useState(null);
  const [areaData, setAreaData] = useState({});
  const [isVisitDialogOpen, setIsVisitDialogOpen] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchAreaData = async () => {
    try {
      const response = await axios.get('/api/canvassing');
      const areas = response.data;
      const areaMap = {};
      areas.forEach(area => {
        areaMap[area.districtId] = area;
      });
      setAreaData(areaMap);
      setLoading(false);
    } catch (err) {
      setError('Fehler beim Laden der Gebiete');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAreaData();
  }, []);

  const MapController = () => {
    const map = useMap();
    
    useEffect(() => {
      const coordinates = districtData.features[0].geometry.coordinates[0];
      const bounds = coordinates.reduce((bounds, coord) => {
        return [
          [Math.min(bounds[0][0], coord[1]), Math.min(bounds[0][1], coord[0])],
          [Math.max(bounds[1][0], coord[1]), Math.max(bounds[1][1], coord[0])]
        ];
      }, [[90, 180], [-90, -180]]);
      
      map.fitBounds(bounds, { padding: [20, 20] });
    }, [map]);

    return null;
  };

  const getDistrictStyle = (feature) => {
    const districtId = feature.properties.id;
    const area = areaData[districtId];
    
    let fillColor = '#2196F3';
    if (area) {
      if (area.status === 'completed') fillColor = '#4CAF50';
      else if (area.status === 'in_progress') fillColor = '#FFC107';
    }

    return {
      fillColor,
      weight: 2,
      opacity: 1,
      color: 'white',
      dashArray: '3',
      fillOpacity: 0.7
    };
  };

  const onEachDistrict = (feature, layer) => {
    const districtName = feature.properties.name;
    const districtId = feature.properties.id;
    const area = areaData[districtId];
    
    layer.bindPopup(`
      <div class="p-3">
        <h3 class="font-bold">${districtName}</h3>
        <p class="mt-2">Status: ${area ? area.status : 'Nicht begonnen'}</p>
        <p>Fortschritt: ${area ? Math.round(area.progress) : 0}%</p>
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
        layer.setStyle(getDistrictStyle(feature));
      },
      click: (e) => {
        setSelectedArea({ ...feature, data: areaData[districtId] });
      }
    });
  };

  const handleVisitSubmit = async (visitData) => {
    try {
      await axios.post(`/api/canvassing/${selectedArea.properties.id}/visits`, visitData);
      await fetchAreaData();
      setIsVisitDialogOpen(false);
    } catch (err) {
      setError('Fehler beim Speichern des Besuchs');
    }
  };

  const handleAssignArea = async () => {
    try {
      await axios.post(`/api/canvassing/${selectedArea.properties.id}/assign`);
      await fetchAreaData();
    } catch (err) {
      setError('Fehler beim Zuweisen des Gebiets');
    }
  };

  return (
    <div className="h-[calc(100vh-6rem)]">
      <div className="grid grid-cols-4 gap-4 h-full">
        {/* Main Map */}
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

        {/* Sidebar */}
        <div className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* District Info */}
          <Card>
            <CardHeader>
              <CardTitle>
                {selectedArea ? selectedArea.properties.name : 'Wählen Sie einen Bezirk'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {selectedArea && (
                <div className="space-y-4">
                  <div>
                    <div className="text-sm text-gray-500 mb-1">Fortschritt</div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 rounded-full h-2"
                        style={{ width: `${selectedArea.data?.progress || 0}%` }}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-sm text-gray-500">Haushalte</div>
                      <div className="text-lg font-semibold">
                        {selectedArea.data?.totalHouseholds || '-'}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-500">Besucht</div>
                      <div className="text-lg font-semibold">
                        {selectedArea.data?.visitedHouseholds || '-'}
                      </div>
                    </div>
                  </div>

                  {selectedArea.data?.volunteers?.includes(user._id) ? (
                    <Button
                      className="w-full"
                      onClick={() => setIsVisitDialogOpen(true)}
                    >
                      Besuch dokumentieren
                    </Button>
                  ) : (
                    <Button
                      className="w-full"
                      onClick={handleAssignArea}
                    >
                      Gebiet übernehmen
                    </Button>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Statistics */}
          <Card>
            <CardHeader>
              <CardTitle>Statistiken</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm text-gray-600">
                {loading ? (
                  <p>Lade Statistiken...</p>
                ) : selectedArea?.data ? (
                  <>
                    <p>Status: {selectedArea.data.status}</p>
                    <p>Letzte Aktualisierung: {
                      new Date(selectedArea.data.lastUpdated).toLocaleDateString()
                    }</p>
                    <p>Aktive Freiwillige: {selectedArea.data.volunteers?.length || 0}</p>
                  </>
                ) : (
                  <p>Wählen Sie ein Gebiet aus</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <VisitDialog
        isOpen={isVisitDialogOpen}
        onClose={() => setIsVisitDialogOpen(false)}
        onSubmit={handleVisitSubmit}
        selectedDistrict={selectedArea}
      />
    </div>
  );
};

export default TuerZuTuer;