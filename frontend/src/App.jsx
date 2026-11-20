import { useState, useEffect } from 'react';

const API_URL = 'http://localhost:5000/api/telemetry';

export default function App() {
  const [data, setData] = useState({
    fieldId: 'ZONE-A1',
    moisture: '--',
    temperature: '--',
    npk: { n: '--', p: '--', k: '--' },
    valveStatus: 'OFF',
  });
  const [loading, setLoading] = useState(false);

  const fetchLatest = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/latest`);
      const json = await res.json();
      setData(json);
    } catch (err) {
      console.error('Fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  
  const simulateSensor = async () => {
    const mockPayload = {
      fieldId: 'ZONE-A1',
      moisture: Math.floor(Math.random() * 50) + 10, 
      temperature: Math.floor(Math.random() * 15) + 22, 
      npk: { n: 40, p: 25, k: 30 },
    };

    try {
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(mockPayload),
      });
      const saved = await res.json();
      setData(saved);
    } catch (err) {
      console.error('Simulation error:', err);
    }
  };

  useEffect(() => {
    fetchLatest();
  }, []);

  const isValveOn = data.valveStatus === 'ON';

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-8">
      <div className="max-w-4xl mx-auto">
        <header className="mb-8 border-b border-slate-800 pb-4 flex justify-between items-end">
          <div>
            <h1 className="text-3xl font-bold text-emerald-400">AgroSense</h1>
            <p className="text-slate-400 text-sm">SDG 13 Live Soil & Irrigation Monitor</p>
          </div>
          <span className="text-xs font-mono bg-slate-900 border border-slate-800 px-3 py-1 rounded text-slate-300">
            Field: {data.fieldId || 'ZONE-A1'}
          </span>
        </header>

        <main className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-slate-900 p-6 rounded-xl border border-slate-800">
            <h3 className="text-xs uppercase tracking-wider text-slate-400 mb-2">Soil Moisture</h3>
            <p className="text-4xl font-semibold text-sky-400">{data.moisture}%</p>
          </div>

          <div className="bg-slate-900 p-6 rounded-xl border border-slate-800">
            <h3 className="text-xs uppercase tracking-wider text-slate-400 mb-2">Temperature</h3>
            <p className="text-4xl font-semibold text-amber-400">{data.temperature}°C</p>
          </div>

          <div className="bg-slate-900 p-6 rounded-xl border border-slate-800">
            <h3 className="text-xs uppercase tracking-wider text-slate-400 mb-2">Irrigation Valve</h3>
            <span
              className={`inline-block mt-1 px-4 py-1.5 rounded-full text-sm font-bold ${
                isValveOn
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                  : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
              }`}
            >
              {data.valveStatus}
            </span>
            {data.recommendedLiters > 0 && (
              <p className="text-xs text-slate-400 mt-3">
                AI Target: <span className="text-emerald-400 font-semibold">{data.recommendedLiters} L</span>
              </p>
            )}
          </div>
        </main>

        <div className="mt-8 pt-6 border-t border-slate-800 flex flex-wrap items-center gap-6">
          <button
            onClick={fetchLatest}
            disabled={loading}
            className="mx-1 px-6 py-3 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-semibold tracking-wide shadow-sm transition cursor-pointer disabled:opacity-50"
          >
            {loading ? 'Syncing...' : 'Fetch Live Data'}
          </button>

          <button
            onClick={simulateSensor}
            className="mx-1 px-6 py-3 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-sm font-semibold tracking-wide shadow-sm transition cursor-pointer"
          >
            Simulate Sensor Reading
          </button>
        </div>
      </div>
    </div>
  );
}