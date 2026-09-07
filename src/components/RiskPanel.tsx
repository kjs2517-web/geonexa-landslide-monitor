import { ShieldAlert, Activity, TrendingUp, TrendingDown } from 'lucide-react';
import type { PredictionResult } from '@/types';
import { levelColor } from '@/data';

interface Props {
  result: PredictionResult | null;
  loading: boolean;
  zoneName: string;
}

function Gauge({ score, hex }: { score: number; hex: string }) {
  const radius = 70;
  const circ = 2 * Math.PI * radius;
  const dash = (score / 100) * circ;
  return (
    <div className="relative w-44 h-44 mx-auto">
      <svg className="w-full h-full -rotate-90" viewBox="0 0 160 160">
        <circle cx="80" cy="80" r={radius} fill="none" stroke="#1e2a47" strokeWidth="10" />
        <circle
          cx="80"
          cy="80"
          r={radius}
          fill="none"
          stroke={hex}
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={`${dash} ${circ}`}
          style={{ transition: 'stroke-dasharray 0.6s ease, stroke 0.4s ease' }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-display text-4xl font-bold tabular-nums text-white">{score}</span>
        <span className="text-[11px] uppercase tracking-wider text-slate-400 mt-1">Risk Score</span>
      </div>
    </div>
  );
}

export default function RiskPanel({ result, loading, zoneName }: Props) {
  if (loading && !result) {
    return (
      <div className="rounded-2xl border border-ink-600 bg-ink-800/80 p-5 animate-pulse">
        <div className="h-44 rounded-xl bg-ink-700/50" />
      </div>
    );
  }

  if (!result) {
    return (
      <div className="rounded-2xl border border-ink-600 bg-ink-800/80 p-5 flex flex-col items-center justify-center text-center min-h-[280px]">
        <ShieldAlert size={32} className="text-slate-500 mb-3" />
        <p className="text-sm text-slate-400">Select a zone from the map to view risk assessment</p>
      </div>
    );
  }

  const c = levelColor(result.level);
  const score = result.risk_score;
  const trend = score >= 50;

  return (
    <div className={`rounded-2xl border ${c.border} ${c.bg} bg-ink-800/80 backdrop-blur p-5 animate-slide-up ${c.glow}`}>
      <div className="flex items-center justify-between mb-3">
        <div>
          <h3 className="font-display text-lg font-semibold text-white">Risk Assessment</h3>
          <p className="text-xs text-slate-400 mt-0.5">{zoneName}</p>
        </div>
        <div className="flex flex-col items-end gap-1.5">
          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${c.bg} ${c.text} border ${c.border}`}>
            {result.level.toUpperCase()}
          </span>
          {result.offline && (
            <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-warning-500/15 text-warning-400 border border-warning-500/30 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-warning-500" />
              Offline mode
            </span>
          )}
        </div>
      </div>

      <Gauge score={score} hex={c.hex} />

      <div className="mt-4 grid grid-cols-2 gap-3">
        <div className="rounded-xl bg-ink-700/50 border border-ink-600 p-3">
          <div className="flex items-center gap-1.5 text-slate-400 text-xs mb-1">
            <Activity size={14} />
            <span>Confidence</span>
          </div>
          <span className="font-display text-xl font-semibold text-white">
            {Math.min(95, 70 + Math.round(score / 4))}%
          </span>
        </div>
        <div className="rounded-xl bg-ink-700/50 border border-ink-600 p-3">
          <div className="flex items-center gap-1.5 text-slate-400 text-xs mb-1">
            {trend ? <TrendingUp size={14} className="text-danger-400" /> : <TrendingDown size={14} className="text-success-400" />}
            <span>Trend</span>
          </div>
          <span className={`font-display text-xl font-semibold ${trend ? 'text-danger-400' : 'text-success-400'}`}>
            {trend ? 'Rising' : 'Stable'}
          </span>
        </div>
      </div>

      <p className="mt-4 text-xs text-slate-400 leading-relaxed">
        {result.level === 'Critical'
          ? 'Immediate evacuation recommended. Alert local disaster management authority.'
          : result.level === 'High'
            ? 'High probability of slope failure. Restrict access and prepare response teams.'
            : result.level === 'Moderate'
              ? 'Elevated risk — monitor conditions and maintain readiness.'
              : 'Conditions within safe range. Continue routine monitoring.'}
      </p>
    </div>
  );
}
