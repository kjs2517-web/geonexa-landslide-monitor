import type { SensorInputs, PredictionResult, RiskLevel, ForecastPoint } from '@/types';
import { levelFromScore } from '@/data';

const API_URL = 'https://6157b07e-f2f0-452a-b218-c6371738fd34-00-29pmmg408je1.pike.replit.dev//predict';

const DEFAULT_FEATURE_IMPORTANCE = [
  { feature: 'rainfall', importance: 0.38 },
  { feature: 'soil_moisture', importance: 0.27 },
  { feature: 'slope_angle', importance: 0.22 },
  { feature: 'elevation', importance: 0.13 },
];

/**
 * Local fallback risk calculation — weighted heuristic used when the
 * prediction API is unreachable. Mirrors the feature weighting of the
 * Random Forest model so the dashboard degrades gracefully.
 */
export function localPredict(inputs: SensorInputs): PredictionResult {
  const { rainfall, slope_angle, soil_moisture, elevation } = inputs;
  const nRainfall = Math.min(rainfall / 200, 1);
  const nSlope = Math.min(slope_angle / 60, 1);
  const nMoisture = Math.min(soil_moisture / 100, 1);
  const nElevation = Math.min(elevation / 3000, 1);

  const score =
    nRainfall * 38 +
    nMoisture * 27 +
    nSlope * 22 +
    nElevation * 13;

  const risk_score = Math.round(Math.min(Math.max(score, 0), 100));

  return {
    risk_score,
    level: levelFromScore(risk_score),
    feature_importance: DEFAULT_FEATURE_IMPORTANCE,
    offline: true,
  };
}

export async function predict(inputs: SensorInputs): Promise<PredictionResult> {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000);

    const res = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        rainfall: inputs.rainfall,
        slope_angle: inputs.slope_angle,
        soil_moisture: inputs.soil_moisture,
        elevation: inputs.elevation,
      }),
      signal: controller.signal,
    });
    clearTimeout(timeout);

    if (!res.ok) throw new Error(`API ${res.status}`);

    const data = await res.json();

    const risk_score =
      typeof data.risk_score === 'number'
        ? Math.round(data.risk_score)
        : typeof data.risk === 'number'
          ? Math.round(data.risk)
          : localPredict(inputs).risk_score;

    const level: RiskLevel =
      data.level && ['Low', 'Moderate', 'High', 'Critical'].includes(data.level)
        ? data.level
        : levelFromScore(risk_score);

    const feature_importance =
      Array.isArray(data.feature_importance) && data.feature_importance.length > 0
        ? data.feature_importance.map((f: { feature?: string; name?: string; importance?: number; value?: number }) => ({
            feature: f.feature || f.name || 'unknown',
            importance: typeof f.importance === 'number' ? f.importance : typeof f.value === 'number' ? f.value : 0,
          }))
        : DEFAULT_FEATURE_IMPORTANCE;

    return { risk_score, level, feature_importance };
  } catch {
    return localPredict(inputs);
  }
}

/**
 * Simulates a rainfall forecast trend over the next `hours` and calls
 * the prediction API for each future timestep to project the risk curve.
 * The "current" line holds today's risk constant; the "predicted" line
 * reflects rising rainfall feeding the model.
 */
export async function forecast(
  base: SensorInputs,
  hours: number,
  currentScore: number,
): Promise<ForecastPoint[]> {
  const steps = hours <= 6 ? 6 : hours <= 12 ? 8 : 10;
  const points: ForecastPoint[] = [];
  const rainfallIncrement = Math.max(8, base.rainfall * 0.04);

  for (let i = 0; i <= steps; i++) {
    const hour = Math.round((hours / steps) * i);
    const futureRainfall = base.rainfall + rainfallIncrement * i + Math.sin(i * 0.6) * 5;
    const futureMoisture = Math.min(base.soil_moisture + i * 1.5, 100);
    const futureInputs: SensorInputs = {
      ...base,
      rainfall: Math.round(futureRainfall),
      soil_moisture: Math.round(futureMoisture),
    };

    const result = await predict(futureInputs);
    const label = `+${hour}h`;
    points.push({
      hour,
      label,
      current: currentScore,
      predicted: result.risk_score,
      rainfall: Math.round(futureRainfall),
    });
  }

  return points;
}
