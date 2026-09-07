import { Bell, ShieldCheck, AlertTriangle, ChevronRight } from 'lucide-react';
import type { AlertItem } from '@/types';
import { levelColor } from '@/data';

interface Props {
  alerts: AlertItem[];
  onAcknowledge: (id: string) => void;
}

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

export default function AlertsPanel({ alerts, onAcknowledge }: Props) {
  const active = alerts.filter((a) => !a.acknowledged);
  const acked = alerts.filter((a) => a.acknowledged);

  return (
    <div className="rounded-2xl border border-ink-600 bg-ink-800/80 backdrop-blur p-5 animate-slide-up">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Bell size={18} className="text-warning-400" />
          <h3 className="font-display text-lg font-semibold text-white">Active Alerts</h3>
        </div>
        <span className="px-2.5 py-0.5 rounded-full bg-danger-500/15 text-danger-400 text-xs font-semibold border border-danger-500/30">
          {active.length} active
        </span>
      </div>

      <div className="space-y-2.5 max-h-[420px] overflow-y-auto pr-1">
        {active.map((alert) => {
          const c = levelColor(alert.level);
          return (
            <div
              key={alert.id}
              className={`rounded-xl border ${c.border} ${c.bg} p-3.5 transition-all hover:scale-[1.01]`}
            >
              <div className="flex items-start justify-between gap-2 mb-1.5">
                <div className="flex items-center gap-2">
                  <AlertTriangle size={14} className={c.text} />
                  <span className="text-sm font-semibold text-white">{alert.zoneName}</span>
                </div>
                <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${c.bg} ${c.text} border ${c.border} whitespace-nowrap`}>
                  {alert.level.toUpperCase()}
                </span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed mb-2">{alert.message}</p>
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-slate-500">{timeAgo(alert.timestamp)} • Score {alert.score}</span>
                <button
                  onClick={() => onAcknowledge(alert.id)}
                  className="text-[11px] font-medium text-primary-400 hover:text-primary-300 flex items-center gap-1"
                >
                  Acknowledge <ChevronRight size={12} />
                </button>
              </div>
            </div>
          );
        })}

        {acked.length > 0 && (
          <>
            <div className="pt-2 pb-1 text-[10px] uppercase tracking-wider text-slate-500 font-medium">Acknowledged</div>
            {acked.map((alert) => (
              <div key={alert.id} className="rounded-xl border border-ink-600 bg-ink-700/30 p-3 opacity-70">
                <div className="flex items-center gap-2 mb-1">
                  <ShieldCheck size={14} className="text-success-400" />
                  <span className="text-sm font-medium text-slate-300">{alert.zoneName}</span>
                  <span className="ml-auto text-[10px] text-slate-500">{timeAgo(alert.timestamp)}</span>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">{alert.message}</p>
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
}
