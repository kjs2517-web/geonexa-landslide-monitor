import { CloudRain, Mountain, Droplets, ArrowUpWideNarrow } from 'lucide-react';
import type { SensorInputs } from '@/types';

interface Props {
  inputs: SensorInputs;
  onChange: (inputs: SensorInputs) => void;
  disabled?: boolean;
}

interface SliderConfig {
  key: keyof SensorInputs;
  label: string;
  icon: typeof CloudRain;
  min: number;
  max: number;
  unit: string;
  color: string;
}

const SLIDERS: SliderConfig[] = [
  { key: 'rainfall', label: 'Rainfall', icon: CloudRain, min: 0, max: 300, unit: 'mm', color: '#2e8eff' },
  { key: 'slope_angle', label: 'Slope Angle', icon: Mountain, min: 0, max: 60, unit: '°', color: '#f59e0b' },
  { key: 'soil_moisture', label: 'Soil Moisture', icon: Droplets, min: 0, max: 100, unit: '%', color: '#06b6d4' },
  { key: 'elevation', label: 'Elevation', icon: ArrowUpWideNarrow, min: 0, max: 3500, unit: 'm', color: '#22c55e' },
];

export default function SensorPanel({ inputs, onChange, disabled }: Props) {
  return (
    <div className="rounded-2xl border border-ink-600 bg-ink-800/80 backdrop-blur p-5 animate-slide-up">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h3 className="font-display text-lg font-semibold text-white">Sensor Inputs</h3>
          <p className="text-xs text-slate-400 mt-0.5">Adjust live telemetry to re-run the model</p>
        </div>
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-primary-500/10 border border-primary-500/30">
          <span className="w-1.5 h-1.5 rounded-full bg-success-500 animate-pulse-slow" />
          <span className="text-[11px] font-medium text-success-400">LIVE</span>
        </div>
      </div>

      <div className="space-y-5">
        {SLIDERS.map((s) => {
          const Icon = s.icon;
          const val = inputs[s.key];
          const pct = ((val - s.min) / (s.max - s.min)) * 100;
          return (
            <div key={s.key} className={disabled ? 'opacity-60 pointer-events-none' : ''}>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Icon size={16} style={{ color: s.color }} />
                  <span className="text-sm font-medium text-slate-200">{s.label}</span>
                </div>
                <span className="text-sm font-display font-semibold tabular-nums text-white">
                  {val}
                  <span className="text-slate-400 text-xs ml-0.5">{s.unit}</span>
                </span>
              </div>
              <input
                type="range"
                min={s.min}
                max={s.max}
                value={val}
                onChange={(e) => onChange({ ...inputs, [s.key]: Number(e.target.value) })}
                className="w-full"
                style={{
                  background: `linear-gradient(to right, ${s.color} 0%, ${s.color} ${pct}%, #1e2a47 ${pct}%, #1e2a47 100%)`,
                }}
              />
              <div className="flex justify-between mt-1 text-[10px] text-slate-500 tabular-nums">
                <span>{s.min}</span>
                <span>{s.max}{s.unit}</span>
              </div>
            </div>
          );
        })}
      </div>

      {disabled && (
        <div className="mt-4 flex items-center gap-2 text-xs text-slate-400">
          <span className="w-2 h-2 rounded-full bg-warning-500 animate-pulse" />
          Select a monitoring zone to enable sensor controls
        </div>
      )}
    </div>
  );
}
