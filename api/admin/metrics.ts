export default async function handler(req, res) {
  res.status(200).json({
    activeUsers: 1420,
    mrr: 28400,
    totalTranslationsToday: 48920,
    gpuStatus: {
      provider: "RunPod GPU Cloud",
      model: "NVIDIA RTX 4090 / A100",
      utilization: 34.2,
      vramUsed: 6.8,
      vramTotal: 24.0,
      latencyMs: 42,
      tempCelsius: 58
    },
    apiStatus: {
      status: "healthy",
      requestsPerMin: 1840,
      errorRate: 0.02
    }
  });
}
