import { useState } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  ReferenceLine,
} from 'recharts';
import { LineChart as LineIcon, CloudRain } from 'lucide-react';
import type { ForecastPoint, SensorInputs } from '@/types';
import { forecast as runForecast } from '@/api';

interface Props {
  baseInputs: SensorInputs;
  currentScore: number;
  enabled: boolean;
}

const HORIZONS = [6, 12, 24] as const;

function ForecastTooltip({ active, payload, label }: { active?: boolean; payload?: { name: string; value: number; color: string }[]; label?: string }) {
  if (!active || !payload || !payload.length) return null;
  const predicted = payload.find((p) => p.name === 'Predicted');
  const rainfall = payload.find((p) => p.name === 'Rainfall');
  return (
    <div className="rounded-lg border border-ink-600 bg-ink-800 px-3 py-2 shadow-xl">
      <p className="text-xs font-medium text-white mb-1">{label}</p>
      {predicted && (
        <p className="text-xs text-slate-300">
          Predicted risk: <span className="font-semibold" style={{ color: predicted.color }}>{predicted.value}</span>
        </p>
      )}
      {rainfall && (
        <p className="text-xs text-slate-300">
          Simulated rainfall: <span className="font-semibold text-primary-400">{rainfall.value} mm</span>
        </p>
      )}
    </div>
  );
}

export default function ForecastPanel({ baseInputs, currentScore, enabled }: Props) {
  const [horizon, setHorizon] = useState<6 | 12 | 24>(12);
  const [data, setData] = useState<ForecastPoint[]>([]);
  const [loading, setLoading] = useState(false);

  async function generate() {
    if (!enabled) return;
    setLoading(true);
    try {
      const points = await runForecast(baseInputs, horizon, currentScore);
      setData(points);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="rounded-2xl border border-ink-600 bg-ink-800/80 backdrop-blur p-5 animate-slide-up">
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center gap-2">
          <LineIcon size={18} className="text-accent-400" />
          <h3 className="font-display text-lg font-semibold text-white">Risk Forecast</h3>
        </div>
        <div className="flex gap-1 rounded-lg bg-ink-700/60 p-1">
          {HORIZONS.map((h) => (
            <button
              key={h}
              onClick={() => setHorizon(h)}
              className={`px-2.5 py-1 rounded-md text-xs font-medium transition-all ${
                horizon === h
                  ? 'bg-primary-500 text-white'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {h}h
            </button>
          ))}
        </div>
      </div>
      <p className="text-xs text-slate-400 mb-4">
        Projected risk from simulated rainfall trend over the next {horizon} hours
      </p>

      {data.length === 0 ? (
        <div className="h-56 flex flex-col items-center justify-center gap-3 text-center">
          <CloudRain size={28} className="text-slate-500" />
          <p className="text-sm text-slate-400 max-w-xs">
            {enabled
              ? 'Generate a forecast to see how rising rainfall may shift the risk curve.'
              : 'Select a monitoring zone to enable forecasting.'}
          </p>
          <button
            onClick={generate}
            disabled={!enabled || loading}
            className="px-4 py-2 rounded-lg bg-primary-500 hover:bg-primary-600 disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-medium transition-all flex items-center gap-2"
          >
            {loading ? (
              <>
                <span className="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                Simulating...
              </>
            ) : (
              'Generate Forecast'
            )}
          </button>
        </div>
      ) : (
        <div>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data} margin={{ left: -16, right: 12, top: 4, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e2a47" />
                <XAxis dataKey="label" tick={{ fill: '#64748b', fontSize: 11 }} axisLine={{ stroke: '#1e2a47' }} />
                <YAxis domain={[0, 100]} tick={{ fill: '#64748b', fontSize: 11 }} axisLine={{ stroke: '#1e2a47' }} />
                <Tooltip content={<ForecastTooltip />} />
                <Legend wrapperStyle={{ fontSize: 11, paddingTop: 4 }} />
                <ReferenceLine y={50} stroke="#f59e0b" strokeDasharray="4 4" strokeOpacity={0.3} />
                <ReferenceLine y={75} stroke="#ef4444" strokeDasharray="4 4" strokeOpacity={0.3} />
                <Line
                  type="monotone"
                  dataKey="current"
                  name="Current"
                  stroke="#2a3a5e"
                  strokeWidth={2.5}
                  dot={{ r: 3, fill: '#2a3a5e' }}
                  activeDot={{ r: 5 }}
                />
                <Line
                  type="monotone"
                  dataKey="predicted"
                  name="Predicted"
                  stroke="#22d3ee"
                  strokeWidth={2.5}
                  strokeDasharray="6 4"
                  dot={{ r: 3, fill: '#22d3ee' }}
                  activeDot={{ r: 5 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-3 flex items-center justify-between text-xs">
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1.5 text-slate-400">
                <span className="w-3 h-0.5 bg-slate-500" /> Current
              </span>
              <span className="flex items-center gap-1.5 text-slate-400">
                <span className="w-3 h-0.5 border-t-2 border-dashed border-accent-400" /> Predicted
              </span>
            </div>
            <button
              onClick={generate}
              disabled={loading}
              className="text-primary-400 hover:text-primary-300 font-medium flex items-center gap-1 disabled:opacity-50"
            >
              {loading ? 'Updating...' : 'Refresh'}
            </button>
          </div>

          {data.length > 1 && (
            <div className="mt-3 flex items-center gap-2 text-xs text-slate-400 rounded-lg bg-ink-700/40 px-3 py-2">
              <CloudRain size={14} className="text-primary-400" />
              Peak rainfall: <span className="font-semibold text-primary-400">{Math.max(...data.map((d) => d.rainfall))} mm</span>
              <span className="mx-1">•</span>
              Peak risk: <span className="font-semibold text-accent-400">{Math.max(...data.map((d) => d.predicted))}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
