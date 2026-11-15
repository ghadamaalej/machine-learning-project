// components/CGPAPredictor.tsx
"use client";

import React, { useState, useEffect } from "react";

interface StudentInput {
  study_hours: number;
  extracurricular_hours: number;
  sleep_hours: number;
  social_hours: number;
  physical_activity_hours: number;
  stress_level: number;
}

const RangeRow: React.FC<{
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  onChange: (v: number) => void;
}> = ({ label, value, min, max, step = 1, onChange }) => {
  const range = Math.max(1, max - min);
  const percent = ((value - min) / range) * 100;

  // dynamic track background (filled portion + remaining)
  const trackStyle: React.CSSProperties = {
    background: `linear-gradient(90deg, rgba(99,102,241,1) ${percent}%, rgba(229,231,235,1) ${percent}%)`,
    transition: 'background 160ms linear',
  };

  const bubbleStyle: React.CSSProperties = {
    left: `${percent}%`,
    transform: 'translateX(-50%)',
    transition: 'left 160ms linear, opacity 120ms linear',
  };

  return (
    <div className="bg-white/80 dark:bg-gray-800/60 p-4 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <div className="text-sm font-medium text-gray-700 dark:text-gray-200">{label}</div>
        <div className="text-sm font-semibold text-indigo-600 dark:text-indigo-300">{value}</div>
      </div>

      <div className="relative">
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(parseFloat(e.target.value))}
          style={trackStyle}
          className="w-full h-1.5 rounded-lg appearance-none cursor-pointer focus:outline-none"
        />

        {/* floating value bubble that follows the thumb */}
        <div
          style={bubbleStyle}
          className="pointer-events-none absolute -top-7 z-10 bg-indigo-600 text-white text-xs font-medium px-2 py-1 rounded-md shadow-md"
        >
          {value}
        </div>
      </div>

      <div className="flex justify-between text-xs text-gray-400 mt-2">
        <span>{min}</span>
        <span>{max}</span>
      </div>
    </div>
  );
};

const CGPAPredictor: React.FC = () => {
  const [formData, setFormData] = useState<StudentInput>({
    study_hours: 4,
    extracurricular_hours: 2,
    sleep_hours: 7,
    social_hours: 2,
    physical_activity_hours: 1,
    stress_level: 5,
  });

  const [prediction, setPrediction] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showResult, setShowResult] = useState(false);
  const [modelMeta, setModelMeta] = useState<any>(null);

  const handleInputChange = (field: keyof StudentInput, value: number) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      // Call local FastAPI service (run predict_service with model.joblib present)
      const res = await fetch("/api/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.detail || `Request failed: ${res.status}`);
      }

      const data = await res.json();
      if (typeof data.prediction === "number") {
        setPrediction(data.prediction);
        setModelMeta(data.metadata ?? null);
      } else {
        setError("Invalid response from prediction service");
      }
    } catch (err: any) {
      setError(err?.message || "Prediction error");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // animate results panel when a prediction arrives
    if (prediction !== null) {
      setShowResult(false);
      const t = setTimeout(() => setShowResult(true), 60);
      return () => clearTimeout(t);
    }
    setShowResult(false);
  }, [prediction]);

  const computeContributions = () => {
    // Normalize inputs to 0..1 using the same ranges used in the UI
    const norm = {
      study_hours: Math.min(12, Math.max(0, formData.study_hours)) / 12,
      extracurricular_hours: Math.min(10, Math.max(0, formData.extracurricular_hours)) / 10,
      sleep_hours: Math.min(12, Math.max(0, formData.sleep_hours)) / 12,
      social_hours: Math.min(10, Math.max(0, formData.social_hours)) / 10,
      physical_activity_hours: Math.min(6, Math.max(0, formData.physical_activity_hours)) / 6,
      stress_level: Math.min(10, Math.max(1, formData.stress_level)) / 10,
    };

    // heuristic weights (positive = helps CGPA, negative = hurts)
    const weights: Record<string, number> = {
      study_hours: 0.45,
      sleep_hours: 0.25,
      stress_level: -0.3,
      extracurricular_hours: 0.06,
      social_hours: 0.03,
      physical_activity_hours: 0.05,
    };

    const raw = Object.keys(weights).map((k) => {
      const key = k as keyof typeof norm;
      return { label: k.replace(/_/g, ' '), value: norm[key] * weights[k] };
    });

    // compute absolute shares for bar widths
    const maxAbs = Math.max(...raw.map((r) => Math.abs(r.value)), 0.0001);
    const bars = raw.map((r) => ({ label: r.label, val: r.value, pct: Math.abs(r.value) / maxAbs }));
    return bars;
  };

  return (
    <section className="max-w-4xl mx-auto px-6 py-10">
      <div className="bg-gradient-to-r from-white via-indigo-50 to-white dark:from-gray-900/40 dark:via-gray-900/30 rounded-3xl p-8 shadow-lg">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div>
            <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900 dark:text-gray-100">CGPA Predictor</h2>
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">Estimate your CGPA using lifestyle inputs — fast, private, and local.</p>
          </div>
          <div className="text-right">
            <div className="inline-flex items-center gap-3 bg-white/90 dark:bg-gray-800/70 px-4 py-2 rounded-full border border-gray-100 dark:border-gray-700 shadow-sm">
              <span className="text-xs text-gray-500">Result</span>
              <div className={`text-lg font-bold ${prediction ? 'text-indigo-600 dark:text-indigo-300' : 'text-gray-400'}`}>
                {prediction ? `${prediction.toFixed(2)} / 4.0` : '—'}
              </div>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <RangeRow
            label="Study Hours / day"
            value={formData.study_hours}
            min={0}
            max={12}
            step={0.5}
            onChange={(v) => handleInputChange('study_hours', v)}
          />

          <RangeRow
            label="Extracurricular / day"
            value={formData.extracurricular_hours}
            min={0}
            max={10}
            step={0.5}
            onChange={(v) => handleInputChange('extracurricular_hours', v)}
          />

          <RangeRow
            label="Sleep Hours / day"
            value={formData.sleep_hours}
            min={0}
            max={12}
            step={0.5}
            onChange={(v) => handleInputChange('sleep_hours', v)}
          />

          <RangeRow
            label="Social Hours / day"
            value={formData.social_hours}
            min={0}
            max={10}
            step={0.5}
            onChange={(v) => handleInputChange('social_hours', v)}
          />

          <RangeRow
            label="Physical Activity / day"
            value={formData.physical_activity_hours}
            min={0}
            max={6}
            step={0.5}
            onChange={(v) => handleInputChange('physical_activity_hours', v)}
          />

          <RangeRow
            label="Stress Level (1-10)"
            value={formData.stress_level}
            min={1}
            max={10}
            step={0.5}
            onChange={(v) => handleInputChange('stress_level', v)}
          />

          <div className="md:col-span-2 flex items-center justify-between gap-4 mt-2">
            <div className="text-sm text-gray-500">Tip: Try increasing study hours and quality sleep for better results.</div>
            <button
              type="submit"
              disabled={loading}
              className="btn btn-1 hover-filled-slide-down overflow-hidden rounded-lg disabled:opacity-60"
            >
              <span className="inline-flex items-center gap-2 px-5 py-2">
                {loading ? 'Predicting...' : 'Predict CGPA'}
              </span>
            </button>
          </div>
        </form>

        {error && (
          <div className="mt-4 p-3 bg-red-50 text-red-700 rounded-lg">{error}</div>
        )}

        {prediction !== null && (
          <div className={`mt-6 transform transition-all duration-500 ${showResult ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            <div className="p-4 rounded-xl bg-gradient-to-r from-indigo-50 to-white dark:from-indigo-900/30 border border-indigo-100 dark:border-indigo-800 shadow-inner">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="flex items-center gap-4">
                  {/* Gauge (semicircle) - use strokeDasharray so rendering is smooth */}
                  {(() => {
                    const minObserved = modelMeta?.prediction_range?.min ?? modelMeta?.min_pred ?? 2.4;
                    const maxObserved = modelMeta?.prediction_range?.max ?? modelMeta?.max_pred ?? 3.88;
                    const span = Math.max(0.0001, maxObserved - minObserved);
                    const pct = Math.max(0, Math.min(1, ((prediction as number) - minObserved) / span));

                    const radius = 36;
                    const cx = 55;
                    const cy = 55;
                    const circumference = 2 * Math.PI * radius;
                    const visible = circumference / 2; // semicircle
                    const dashOffset = Math.round(visible * (1 - pct));

                    return (
                      <svg width="110" height="70" viewBox="0 0 110 70" className="shrink-0">
                        <defs>
                          <linearGradient id="g1" x1="0%" x2="100%">
                            <stop offset="0%" stopColor="#06b6d4" />
                            <stop offset="100%" stopColor="#6366f1" />
                          </linearGradient>
                        </defs>
                        {/* background semicircle */}
                        <circle cx={cx} cy={cy} r={radius} fill="none" stroke="#eef2ff" strokeWidth={10} strokeLinecap="round"
                          strokeDasharray={`${visible} ${circumference}`} transform={`rotate(180 ${cx} ${cy})`} />

                        {/* progress arc */}
                        <circle cx={cx} cy={cy} r={radius} fill="none" stroke="url(#g1)" strokeWidth={10} strokeLinecap="round"
                          strokeDasharray={`${visible} ${circumference}`} strokeDashoffset={dashOffset} transform={`rotate(180 ${cx} ${cy})`} />

                        <text x={cx} y={cy + 8} textAnchor="middle" fontSize={18} fontWeight={700} fill="#4F46E5">{prediction.toFixed(2)}</text>
                      </svg>
                    );
                  })()}

                  <div>
                    <div className="text-sm text-gray-500">Estimated CGPA</div>
                      <div className="text-3xl font-extrabold text-indigo-600 dark:text-indigo-300">{prediction.toFixed(2)} / 4.0</div>
                      <div className="text-xs text-gray-400">Scale</div>
                  </div>
                </div>

                {/* contributions and summary */}
                <div className="flex-1">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <div className="text-sm text-gray-500 mb-2">Feature contributions</div>
                      <div className="space-y-2">
                        {computeContributions().map((b) => (
                          <div key={b.label} className="flex items-center gap-3">
                            <div className="w-28 text-xs text-gray-600 capitalize">{b.label}</div>
                            <div className="flex-1 bg-white/50 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
                              <div
                                className={`h-3 rounded-full ${b.val < 0 ? 'bg-red-400' : 'bg-indigo-500'}`}
                                style={{ width: `${Math.round(b.pct * 100)}%`, transition: 'width 420ms ease' }}
                              />
                            </div>
                            <div className="w-12 text-right text-xs text-gray-600">{(b.val * 100).toFixed(0)}%</div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                        <div className="text-sm text-gray-500 mb-2">Summary</div>
                      <div className="p-3 bg-white rounded-lg dark:bg-gray-800">
                        <div className="text-sm text-gray-700 dark:text-gray-200">
                          {(() => {
                            // Use dynamic thresholds based on observed model range (or defaults)
                            const minObserved = modelMeta?.prediction_range?.min ?? modelMeta?.min_pred ?? 2.4;
                            const maxObserved = modelMeta?.prediction_range?.max ?? modelMeta?.max_pred ?? 3.88;
                            const span = Math.max(0.0001, maxObserved - minObserved);
                            const pct = Math.max(0, Math.min(1, ((prediction as number) - minObserved) / span));

                            if (pct >= 0.85) return 'Great job — your projected CGPA is excellent. Keep up the strong study habits.';
                            if (pct >= 0.65) return 'Good result — you are doing well. Small improvements in sleep or focused study can push you higher.';
                            if (pct >= 0.35) return 'Average projection — consider increasing study time and improving sleep quality.';
                            return 'At risk — we recommend prioritizing study hours and reducing stress. Seek support if needed.';
                          })()}
                        </div>
                        <div className="mt-3 text-xs text-gray-500">Suggestions:</div>
                        <ul className="mt-1 ml-4 list-disc text-xs text-gray-500 space-y-1">
                          <li>Increase focused study hours where possible.</li>
                          <li>Prioritize 7-9 hours of quality sleep.</li>
                          <li>Manage stress with short breaks and exercise.</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default CGPAPredictor;