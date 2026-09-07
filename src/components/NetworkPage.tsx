import { useState, useEffect, useRef } from 'react';
import {
  Droplets,
  Gauge,
  Activity,
  CloudRain,
  Wifi,
  Cloud,
  Battery,
  Signal,
  Clock,
} from 'lucide-react';
import type { SensorInputs } from '@/types';
import {
  type SensorNode,
  createInitialNodes,
  tickNodes,
  syncNodes,
  formatLastSync,
  rssiQuality,
  batteryColor,
} from '@/networkData';
import SensorNodeModal from '@/components/SensorNodeModal';

interface Props {
  zoneName: string;
  inputs: SensorInputs;
}

const ICON_MAP: Record<string, typeof Droplets> = {
  Droplets,
  Gauge,
  Activity,
  CloudRain,
  Wifi,
};

interface LinkDef {
  from: string;
  to: string;
}

const LINKS: LinkDef[] = [
  { from: 'soil-01', to: 'gateway-01' },
  { from: 'tilt-01', to: 'gateway-01' },
  { from: 'vibration-01', to: 'gateway-01' },
  { from: 'rain-01', to: 'gateway-01' },
];

export default function NetworkPage({ zoneName, inputs }: Props) {
  const [nodes, setNodes] = useState<SensorNode[]>(() => createInitialNodes(inputs));
  const [selected, setSelected] = useState<SensorNode | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 800, height: 500 });

  // Recompute dimensions on resize
  useEffect(() => {
    function measure() {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      setDimensions({ width: rect.width, height: rect.height });
    }
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, []);

  // Reset nodes when zone inputs change
  useEffect(() => {
    setNodes(createInitialNodes(inputs));
  }, [inputs]);

  // Tick telemetry every 3 seconds — battery, rssi, lastSync drift
  useEffect(() => {
    const tickInterval = setInterval(() => {
      setNodes((prev) => tickNodes(prev));
    }, 3000);
    return () => clearInterval(tickInterval);
  }, []);

  // Simulate periodic sync events every 7 seconds — resets lastSync
  useEffect(() => {
    const syncInterval = setInterval(() => {
      setNodes((prev) => syncNodes(prev));
    }, 7000);
    return () => clearInterval(syncInterval);
  }, []);

  const nodeMap = new Map(nodes.map((n) => [n.id, n]));
  const gateway = nodes.find((n) => n.kind === 'gateway');
  const cloudRssi = -62;

  function getNodePos(node: SensorNode) {
    return {
      x: (parseFloat(node.position.left) / 100) * dimensions.width,
      y: (parseFloat(node.position.top) / 100) * dimensions.height,
    };
  }

  const cloudPos = { x: dimensions.width * 0.5, y: dimensions.height * 0.92 };

  return (
    <div className="space-y-5">
      {/* Header bar */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="font-display text-xl font-bold text-white">Sensor Mesh Network</h2>
          <p className="text-sm text-slate-400 mt-0.5">
            Live telemetry topology — <span className="text-slate-300">{zoneName}</span>
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-ink-800 border border-ink-600">
            <span className="w-2 h-2 rounded-full bg-success-500 animate-pulse" />
            <span className="text-xs text-slate-300">{nodes.filter((n) => n.connected).length}/{nodes.length} nodes online</span>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-ink-800 border border-ink-600">
            <Wifi size={14} className="text-primary-400" />
            <span className="text-xs text-slate-300">LoRaWAN 868MHz</span>
          </div>
        </div>
      </div>

      {/* Topology canvas */}
      <div className="rounded-2xl border border-ink-600 bg-ink-800/80 backdrop-blur p-5 animate-slide-up">
        <div
          ref={containerRef}
          className="relative w-full"
          style={{ height: '520px' }}
        >
          {/* SVG links layer */}
          <svg
            className="absolute inset-0 w-full h-full pointer-events-none"
            preserveAspectRatio="none"
          >
            {/* Sensor → Gateway links */}
            {LINKS.map((link) => {
              const from = nodeMap.get(link.from);
              const to = nodeMap.get(link.to);
              if (!from || !to) return null;
              const p1 = getNodePos(from);
              const p2 = getNodePos(to);
              const rssi = from.rssi;
              const q = rssiQuality(rssi);
              const midX = (p1.x + p2.x) / 2;
              const midY = (p1.y + p2.y) / 2;
              return (
                <g key={link.from}>
                  <line
                    x1={p1.x} y1={p1.y} x2={p2.x} y2={p2.y}
                    stroke={q.color}
                    strokeWidth={1.5}
                    strokeOpacity={0.35}
                    strokeDasharray="4 3"
                  />
                  <circle cx={midX} cy={midY} r={2} fill={q.color} opacity={0.6} />
                </g>
              );
            })}
            {/* Gateway → Cloud link */}
            {gateway && (() => {
              const gp = getNodePos(gateway);
              const q = rssiQuality(cloudRssi);
              const midX = (gp.x + cloudPos.x) / 2;
              const midY = (gp.y + cloudPos.y) / 2;
              return (
                <g>
                  <line
                    x1={gp.x} y1={gp.y} x2={cloudPos.x} y2={cloudPos.y}
                    stroke={q.color}
                    strokeWidth={2}
                    strokeOpacity={0.4}
                    strokeDasharray="6 4"
                  />
                  <circle cx={midX} cy={midY} r={2.5} fill={q.color} opacity={0.6} />
                </g>
              );
            })()}
          </svg>

          {/* RSSI labels on links */}
          {LINKS.map((link) => {
            const from = nodeMap.get(link.from);
            const to = nodeMap.get(link.to);
            if (!from || !to) return null;
            const p1 = getNodePos(from);
            const p2 = getNodePos(to);
            const midX = (p1.x + p2.x) / 2;
            const midY = (p1.y + p2.y) / 2;
            const q = rssiQuality(from.rssi);
            return (
              <div
                key={`rssi-${link.from}`}
                className="absolute -translate-x-1/2 -translate-y-1/2 px-1.5 py-0.5 rounded bg-ink-900/90 border text-[10px] font-mono tabular-nums whitespace-nowrap"
                style={{ left: midX, top: midY, borderColor: `${q.color}40`, color: q.color }}
              >
                {from.rssi} dBm
              </div>
            );
          })}

          {/* Gateway → Cloud RSSI label */}
          {gateway && (() => {
            const gp = getNodePos(gateway);
            const midX = (gp.x + cloudPos.x) / 2;
            const midY = (gp.y + cloudPos.y) / 2;
            const q = rssiQuality(cloudRssi);
            return (
              <div
                className="absolute -translate-x-1/2 -translate-y-1/2 px-1.5 py-0.5 rounded bg-ink-900/90 border text-[10px] font-mono tabular-nums whitespace-nowrap"
                style={{ left: midX, top: midY, borderColor: `${q.color}40`, color: q.color }}
              >
                {cloudRssi} dBm
              </div>
            );
          })()}

          {/* Sensor nodes */}
          {nodes.map((node) => {
            const pos = getNodePos(node);
            const Icon = ICON_MAP[node.icon] || Activity;
            const isGateway = node.kind === 'gateway';
            const bColor = batteryColor(node.battery);
            const rssiQ = rssiQuality(node.rssi);
            const size = isGateway ? 72 : 60;

            return (
              <div
                key={node.id}
                className="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer group"
                style={{ left: pos.x, top: pos.y }}
                onClick={() => setSelected(node)}
              >
                <div
                  className={`rounded-2xl border bg-ink-700/90 backdrop-blur p-2.5 transition-all group-hover:scale-105 group-hover:border-primary-500/50 ${
                    isGateway
                      ? 'border-primary-500/40 shadow-lg shadow-primary-500/15'
                      : 'border-ink-600'
                  }`}
                  style={{ width: size }}
                >
                  {/* Icon + status dot */}
                  <div className="flex items-center justify-between mb-1.5">
                    <Icon size={isGateway ? 20 : 16} className={isGateway ? 'text-primary-400' : 'text-slate-300'} />
                    <span className={`w-1.5 h-1.5 rounded-full ${node.connected ? 'bg-success-500 animate-pulse' : 'bg-danger-500'}`} />
                  </div>
                  {/* Label */}
                  <p className={`font-medium text-white leading-tight truncate ${isGateway ? 'text-xs' : 'text-[11px]'}`}>
                    {node.label}
                  </p>
                  {/* Connected + battery */}
                  <div className="mt-1.5 flex items-center justify-between">
                    <span className="text-[9px] text-success-400 font-medium">Connected</span>
                    <span className="text-[9px] tabular-nums font-mono" style={{ color: bColor }}>
                      {node.battery}%
                    </span>
                  </div>
                  {/* Last sync */}
                  <div className="flex items-center gap-0.5 mt-0.5">
                    <Clock size={9} className="text-slate-500" />
                    <span className="text-[9px] text-slate-500">{formatLastSync(node.lastSyncSec)}</span>
                  </div>
                </div>
              </div>
            );
          })}

          {/* Cloud node (not clickable) */}
          <div
            className="absolute -translate-x-1/2 -translate-y-1/2"
            style={{ left: cloudPos.x, top: cloudPos.y }}
          >
            <div className="rounded-2xl border border-accent-500/40 bg-ink-700/90 backdrop-blur p-3 shadow-lg shadow-accent-500/15" style={{ width: 80 }}>
              <div className="flex items-center justify-between mb-1.5">
                <Cloud size={20} className="text-accent-400" />
                <span className="w-1.5 h-1.5 rounded-full bg-success-500 animate-pulse" />
              </div>
              <p className="text-xs font-medium text-white leading-tight">GeoNexa Cloud</p>
              <p className="text-[9px] text-slate-400 mt-0.5">Dashboard</p>
            </div>
          </div>
        </div>

        {/* Legend */}
        <div className="mt-4 flex flex-wrap items-center gap-4 pt-4 border-t border-ink-600">
          <span className="text-[10px] uppercase tracking-wider text-slate-500 font-medium">Signal Quality:</span>
          {[
            { label: 'Excellent (≥-70)', color: '#22c55e' },
            { label: 'Good (-70 to -85)', color: '#2e8eff' },
            { label: 'Fair (-85 to -100)', color: '#f59e0b' },
            { label: 'Weak (<-100)', color: '#ef4444' },
          ].map((item) => (
            <div key={item.label} className="flex items-center gap-1.5">
              <span className="w-2.5 h-0.5 rounded" style={{ background: item.color }} />
              <span className="text-[11px] text-slate-400">{item.label}</span>
            </div>
          ))}
          <div className="ml-auto flex items-center gap-1.5 text-[11px] text-slate-400">
            <Battery size={12} className="text-slate-500" />
            Battery drains over time
            <span className="mx-1">•</span>
            <Signal size={12} className="text-slate-500" />
            Click any node for details
          </div>
        </div>
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatCard
          label="Avg Battery"
          value={`${Math.round(nodes.reduce((s, n) => s + n.battery, 0) / nodes.length)}%`}
          color={batteryColor(Math.round(nodes.reduce((s, n) => s + n.battery, 0) / nodes.length))}
        />
        <StatCard
          label="Avg RSSI"
          value={`${Math.round(nodes.reduce((s, n) => s + n.rssi, 0) / nodes.length)} dBm`}
          color={rssiQuality(Math.round(nodes.reduce((s, n) => s + n.rssi, 0) / nodes.length)).color}
        />
        <StatCard
          label="Nodes Online"
          value={`${nodes.filter((n) => n.connected).length}/${nodes.length}`}
          color="#22c55e"
        />
        <StatCard
          label="Packet Rate"
          value="0.5 Hz"
          color="#2e8eff"
        />
      </div>

      <SensorNodeModal node={selected} onClose={() => setSelected(null)} />
    </div>
  );
}

function StatCard({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div className="rounded-2xl border border-ink-600 bg-ink-800/80 backdrop-blur p-4">
      <p className="text-[10px] uppercase tracking-wider text-slate-500 font-medium">{label}</p>
      <p className="font-display text-xl font-bold mt-1 tabular-nums" style={{ color }}>
        {value}
      </p>
    </div>
  );
}
