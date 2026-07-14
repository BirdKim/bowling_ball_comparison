export async function recommendBalls(payload, apiKey) {
  return {
    recommendations: [],
    note: apiKey
      ? "Recommendation support is not configured for this build."
      : "Recommendation support is not configured for this build.",
    payload,
  };
}
