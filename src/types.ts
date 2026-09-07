export type RiskLevel = 'Low' | 'Moderate' | 'High' | 'Critical';

export interface SensorInputs {
  rainfall: number;
  slope_angle: number;
  soil_moisture: number;
  elevation: number;
}

export interface FeatureImportance {
  feature: string;
  importance: number;
}

export interface PredictionResult {
  risk_score: number;
  level: RiskLevel;
  feature_importance: FeatureImportance[];
  offline?: boolean;
}

export interface Zone {
  id: string;
  name: string;
  lat: number;
  lng: number;
  baseRisk: number;
  population: number;
  sensors: SensorInputs;
  lastUpdate: string;
}

export interface Region {
  id: string;
  name: string;
  state: string;
  center: [number, number];
  zones: Zone[];
}

export interface AlertItem {
  id: string;
  zoneName: string;
  regionName: string;
  level: RiskLevel;
  score: number;
  message: string;
  timestamp: string;
  acknowledged: boolean;
}

export interface ForecastPoint {
  hour: number;
  label: string;
  current: number;
  predicted: number;
  rainfall: number;
}
