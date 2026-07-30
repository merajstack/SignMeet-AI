import React, { useState, useEffect } from 'react';
import { AdminMetrics } from '../types';

export const AdminPanel: React.FC = () => {
  const [metrics, setMetrics] = useState<AdminMetrics>({
    activeUsers: 1420,
    mrr: 28400,
    totalTranslationsToday: 48920,
    gpuStatus: {
      provider: "RunPod GPU Cloud",
      model: "NVIDIA RTX 4090 / A100 Tensor Core",
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

  const [logs, setLogs] = useState<string[]>([
    "[10:45:12] INFO: WebSocket frame stream connected for user session SJ-892",
    "[10:45:14] INFRA: RunPod GPU node #4 latency stable at 42ms",
    "[10:45:18] GEMINI: Sentence generator context window expanded to 2048 tokens",
    "[10:45:22] MEDIA-PIPE: Hand landmark pose tracking active (21 nodes per hand)",
  ]);

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        const res = await fetch('/api/admin/metrics');
        if (res.ok) {
          const data = await res.json();
          setMetrics(data);
        }
      } catch (err) {
        console.warn("Failed to fetch admin metrics:", err);
      }
    };

    fetchAdminData();
    const interval = setInterval(fetchAdminData, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full min-h-screen bg-[#121c2a] text-white pt-24 pb-16 px-6 md:px-12">
      <div className="max-w-[1440px] mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-white/10 pb-6">
          <div>
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[#89f5e7] text-[28px]">admin_panel_settings</span>
              <h1 className="font-display text-3xl font-extrabold text-white">System Architecture & Admin Panel</h1>
            </div>
            <p className="font-body-lg text-base text-white/70 mt-1">
              Real-time monitoring of RunPod GPU inference pipeline, MediaPipe landmark streaming, and API health.
            </p>
          </div>

          <div className="flex items-center gap-3 bg-white/10 px-4 py-2 rounded-full border border-white/15">
            <span className="w-3 h-3 bg-emerald-400 rounded-full animate-ping"></span>
            <span className="text-xs font-mono font-bold text-[#89f5e7] uppercase">System Status: OPERATIONAL</span>
          </div>
        </div>

        {/* Top Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-[#1c2636] p-6 rounded-3xl border border-white/10 space-y-2">
            <span className="text-xs font-mono text-white/60 uppercase">ACTIVE USER ACCOUNTS</span>
            <div className="font-display text-3xl text-white font-bold">{metrics.activeUsers}</div>
            <span className="text-xs text-emerald-400">+14% growth this week</span>
          </div>

          <div className="bg-[#1c2636] p-6 rounded-3xl border border-white/10 space-y-2">
            <span className="text-xs font-mono text-white/60 uppercase">MONTHLY REVENUE (MRR)</span>
            <div className="font-display text-3xl text-[#89f5e7] font-bold">${metrics.mrr.toLocaleString()}</div>
            <span className="text-xs text-white/60">Stripe Billing Pipeline</span>
          </div>

          <div className="bg-[#1c2636] p-6 rounded-3xl border border-white/10 space-y-2">
            <span className="text-xs font-mono text-white/60 uppercase">TRANSLATIONS TODAY</span>
            <div className="font-display text-3xl text-white font-bold">{metrics.totalTranslationsToday.toLocaleString()}</div>
            <span className="text-xs text-emerald-400">98.4% mean accuracy</span>
          </div>

          <div className="bg-[#1c2636] p-6 rounded-3xl border border-white/10 space-y-2">
            <span className="text-xs font-mono text-white/60 uppercase">INFERENCE LATENCY</span>
            <div className="font-display text-3xl text-[#89f5e7] font-bold">{metrics.gpuStatus.latencyMs} ms</div>
            <span className="text-xs text-emerald-400">Target: &lt;300ms</span>
          </div>
        </div>

        {/* GPU & Infrastructure Status Box */}
        <div className="grid lg:grid-cols-12 gap-8">
          <div className="lg:col-span-7 bg-[#1c2636] p-8 rounded-3xl border border-white/10 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="font-headline-lg text-xl text-white flex items-center gap-2">
                <span className="material-symbols-outlined text-[#89f5e7]">memory</span>
                RunPod GPU Node Status
              </h2>
              <span className="px-3 py-1 bg-emerald-500/20 text-emerald-300 rounded-full text-xs font-bold border border-emerald-500/40">
                Online
              </span>
            </div>

            <div className="grid sm:grid-cols-2 gap-4 text-xs font-mono">
              <div className="p-4 bg-white/5 rounded-2xl space-y-1">
                <span className="text-white/50 block">DEVICE MODEL</span>
                <span className="text-white font-bold text-sm">{metrics.gpuStatus.model}</span>
              </div>

              <div className="p-4 bg-white/5 rounded-2xl space-y-1">
                <span className="text-white/50 block">GPU UTILIZATION</span>
                <span className="text-[#89f5e7] font-bold text-sm">{metrics.gpuStatus.utilization}%</span>
                <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden mt-1">
                  <div className="bg-[#89f5e7] h-full" style={{ width: `${metrics.gpuStatus.utilization}%` }}></div>
                </div>
              </div>

              <div className="p-4 bg-white/5 rounded-2xl space-y-1">
                <span className="text-white/50 block">VRAM USAGE</span>
                <span className="text-white font-bold text-sm">{metrics.gpuStatus.vramUsed} GB / {metrics.gpuStatus.vramTotal} GB</span>
              </div>

              <div className="p-4 bg-white/5 rounded-2xl space-y-1">
                <span className="text-white/50 block">TEMPERATURE</span>
                <span className="text-white font-bold text-sm">{metrics.gpuStatus.tempCelsius}°C</span>
              </div>
            </div>
          </div>

          {/* System Stream Log Terminal */}
          <div className="lg:col-span-5 bg-[#0a1018] p-6 rounded-3xl border border-white/10 space-y-4 font-mono text-xs">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <span className="text-[#89f5e7] font-bold">Inference Stream Logs</span>
              <span className="w-2 h-2 bg-emerald-400 rounded-full animate-ping"></span>
            </div>

            <div className="h-48 overflow-y-auto space-y-2 text-white/80">
              {logs.map((log, i) => (
                <div key={i} className="leading-relaxed">
                  {log}
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
