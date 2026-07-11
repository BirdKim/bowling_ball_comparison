import balls from '../data/balls.json'

export const RG_MIN = 2.46, RG_MAX = 2.57;
export const DIFF_MIN = 0.025, DIFF_MAX = 0.065;
export const MASS_BIAS_MIN = 0.0, MASS_BIAS_MAX = 0.03;
// Finish specs
export const FINISH_FRICTION = { "500": 100, "1000": 80, "1500": 68, "2000": 60, "3000": 48, "4000": 39, "4500": 36, "5000": 33, "5500": 30 };
// Coverstock specs
export const COVER_TRACTION = { "Plastic": 0, "Urethane": 80, "Urethane Solid Reactive": 85, "Pearl Reactive": 40, "Hybrid Reactive": 65, "Solid Reactive": 90 };
export const ENERGY_RETENTION = { "Plastic": 100, "Urethane": 20, "Urethane Solid Reactive": 40, "Pearl Reactive": 90, "Hybrid Reactive": 65, "Solid Reactive": 45 };
export const BACKEND_RESPONSE = { "Plastic": 0, "Urethane": 20, "Urethane Solid Reactive": 40, "Pearl Reactive": 90, "Hybrid Reactive": 70, "Solid Reactive": 55 };

function clamp(n, lo = 0, hi = 100) { return Math.max(lo, Math.min(hi, n)); }
function norm(val, min, max) { return clamp(((val - min) / (max - min)) * 100); }

export function scoreBall(ball) {
  const rgScore = norm(ball.rg, RG_MIN, RG_MAX);       // higher = more length potential
  const diffScore = norm(ball.differential, DIFF_MIN, DIFF_MAX);
  const massBiasScore = norm(ball.intermediate_differential, MASS_BIAS_MIN, MASS_BIAS_MAX);

  const finishFriction = FINISH_FRICTION[ball.finish_grit] ?? 68;

  const coverTraction = COVER_TRACTION[ball.coverstock_type] ?? 65;
  const energyRetention = ENERGY_RETENTION[ball.coverstock_type] ?? 65;
  const backendResponse = BACKEND_RESPONSE[ball.coverstock_type] ?? 65;

  const length = clamp(
    rgScore * 0.40 +
    (100 - finishFriction) * 0.30 +
    energyRetention * 0.10 +
    (100 - coverTraction) * 0.20
  );

  const midlaneRead = clamp(
    coverTraction * 0.45 +
    finishFriction * 0.30 +
    (100 - rgScore) * 0.15 +
    diffScore * 0.10
  );

  const flarePotential = clamp(
    diffScore * 0.80 +
    massBiasScore * 0.20
  );

  const backendShape = clamp(
    backendResponse * 0.25 +
    massBiasScore * 0.45 +
    energyRetention * 0.20 +
    finishFriction * 0.10
  );

  // const continuation = clamp(
  //   energyRetention * 0.40 +
  //   diffScore * 0.30 +
  //   backendResponse * 0.20 +
  //   massBiasScore * 0.10
  // );

  const overallHook = clamp(
    coverTraction * 0.30 +
    diffScore * 0.25 +
    energyRetention * 0.15 +
    finishFriction * 0.15 +
    backendResponse * 0.05 +
    (100 - rgScore) * 0.05 +
    massBiasScore * 0.05
  );

  return {
    length: Math.round(length),
    midlaneRead: Math.round(midlaneRead),
    flarePotential: Math.round(flarePotential),
    backendShape: Math.round(backendShape),
    // continuation: Math.round(continuation),
    overallHook: Math.round(overallHook),
    rgScore: Math.round(rgScore),
    diffScore: Math.round(diffScore),
    massBiasScore: Math.round(massBiasScore),
    finishFriction,
    coverTraction,
    energyRetention,
    backendResponse,
  };
}