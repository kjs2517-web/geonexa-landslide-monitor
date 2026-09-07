import type { Region, AlertItem, RiskLevel } from '@/types';

export const REGIONS: Region[] = [
  {
    id: 'uttarakhand',
    name: 'Uttarakhand Himalayas',
    state: 'Uttarakhand',
    center: [30.3165, 78.0322],
    zones: [
      {
        id: 'uk-1',
        name: 'Mandi District',
        lat: 31.7104,
        lng: 76.932,
        baseRisk: 72,
        population: 125000,
        sensors: { rainfall: 145, slope_angle: 38, soil_moisture: 78, elevation: 1850 },
        lastUpdate: '2 min ago',
      },
      {
        id: 'uk-2',
        name: 'Rudraprayag Valley',
        lat: 30.2844,
        lng: 78.982,
        baseRisk: 64,
        population: 89000,
        sensors: { rainfall: 112, slope_angle: 32, soil_moisture: 65, elevation: 1450 },
        lastUpdate: '5 min ago',
      },
      {
        id: 'uk-3',
        name: 'Chamoli Ridge',
        lat: 30.4197,
        lng: 79.5259,
        baseRisk: 85,
        population: 67000,
        sensors: { rainfall: 168, slope_angle: 45, soil_moisture: 88, elevation: 2200 },
        lastUpdate: '1 min ago',
      },
      {
        id: 'uk-4',
        name: 'Tehri Basin',
        lat: 30.391,
        lng: 78.417,
        baseRisk: 41,
        population: 210000,
        sensors: { rainfall: 65, slope_angle: 22, soil_moisture: 48, elevation: 1100 },
        lastUpdate: '8 min ago',
      },
    ],
  },
  {
    id: 'himachal',
    name: 'Himachal Pradesh',
    state: 'Himachal Pradesh',
    center: [31.1048, 77.1734],
    zones: [
      {
        id: 'hp-1',
        name: 'Kullu Valley',
        lat: 31.9608,
        lng: 77.1095,
        baseRisk: 68,
        population: 95000,
        sensors: { rainfall: 132, slope_angle: 35, soil_moisture: 72, elevation: 1650 },
        lastUpdate: '3 min ago',
      },
      {
        id: 'hp-2',
        name: 'Shimla Hills',
        lat: 31.1048,
        lng: 77.1734,
        baseRisk: 55,
        population: 175000,
        sensors: { rainfall: 95, slope_angle: 28, soil_moisture: 58, elevation: 1350 },
        lastUpdate: '6 min ago',
      },
      {
        id: 'hp-3',
        name: 'Kinnaur Pass',
        lat: 31.5862,
        lng: 78.4452,
        baseRisk: 78,
        population: 34000,
        sensors: { rainfall: 155, slope_angle: 42, soil_moisture: 82, elevation: 2500 },
        lastUpdate: '4 min ago',
      },
    ],
  },
  {
    id: 'sikkim',
    name: 'Sikkim & Darjeeling',
    state: 'Sikkim',
    center: [27.3389, 88.6065],
    zones: [
      {
        id: 'sk-1',
        name: 'Gangtok Slope',
        lat: 27.3389,
        lng: 88.6065,
        baseRisk: 61,
        population: 110000,
        sensors: { rainfall: 120, slope_angle: 30, soil_moisture: 68, elevation: 1650 },
        lastUpdate: '7 min ago',
      },
      {
        id: 'sk-2',
        name: 'North Sikkim',
        lat: 27.6333,
        lng: 88.6333,
        baseRisk: 82,
        population: 45000,
        sensors: { rainfall: 160, slope_angle: 44, soil_moisture: 85, elevation: 2100 },
        lastUpdate: '2 min ago',
      },
      {
        id: 'sk-3',
        name: 'Darjeeling Ridge',
        lat: 27.036,
        lng: 88.2627,
        baseRisk: 70,
        population: 132000,
        sensors: { rainfall: 140, slope_angle: 36, soil_moisture: 75, elevation: 1550 },
        lastUpdate: '5 min ago',
      },
    ],
  },
  {
    id: 'kodagu',
    name: 'Western Ghats — Kodagu',
    state: 'Karnataka',
    center: [12.3375, 75.8069],
    zones: [
      {
        id: 'ka-1',
        name: 'Madikeri Sector',
        lat: 12.4266,
        lng: 75.7395,
        baseRisk: 47,
        population: 88000,
        sensors: { rainfall: 85, slope_angle: 24, soil_moisture: 55, elevation: 1050 },
        lastUpdate: '9 min ago',
      },
      {
        id: 'ka-2',
        name: 'Virajpet Range',
        lat: 12.2038,
        lng: 75.8025,
        baseRisk: 38,
        population: 65000,
        sensors: { rainfall: 60, slope_angle: 18, soil_moisture: 42, elevation: 850 },
        lastUpdate: '11 min ago',
      },
    ],
  },
];

export const INITIAL_ALERTS: AlertItem[] = [
  {
    id: 'alert-1',
    zoneName: 'Chamoli Ridge',
    regionName: 'Uttarakhand Himalayas',
    level: 'Critical',
    score: 85,
    message: 'Sustained heavy rainfall triggering soil saturation. Evacuation advised for riverbank settlements.',
    timestamp: '2026-09-07T08:15:00Z',
    acknowledged: false,
  },
  {
    id: 'alert-2',
    zoneName: 'Kinnaur Pass',
    regionName: 'Himachal Pradesh',
    level: 'High',
    score: 78,
    message: 'Steep slope angle combined with elevated soil moisture. Restrict travel on NH-5 corridor.',
    timestamp: '2026-09-07T07:42:00Z',
    acknowledged: false,
  },
  {
    id: 'alert-3',
    zoneName: 'North Sikkim',
    regionName: 'Sikkim & Darjeeling',
    level: 'High',
    score: 82,
    message: 'Monsoon intensification detected. Road blockage risk on Lachen–Chungthang route.',
    timestamp: '2026-09-07T06:58:00Z',
    acknowledged: false,
  },
  {
    id: 'alert-4',
    zoneName: 'Darjeeling Ridge',
    regionName: 'Sikkim & Darjeeling',
    level: 'Moderate',
    score: 70,
    message: 'Rainfall above seasonal mean. Monitor hill slopes near Kurseong subdivision.',
    timestamp: '2026-09-07T05:30:00Z',
    acknowledged: true,
  },
  {
    id: 'alert-5',
    zoneName: 'Mandi District',
    regionName: 'Uttarakhand Himalayas',
    level: 'High',
    score: 72,
    message: 'Cumulative rainfall crossing warning threshold. Alert local panchayats for readiness.',
    timestamp: '2026-09-07T04:12:00Z',
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
