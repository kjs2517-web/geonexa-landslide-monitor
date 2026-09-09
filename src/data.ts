import type { Region, AlertItem, RiskLevel } from '@/types';

export const REGIONS: Region[] = [
  {
    id: 'mizoram',
    name: 'Mizoram',
    state: 'Mizoram',
    center: [23.7271, 92.7176],
    zones: [
      {
        id: 'mz-1',
        name: 'Aizawl Quarry Belt',
        lat: 23.7271,
        lng: 92.7176,
        baseRisk: 85,
        population: 95000,
        sensors: { rainfall: 168, slope_angle: 45, soil_moisture: 88, elevation: 1130 },
        lastUpdate: '1 min ago',
      },
      {
        id: 'mz-2',
        name: 'Champhai',
        lat: 23.4567,
        lng: 93.3295,
        baseRisk: 64,
        population: 42000,
        sensors: { rainfall: 112, slope_angle: 32, soil_moisture: 65, elevation: 1450 },
        lastUpdate: '5 min ago',
      },
    ],
  },
  {
    id: 'sikkim',
    name: 'Sikkim',
    state: 'Sikkim',
    center: [27.3389, 88.6065],
    zones: [
      {
        id: 'sk-1',
        name: 'Chaten, North Sikkim',
        lat: 27.6333,
        lng: 88.6333,
        baseRisk: 82,
        population: 45000,
        sensors: { rainfall: 160, slope_angle: 44, soil_moisture: 85, elevation: 2100 },
        lastUpdate: '2 min ago',
      },
      {
        id: 'sk-2',
        name: 'Mangan District, North Sikkim',
        lat: 27.5167,
        lng: 88.5333,
        baseRisk: 72,
        population: 38000,
        sensors: { rainfall: 145, slope_angle: 38, soil_moisture: 78, elevation: 1850 },
        lastUpdate: '3 min ago',
      },
    ],
  },
  {
    id: 'assam-hills',
    name: 'Assam Hills',
    state: 'Assam',
    center: [25.9350, 93.1750],
    zones: [
      {
        id: 'as-1',
        name: 'Dima Hasao Hills, Assam',
        lat: 25.2750,
        lng: 93.0250,
        baseRisk: 78,
        population: 65000,
        sensors: { rainfall: 155, slope_angle: 42, soil_moisture: 82, elevation: 1200 },
        lastUpdate: '4 min ago',
      },
      {
        id: 'as-2',
        name: 'Guwahati Hill Slopes, Assam',
        lat: 26.1445,
        lng: 91.7362,
        baseRisk: 55,
        population: 210000,
        sensors: { rainfall: 95, slope_angle: 28, soil_moisture: 58, elevation: 850 },
        lastUpdate: '6 min ago',
      },
    ],
  },
  {
    id: 'meghalaya',
    name: 'Meghalaya',
    state: 'Meghalaya',
    center: [25.4670, 91.3633],
    zones: [
      {
        id: 'ml-1',
        name: 'Cherrapunji Ridge',
        lat: 25.2700,
        lng: 91.7333,
        baseRisk: 80,
        population: 52000,
        sensors: { rainfall: 175, slope_angle: 40, soil_moisture: 90, elevation: 1300 },
        lastUpdate: '2 min ago',
      },
      {
        id: 'ml-2',
        name: 'Shillong Peak Slopes',
        lat: 25.5650,
        lng: 91.8830,
        baseRisk: 58,
        population: 145000,
        sensors: { rainfall: 105, slope_angle: 26, soil_moisture: 62, elevation: 1500 },
        lastUpdate: '7 min ago',
      },
    ],
  },
  {
    id: 'manipur',
    name: 'Manipur',
    state: 'Manipur',
    center: [24.8133, 93.9333],
    zones: [
      {
        id: 'mn-1',
        name: 'Ukhrul Hill Range',
        lat: 25.0900,
        lng: 94.3617,
        baseRisk: 70,
        population: 48000,
        sensors: { rainfall: 140, slope_angle: 36, soil_moisture: 75, elevation: 1600 },
        lastUpdate: '5 min ago',
      },
      {
        id: 'mn-2',
        name: 'Churachandpur Slopes',
        lat: 24.1300,
        lng: 93.7000,
        baseRisk: 48,
        population: 73000,
        sensors: { rainfall: 70, slope_angle: 22, soil_moisture: 50, elevation: 950 },
        lastUpdate: '9 min ago',
      },
    ],
  },
];

export const INITIAL_ALERTS: AlertItem[] = [
  {
    id: 'alert-1',
    zoneName: 'Aizawl Quarry Belt',
    regionName: 'Mizoram',
    level: 'Critical',
    score: 85,
    message: 'Sustained heavy rainfall triggering soil saturation. Evacuation advised for quarry-edge settlements.',
    timestamp: '2026-09-08T08:15:00Z',
    acknowledged: false,
  },
  {
    id: 'alert-2',
    zoneName: 'Chaten, North Sikkim',
    regionName: 'Sikkim',
    level: 'High',
    score: 82,
    message: 'Monsoon intensification detected. Road blockage risk on Lachen–Chungthang route.',
    timestamp: '2026-09-08T07:42:00Z',
    acknowledged: false,
  },
  {
    id: 'alert-3',
    zoneName: 'Dima Hasao Hills, Assam',
    regionName: 'Assam Hills',
    level: 'High',
    score: 78,
    message: 'Steep slope angle combined with elevated soil moisture. Restrict travel on Haflong–Jatinga corridor.',
    timestamp: '2026-09-08T06:58:00Z',
    acknowledged: false,
  },
  {
    id: 'alert-4',
    zoneName: 'Cherrapunji Ridge',
    regionName: 'Meghalaya',
    level: 'High',
    score: 80,
    message: 'Rainfall well above seasonal mean. Monitor hill slopes near Sohra subdivision.',
    timestamp: '2026-09-08T05:30:00Z',
    acknowledged: true,
  },
  {
    id: 'alert-5',
    zoneName: 'Mangan District, North Sikkim',
    regionName: 'Sikkim',
    level: 'High',
    score: 72,
    message: 'Cumulative rainfall crossing warning threshold. Alert local authorities for readiness.',
    timestamp: '2026-09-08T04:12:00Z',
    acknowledged: true,
  },
];

export function levelFromScore(score: number): RiskLevel {
  if (score >= 75) return 'Critical';
  if (score >= 50) return 'High';
  if (score >= 30) return 'Moderate';
  return 'Low';
}

export function levelColor(level: RiskLevel): {
  text: string;
  bg: string;
  border: string;
  hex: string;
  glow: string;
} {
  switch (level) {
    case 'Critical':
      return { text: 'text-danger-400', bg: 'bg-danger-500/15', border: 'border-danger-500/40', hex: '#ef4444', glow: 'shadow-[0_0_20px_rgba(239,68,68,0.3)]' };
    case 'High':
      return { text: 'text-warning-400', bg: 'bg-warning-500/15', border: 'border-warning-500/40', hex: '#f59e0b', glow: 'shadow-[0_0_20px_rgba(245,158,11,0.25)]' };
    case 'Moderate':
      return { text: 'text-primary-400', bg: 'bg-primary-500/15', border: 'border-primary-500/40', hex: '#2e8eff', glow: 'shadow-[0_0_20px_rgba(46,142,255,0.2)]' };
    default:
      return { text: 'text-success-400', bg: 'bg-success-500/15', border: 'border-success-500/40', hex: '#22c55e', glow: 'shadow-[0_0_20px_rgba(34,197,94,0.2)]' };
  }
}
