import { MapContainer, TileLayer, CircleMarker, Tooltip as LeafletTooltip, Marker, useMap } from 'react-leaflet';
import L from 'leaflet';
import { useEffect } from 'react';
import type { Region, Zone } from '@/types';
import { levelColor, levelFromScore } from '@/data';

// Fix default marker icon in Leaflet with bundlers
delete (L.Icon.Default.prototype as unknown as { _getIconUrl?: unknown })._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

function MapRecenter({ center }: { center: [number, number] }) {
  const map = useMap();
  useEffect(() => {
    map.flyTo(center, 8, { duration: 1.2 });
  }, [center, map]);
  return null;
}

interface Props {
  region: Region;
  selectedZone: Zone | null;
  onSelectZone: (zone: Zone) => void;
}

function zoneIcon(score: number) {
  const level = levelFromScore(score);
  const c = levelColor(level);
  const size = 26 + Math.round((score / 100) * 10);
  return L.divIcon({
    className: 'risk-marker-pulse',
    html: `<div class="risk-marker" style="width:${size}px;height:${size}px;background:${c.hex};color:${c.hex};">${score}</div>`,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
  });
}

export default function ZoneMap({ region, selectedZone, onSelectZone }: Props) {
  return (
    <div className="rounded-2xl border border-ink-600 bg-ink-800/80 backdrop-blur overflow-hidden animate-slide-up h-full">
      <MapContainer
        center={region.center}
        zoom={8}
        scrollWheelZoom={false}
        className="h-full min-h-[420px] w-full"
        attributionControl={true}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; OpenStreetMap contributors'
        />
        <MapRecenter center={region.center} />

        <Marker position={region.center}>
          <LeafletTooltip sticky>Region: {region.name}</LeafletTooltip>
        </Marker>

        {region.zones.map((zone) => {
          const level = levelFromScore(zone.baseRisk);
          const c = levelColor(level);
          const isSelected = selectedZone?.id === zone.id;
          return (
            <div key={zone.id}>
              <Marker
                position={[zone.lat, zone.lng]}
                icon={zoneIcon(zone.baseRisk)}
                eventHandlers={{ click: () => onSelectZone(zone) }}
              >
                <LeafletTooltip sticky>
                  <div style={{ fontFamily: 'Inter, sans-serif' }}>
                    <strong>{zone.name}</strong>
                    <br />
                    <span>Risk: {zone.baseRisk} ({level})</span>
                  </div>
                </LeafletTooltip>
              </Marker>
              {isSelected && (
                <CircleMarker
                  center={[zone.lat, zone.lng]}
                  radius={24}
                  pathOptions={{ color: c.hex, fillColor: c.hex, fillOpacity: 0.08, weight: 2 }}
                />
              )}
            </div>
          );
        })}
      </MapContainer>
    </div>
  );
}
