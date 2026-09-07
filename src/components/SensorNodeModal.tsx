import { X, Battery, Clock, Signal, Activity, Droplets, Gauge, CloudRain, Wifi } from 'lucide-react';
import type { SensorNode } from '@/networkData';
import { formatLastSync, rssiQuality, batteryColor } from '@/networkData';

interface Props {
  node: SensorNode | null;
  onClose: () => void;
}

const ICON_MAP: Record<string, typeof Droplets> = {
  Droplets,
  Gauge,
  Activity,
  CloudRain,
  Wifi,
};

const KIND_DESCRIPTION: Record<string, string> = {
  soil: 'Capacitive soil moisture probe buried at 30cm depth. Measures volumetric water content to detect soil saturation preceding slope failure.',
  tilt: 'MEMS inclinometer mounted on a reference post. Detects minute ground displacement and tilt changes along the slope face.',
  vibration: 'Piezoelectric accelerometer monitoring micro-seismic activity. Detects early rock fracturing and debris movement signals.',
  rain: 'Tipping-bucket rain gauge recording cumulative precipitation. The primary trigger variable in the landslide prediction model.',
  gateway: 'LoRaWAN concentrator aggregating telemetry from all field sensors and relaying packets to the GeoNexa cloud dashboard.',
};

export default function SensorNodeModal({ node, onClose }: Props) {
  if (!node) return null;
  const Icon = ICON_MAP[node.icon] || Activity;
  const rssiQ = rssiQuality(node.rssi);
  const bColor = batteryColor(node.battery);

  return (
    <div
      className="fixed inset-0 z-[2000] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-2xl border border-ink-600 bg-ink-800 shadow-2xl animate-slide-up overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="relative px-5 py-4 border-b border-ink-600 bg-gradient-to-br from-ink-700/60 to-ink-800">
          <button
            onClick={onClose}
            className="absolute top-3 right-3 w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-white hover:bg-ink-600 transition-all"
          >
            <X size={18} />
          </button>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-primary-500/15 border border-primary-500/30 flex items-center justify-center">
              <Icon size={24} className="text-primary-400" />
            </div>
            <div>
              <h3 className="font-display text-lg font-semibold text-white">{node.label}</h3>
              <p className="text-xs text-slate-400 font-mono">{node.id}</p>
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="p-5 space-y-4">
          {/* Current reading — hero */}
          <div className="rounded-xl bg-ink-700/50 border border-ink-600 p-4 text-center">
            <p className="text-[10px] uppercase tracking-wider text-slate-500 font-medium mb-1">Current Reading</p>
            <p className="font-display text-3xl font-bold text-white tabular-nums">
              {node.reading}
              {node.readingUnit && <span className="text-lg text-slate-400 ml-1">{node.readingUnit}</span>}
            </p>
          </div>

          {/* Telemetry grid */}
          <div className="grid grid-cols-3 gap-3">
            <div className="rounded-xl bg-ink-700/40 border border-ink-600 p-3 text-center">
              <Battery size={16} className="mx-auto mb-1.5" style={{ color: bColor }} />
              <p className="text-[10px] uppercase tracking-wider text-slate-500">Battery</p>
              <p className="font-display text-lg font-bold tabular-nums" style={{ color: bColor }}>
                {node.battery}%
              </p>
            </div>
            <div className="rounded-xl bg-ink-700/40 border border-ink-600 p-3 text-center">
              <Signal size={16} className="mx-auto mb-1.5" style={{ color: rssiQ.color }} />
              <p className="text-[10px] uppercase tracking-wider text-slate-500">RSSI</p>
              <p className="font-display text-lg font-bold tabular-nums" style={{ color: rssiQ.color }}>
                {node.rssi}
              </p>
            </div>
            <div className="rounded-xl bg-ink-700/40 border border-ink-600 p-3 text-center">
              <Clock size={16} className="mx-auto mb-1.5 text-slate-400" />
              <p className="text-[10px] uppercase tracking-wider text-slate-500">Last Sync</p>
              <p className="font-display text-sm font-bold text-white">{formatLastSync(node.lastSyncSec)}</p>
            </div>
          </div>

          {/* Connection status */}
          <div className="flex items-center justify-between rounded-xl bg-ink-700/40 border border-ink-600 px-4 py-3">
            <div className="flex items-center gap-2">
              <span className={`w-2 h-2 rounded-full ${node.connected ? 'bg-success-500 animate-pulse' : 'bg-danger-500'}`} />
              <span className="text-sm font-medium text-slate-200">
                {node.connected ? 'Connected' : 'Disconnected'}
              </span>
            </div>
            <span className="text-xs text-slate-400">
              Signal: <span style={{ color: rssiQ.color }} className="font-medium">{rssiQ.label}</span>
            </span>
          </div>

          {/* Description */}
          <div>
            <p className="text-xs text-slate-400 leading-relaxed">{KIND_DESCRIPTION[node.kind]}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
