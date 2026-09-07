import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { BrainCircuit } from 'lucide-react';
import type { FeatureImportance } from '@/types';

interface Props {
  features: FeatureImportance[];
}

const FEATURE_LABELS: Record<string, string> = {
  rainfall: 'Rainfall',
  soil_moisture: 'Soil Moisture',
  slope_angle: 'Slope Angle',
  elevation: 'Elevation',
};

const FEATURE_COLORS: Record<string, string> = {
  rainfall: '#2e8eff',
  soil_moisture: '#06b6d4',
  slope_angle: '#f59e0b',
  elevation: '#22c55e',
};

function CustomTooltip({ active, payload }: { active?: boolean; payload?: { payload: FeatureImportance }[] }) {
  if (!active || !payload || !payload.length) return null;
  const f = payload[0].payload;
  return (
    <div className="rounded-lg border border-ink-600 bg-ink-800 px-3 py-2 shadow-xl">
      <p className="text-sm font-medium text-white">{FEATURE_LABELS[f.feature] || f.feature}</p>
      <p className="text-xs text-slate-300 tabular-nums">
        Importance: <span className="font-semibold text-primary-400">{(f.importance * 100).toFixed(1)}%</span>
      </p>
    </div>
  );
}

export default function FeatureImportancePanel({ features }: Props) {
  const data = [...features]
    .sort((a, b) => b.importance - a.importance)
    .map((f) => ({
      ...f,
      label: FEATURE_LABELS[f.feature] || f.feature,
    }));

  return (
    <div className="rounded-2xl border border-ink-600 bg-ink-800/80 backdrop-blur p-5 animate-slide-up">
      <div className="flex items-center gap-2 mb-1">
        <BrainCircuit size={18} className="text-accent-400" />
        <h3 className="font-display text-lg font-semibold text-white">Feature Importance</h3>
      </div>
      <p className="text-xs text-slate-400 mb-4 leading-relaxed">
        AI model prediction — Random Forest classifier trained on historical landslide data
      </p>

      <div className="h-56">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} layout="vertical" margin={{ left: 0, right: 20, top: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e2a47" horizontal={false} />
            <XAxis type="number" domain={[0, 1]} tick={{ fill: '#64748b', fontSize: 11 }} tickFormatter={(v) => `${(v * 100).toFixed(0)}%`} axisLine={{ stroke: '#1e2a47' }} />
            <YAxis type="category" dataKey="label" tick={{ fill: '#cbd5e1', fontSize: 12 }} axisLine={{ stroke: '#1e2a47' }} width={100} />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(46,142,255,0.06)' }} />
            <Bar dataKey="importance" radius={[0, 6, 6, 0]} barSize={22}>
              {data.map((entry, i) => (
                <Cell key={i} fill={FEATURE_COLORS[entry.feature] || '#2e8eff'} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
