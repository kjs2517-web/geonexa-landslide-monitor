import { useState, useEffect, useCallback } from 'react';
import { Map as MapIcon, BarChart3, BellRing, Satellite, TrendingUp } from 'lucide-react';
import Header, { type PageId } from '@/components/Header';
import SensorPanel from '@/components/SensorPanel';
import RiskPanel from '@/components/RiskPanel';
import FeatureImportancePanel from '@/components/FeatureImportancePanel';
import ForecastPanel from '@/components/ForecastPanel';
import ZoneMap from '@/components/ZoneMap';
import AlertsPanel from '@/components/AlertsPanel';
import NetworkPage from '@/components/NetworkPage';
import { REGIONS, INITIAL_ALERTS, levelFromScore, levelColor } from '@/data';
import { predict } from '@/api';
import type { Region, Zone, SensorInputs, PredictionResult, AlertItem } from '@/types';

export default function App() {
  const [page, setPage] = useState<PageId>('dashboard');
  const [selectedRegion, setSelectedRegion] = useState<Region>(REGIONS[0]);
  const [selectedZone, setSelectedZone] = useState<Zone | null>(REGIONS[0].zones[0]);
  const [inputs, setInputs] = useState<SensorInputs>(REGIONS[0].zones[0].sensors);
  const [prediction, setPrediction] = useState<PredictionResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [alerts, setAlerts] = useState<AlertItem[]>(INITIAL_ALERTS);

  // When region changes, auto-select first zone
  const handleRegionChange = (region: Region) => {
    setSelectedRegion(region);
    setSelectedZone(region.zones[0]);
    setInputs(region.zones[0].sensors);
  };

  const handleZoneSelect = (zone: Zone) => {
    setSelectedZone(zone);
    setInputs(zone.sensors);
  };

  // Debounced prediction on input change
  const fetchPrediction = useCallback(async (sensors: SensorInputs) => {
    setLoading(true);
    try {
      const result = await predict(sensors);
      setPrediction(result);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!selectedZone) return;
    const t = setTimeout(() => fetchPrediction(inputs), 300);
    return () => clearTimeout(t);
  }, [inputs, selectedZone, fetchPrediction]);

  const handleAcknowledge = (id: string) => {
    setAlerts((prev) => prev.map((a) => (a.id === id ? { ...a, acknowledged: true } : a)));
  };

  const features = prediction?.feature_importance ?? [];
  const zoneName = selectedZone?.name ?? '—';
  const totalZones = REGIONS.reduce((n, r) => n + r.zones.length, 0);
  const avgRisk = Math.round(
    REGIONS.flatMap((r) => r.zones).reduce((sum, z) => sum + z.baseRisk, 0) / totalZones,
  );
  const criticalCount = REGIONS.flatMap((r) => r.zones).filter((z) => z.baseRisk >= 75).length;

  return (
    <div className="min-h-screen bg-ink-900 grid-bg text-slate-200">
      <Header
        regions={REGIONS}
        selected={selectedRegion}
        onSelect={handleRegionChange}
        page={page}
        onPageChange={setPage}
      />

      <main className="max-w-[1600px] mx-auto px-4 lg:px-6 py-5 space-y-5">
        {page === 'network' ? (
          <NetworkPage zoneName={zoneName} inputs={inputs} />
        ) : (
        <>
        {/* KPI strip */}
        <section className="grid grid-cols-2 lg:grid-cols-4 gap-3 animate-fade-in">
          <KpiCard
            icon={<Satellite size={16} className="text-primary-400" />}
            label="Zones Monitored"
            value={totalZones.toString()}
            sub="across 4 regions"
          />
          <KpiCard
            icon={<TrendingUp size={16} className="text-warning-400" />}
            label="Avg. Risk Index"
            value={avgRisk.toString()}
            sub={levelFromScore(avgRisk)}
            accentHex={levelColor(levelFromScore(avgRisk)).hex}
          />
          <KpiCard
            icon={<BellRing size={16} className="text-danger-400" />}
            label="Critical Zones"
            value={criticalCount.toString()}
            sub="need attention"
          />
          <KpiCard
            icon={<MapIcon size={16} className="text-accent-400" />}
            label="Active Region"
            value={selectedRegion.state}
            sub={`${selectedRegion.zones.length} zones`}
          />
        </section>

        {/* Main grid: map + right column */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* Map — spans 2 cols on desktop */}
          <div className="lg:col-span-2 flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MapIcon size={18} className="text-primary-400" />
                <h2 className="font-display text-lg font-semibold text-white">Zone Risk Map</h2>
              </div>
              {selectedZone && (
                <div className="text-xs text-slate-400">
                  Selected: <span className="text-white font-medium">{selectedZone.name}</span>
                </div>
              )}
            </div>
            <ZoneMap
              region={selectedRegion}
              selectedZone={selectedZone}
              onSelectZone={handleZoneSelect}
            />
          </div>

          {/* Right column: alerts */}
          <div>
            <AlertsPanel alerts={alerts} onAcknowledge={handleAcknowledge} />
          </div>
        </section>

        {/* Analysis grid: sensor controls + risk + forecast */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          <SensorPanel inputs={inputs} onChange={setInputs} disabled={!selectedZone} />
          <RiskPanel result={prediction} loading={loading} zoneName={zoneName} />
          <ForecastPanel
            baseInputs={inputs}
            currentScore={prediction?.risk_score ?? 0}
            enabled={!!selectedZone}
          />
        </section>

        {/* Feature importance */}
        <section className="grid grid-cols-1 gap-5">
          <div className="flex items-center gap-2 mb-[-12px]">
            <BarChart3 size={18} className="text-accent-400" />
            <h2 className="font-display text-lg font-semibold text-white">AI Model Analysis</h2>
          </div>
          <FeatureImportancePanel features={features} />
        </section>
        </>
        )}

        <footer className="pt-4 pb-8 text-center">
          <p className="text-xs text-slate-500">
            GeoNexa — AI-Based Early Warning & Landslide Risk Monitoring System • Smart India Hackathon 2026
          </p>
          <p className="text-[10px] text-slate-600 mt-1">
            Powered by Random Forest classification on historical landslide telemetry • Risk scores are model estimates, not guarantees.
          </p>
        </footer>
      </main>
    </div>
  );
}

function KpiCard({
  icon,
  label,
  value,
  sub,
  accentHex,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  sub: string;
  accentHex?: string;
}) {
  return (
    <div className="rounded-2xl border border-ink-600 bg-ink-800/80 backdrop-blur p-4 flex items-center gap-3 hover:border-ink-500 transition-all">
      <div className="w-10 h-10 rounded-xl bg-ink-700 flex items-center justify-center shrink-0">
        {icon}
      </div>
      <div className="min-w-0">
        <div className="text-[10px] uppercase tracking-wider text-slate-500 font-medium">{label}</div>
        <div
          className="font-display text-lg font-bold leading-tight truncate"
          style={accentHex ? { color: accentHex } : { color: '#ffffff' }}
        >
          {value}
        </div>
        <div className="text-[10px] text-slate-500 truncate">{sub}</div>
      </div>
    </div>
  );
}
