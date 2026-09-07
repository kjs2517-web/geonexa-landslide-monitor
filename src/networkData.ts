import type { SensorInputs } from '@/types';

export type SensorKind = 'soil' | 'tilt' | 'vibration' | 'rain' | 'gateway';

export interface SensorNode {
  id: string;
  kind: SensorKind;
  label: string;
  icon: string;
  connected: boolean;
  battery: number;
  rssi: number;
  lastSyncSec: number;
  reading: string;
  readingUnit: string;
  rawValue: number;
  position: { top: string; left: string };
}

export interface GatewayLink {
  rssi: number;
  label: string;
}

const SECONDS_AGO = () => Math.floor(Math.random() * 8) + 1;

export function createInitialNodes(zoneInputs: SensorInputs): SensorNode[] {
  return [
    {
      id: 'soil-01',
      kind: 'soil',
      label: 'Soil Moisture',
      icon: 'Droplets',
      connected: true,
      battery: 87,
      rssi: -78,
      lastSyncSec: 2,
      reading: zoneInputs.soil_moisture.toFixed(0),
      readingUnit: '%',
      rawValue: zoneInputs.soil_moisture,
      position: { top: '12%', left: '15%' },
    },
    {
      id: 'tilt-01',
      kind: 'tilt',
      label: 'Tilt Sensor',
      icon: 'Gauge',
      connected: true,
      battery: 92,
      rssi: -82,
      lastSyncSec: 4,
      reading: (zoneInputs.slope_angle * 0.015).toFixed(2),
      readingUnit: '°',
      rawValue: zoneInputs.slope_angle,
      position: { top: '18%', left: '68%' },
    },
    {
      id: 'vibration-01',
      kind: 'vibration',
      label: 'Vibration',
      icon: 'Activity',
      connected: true,
      battery: 74,
      rssi: -91,
      lastSyncSec: 6,
      reading: (Math.random() * 0.8).toFixed(2),
      readingUnit: 'mm/s',
      rawValue: 0,
      position: { top: '55%', left: '10%' },
    },
    {
      id: 'rain-01',
      kind: 'rain',
      label: 'Rain Gauge',
      icon: 'CloudRain',
      connected: true,
      battery: 81,
      rssi: -74,
      lastSyncSec: 1,
      reading: zoneInputs.rainfall.toFixed(0),
      readingUnit: 'mm',
      rawValue: zoneInputs.rainfall,
      position: { top: '58%', left: '72%' },
    },
    {
      id: 'gateway-01',
      kind: 'gateway',
      label: 'LoRa Gateway',
      icon: 'Wifi',
      connected: true,
      battery: 96,
      rssi: -65,
      lastSyncSec: 0,
      reading: 'Active',
      readingUnit: '',
      rawValue: 0,
      position: { top: '38%', left: '41%' },
    },
  ];
}

export function tickNodes(nodes: SensorNode[]): SensorNode[] {
  return nodes.map((n) => {
    const batteryDrain = Math.random() < 0.3 ? -1 : 0;
    const rssiDelta = Math.round((Math.random() - 0.5) * 4);
    const lastSync = n.kind === 'gateway' ? 0 : n.lastSyncSec + Math.floor(Math.random() * 3);
    const readingWobble = (Math.random() - 0.5) * (n.kind === 'vibration' ? 0.3 : n.kind === 'tilt' ? 0.01 : 2);

    let reading = n.reading;
    let rawValue = n.rawValue;
    if (n.kind === 'vibration') {
      rawValue = Math.max(0, n.rawValue + readingWobble);
      reading = rawValue.toFixed(2);
    } else if (n.kind === 'tilt') {
      rawValue = Math.max(0, n.rawValue + readingWobble);
      reading = (rawValue * 0.015).toFixed(2);
    } else if (n.kind === 'rain') {
      rawValue = Math.max(0, n.rawValue + readingWobble);
      reading = rawValue.toFixed(0);
    } else if (n.kind === 'soil') {
      rawValue = Math.min(100, Math.max(0, n.rawValue + readingWobble));
      reading = rawValue.toFixed(0);
    }

    return {
      ...n,
      battery: Math.max(5, Math.min(100, n.battery + batteryDrain)),
      rssi: Math.max(-120, Math.min(-40, n.rssi + rssiDelta)),
      lastSyncSec: Math.min(lastSync, 30),
      reading,
      rawValue,
    };
  });
}

export function syncNodes(nodes: SensorNode[]): SensorNode[] {
  return nodes.map((n) => ({ ...n, lastSyncSec: SECONDS_AGO() }));
}

export function formatLastSync(sec: number): string {
  if (sec < 60) return `${sec} sec ago`;
  const m = Math.floor(sec / 60);
  return `${m} min ago`;
}

export function rssiQuality(rssi: number): { label: string; color: string } {
  if (rssi >= -70) return { label: 'Excellent', color: '#22c55e' };
  if (rssi >= -85) return { label: 'Good', color: '#2e8eff' };
  if (rssi >= -100) return { label: 'Fair', color: '#f59e0b' };
  return { label: 'Weak', color: '#ef4444' };
}

export function batteryColor(pct: number): string {
  if (pct >= 60) return '#22c55e';
  if (pct >= 30) return '#f59e0b';
  return '#ef4444';
}
