import { useState, useRef, useEffect } from 'react';
import { Mountain, ChevronDown, Check, Radar, Globe2, LayoutDashboard, Wifi } from 'lucide-react';
import type { Region } from '@/types';

export type PageId = 'dashboard' | 'network';

interface Props {
  regions: Region[];
  selected: Region;
  onSelect: (region: Region) => void;
  page: PageId;
  onPageChange: (page: PageId) => void;
}

const TABS: { id: PageId; label: string; icon: typeof LayoutDashboard }[] = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'network', label: 'Network', icon: Wifi },
];

export default function Header({ regions, selected, onSelect, page, onPageChange }: Props) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <header className="sticky top-0 z-[1100] border-b border-ink-600 bg-ink-900/90 backdrop-blur-xl">
      <div className="max-w-[1600px] mx-auto px-4 lg:px-6 py-3 flex items-center justify-between gap-4">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center shadow-lg shadow-primary-500/20">
              <Mountain size={22} className="text-white" />
            </div>
            <span className="absolute -top-0.5 -right-0.5 w-3 h-3 rounded-full bg-success-500 border-2 border-ink-900 animate-pulse-slow" />
          </div>
          <div>
            <h1 className="font-display text-xl font-bold text-white leading-none tracking-tight">
              Geo<span className="text-accent-400">Nexa</span>
            </h1>
            <p className="text-[10px] text-slate-400 mt-0.5 hidden sm:block">
              AI Landslide Early Warning & Risk Monitoring
            </p>
          </div>
        </div>

        {/* Page tabs */}
        <nav className="hidden sm:flex items-center gap-1 rounded-xl bg-ink-800 border border-ink-600 p-1">
          {TABS.map((tab) => {
            const Icon = tab.icon;
            const active = page === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => onPageChange(tab.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                  active
                    ? 'bg-primary-500 text-white shadow-sm shadow-primary-500/30'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-ink-700'
                }`}
              >
                <Icon size={15} />
                {tab.label}
              </button>
            );
          })}
        </nav>

        {/* Status indicators */}
        <div className="hidden lg:flex items-center gap-4">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-ink-800 border border-ink-600">
            <Radar size={14} className="text-success-400 animate-pulse-slow" />
            <span className="text-xs text-slate-300">System Online</span>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-ink-800 border border-ink-600">
            <Globe2 size={14} className="text-primary-400" />
            <span className="text-xs text-slate-300">{regions.reduce((n, r) => n + r.zones.length, 0)} zones monitored</span>
          </div>
        </div>

        {/* Region dropdown */}
        <div className="relative" ref={ref}>
          <button
            onClick={() => setOpen((o) => !o)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-ink-800 border border-ink-600 hover:border-primary-500/50 transition-all min-w-[200px] justify-between"
          >
            <div className="flex items-center gap-2">
              <Globe2 size={16} className="text-primary-400" />
              <div className="text-left">
                <div className="text-[10px] text-slate-500 leading-none">Region</div>
                <div className="text-sm font-medium text-white leading-tight">{selected.name}</div>
              </div>
            </div>
            <ChevronDown size={16} className={`text-slate-400 transition-transform ${open ? 'rotate-180' : ''}`} />
          </button>

          {open && (
            <div className="absolute right-0 top-full mt-2 w-72 rounded-xl border border-ink-600 bg-ink-800 shadow-2xl shadow-black/40 overflow-hidden animate-fade-in z-[1200]">
              <div className="px-3 py-2 border-b border-ink-600">
                <span className="text-[10px] uppercase tracking-wider text-slate-500 font-medium">Monitoring Regions</span>
              </div>
              {regions.map((r) => (
                <button
                  key={r.id}
                  onClick={() => {
                    onSelect(r);
                    setOpen(false);
                  }}
                  className="w-full flex items-center justify-between px-3 py-2.5 hover:bg-ink-700 transition-colors text-left"
                >
                  <div>
                    <div className="text-sm font-medium text-white">{r.name}</div>
                    <div className="text-[11px] text-slate-500">{r.state} • {r.zones.length} zones</div>
                  </div>
                  {r.id === selected.id && <Check size={16} className="text-primary-400" />}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
