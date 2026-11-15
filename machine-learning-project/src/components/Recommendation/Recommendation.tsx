"use client";

import React, { useState } from "react";
import { CheckCircle, AlertTriangle, Info } from "lucide-react";

/* ================= TYPES ================= */

type FormState = {
  depression: number | "";
  suicidal_thoughts: number | "";
  sleep_duration: number | "";
  dietary_habits: number | "";
  financial_stress: number;
  academic_pressure: number;
  study_satisfaction: number;
};

type ApiResponse = {
  cluster: number;
  group: string;
  recommendations: string[];
};

/* ================= UI COMPONENTS ================= */

const Section = ({
  title,
  children
}: {
  title: string;
  children: React.ReactNode;
}) => (
  <div>
    <h3 className="text-xl font-bold text-primary mb-6">{title}</h3>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">{children}</div>
  </div>
);

const Select = ({
  label,
  name,
  value,
  onChange,
  options
}: {
  label: string;
  name: string;
  value: number | "";
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  options: { label: string; value: number | "" }[];
}) => (
  <div>
    <label className="block mb-2 font-semibold text-gray-700">{label}</label>
    <select
      name={name}
      value={value}
      onChange={onChange}
      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary"
      required
    >
      {options.map((o, i) => (
        <option key={i} value={o.value}>
          {o.label}
        </option>
      ))}
    </select>
  </div>
);

const RangeSlider = ({
  label,
  name,
  value,
  min = 1,
  max = 5,
  onChange
}: {
  label: string;
  name: string;
  value: number;
  min?: number;
  max?: number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) => {
  const percentage = ((value - min) / (max - min)) * 100;

  return (
    <div className="bg-white rounded-2xl p-6 shadow border border-gray-100">
      <div className="flex justify-between mb-3">
        <span className="font-semibold">{label}</span>
        <span className="px-3 py-1 text-sm rounded-full bg-indigo-600 text-white">
          {value}
        </span>
      </div>

      <div className="relative">
        <div className="h-2 bg-gray-200 rounded-full" />
        <div
          className="absolute top-0 left-0 h-2 bg-indigo-500 rounded-full"
          style={{ width: `${percentage}%` }}
        />
        <input
          type="range"
          min={min}
          max={max}
          step={1}
          name={name}
          value={value}
          onChange={onChange}
          className="absolute top-[-6px] w-full appearance-none bg-transparent cursor-pointer"
        />
      </div>
    </div>
  );
};

/* ================= MAIN COMPONENT ================= */

const Recommendation: React.FC = () => {
  const [form, setForm] = useState<FormState>({
    depression: "",
    suicidal_thoughts: "",
    sleep_duration: "",
    dietary_habits: "",
    financial_stress: 3,
    academic_pressure: 3,
    study_satisfaction: 3
  });

  const [result, setResult] = useState<ApiResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value === "" ? "" : Number(value) });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setResult(null);

    if (
      form.depression === "" ||
      form.suicidal_thoughts === "" ||
      form.sleep_duration === "" ||
      form.dietary_habits === ""
    ) {
      setError("Please complete all required fields.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("http://127.0.0.1:8000/recommend", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });

      if (!res.ok) throw new Error();
      setResult(await res.json());
    } catch {
      setError("Unable to get recommendations.");
    } finally {
      setLoading(false);
    }
  };

  const isHigh = result?.group === "High well-being";

  return (
    <section className="min-h-screen bg-gradient-to-br from-blue-50 to-white py-20">
      <div className="max-w-6xl mx-auto px-4">

        {/* HEADER */}
        <div className="text-center mb-14 mt-20">
          <h1 className="text-4xl font-extrabold text-primary mb-4">
            Student Well-Being Assessment
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Answer a few questions to receive personalized insights.
          </p>
        </div>

        {/* FORM */}
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-3xl shadow-xl p-10 space-y-10"
        >
          <Section title="Mental Health">
            <Select
              label="Are you depressed?"
              name="depression"
              value={form.depression}
              onChange={handleChange}
              options={[
                { label: "Select", value: "" },
                { label: "No", value: 0 },
                { label: "Yes", value: 1 }
              ]}
            />

            <Select
              label="Have you ever had suicidal thoughts?"
              name="suicidal_thoughts"
              value={form.suicidal_thoughts}
              onChange={handleChange}
              options={[
                { label: "Select", value: "" },
                { label: "No", value: 0 },
                { label: "Yes", value: 1 }
              ]}
            />
          </Section>

          <Section title="Lifestyle">
            <Select
              label="Sleep Duration"
              name="sleep_duration"
              value={form.sleep_duration}
              onChange={handleChange}
              options={[
                { label: "Select", value: "" },
                { label: "Less than 5 hours", value: 1 },
                { label: "5–6 hours", value: 2 },
                { label: "7–8 hours", value: 3 },
                { label: "More than 8 hours", value: 4 }
              ]}
            />

            <Select
              label="Dietary Habits"
              name="dietary_habits"
              value={form.dietary_habits}
              onChange={handleChange}
              options={[
                { label: "Select", value: "" },
                { label: "Unhealthy", value: 1 },
                { label: "Moderate", value: 2 },
                { label: "Healthy", value: 3 }
              ]}
            />
          </Section>

          <Section title="Academic Experience">
            <RangeSlider label="Financial Stress" name="financial_stress" value={form.financial_stress} onChange={handleChange} />
            <RangeSlider label="Academic Pressure" name="academic_pressure" value={form.academic_pressure} onChange={handleChange} />
            <RangeSlider label="Study Satisfaction" name="study_satisfaction" value={form.study_satisfaction} onChange={handleChange} />
          </Section>

          {error && <p className="text-red-600 text-center font-semibold">{error}</p>}

          <button className="w-full py-4 bg-primary text-white rounded-xl text-lg font-bold">
            {loading ? "Analyzing..." : "Get My Recommendation"}
          </button>
        </form>

        {/* RESULT */}
        {result && (
          <div className="mt-20 space-y-10">
            <div className={`rounded-3xl p-8 shadow-xl ${isHigh ? "bg-emerald-50 border-emerald-200" : "bg-rose-50 border-rose-200"} border`}>
              <div className="flex gap-6 items-center">
                {isHigh ? (
                  <CheckCircle className="w-14 h-14 text-emerald-600" />
                ) : (
                  <AlertTriangle className="w-14 h-14 text-rose-600" />
                )}
                <div>
                  <h2 className="text-3xl font-extrabold">{result.group}</h2>
                  <p className="text-gray-700 mt-2 max-w-2xl">
                    Generated using clustering on mental health, academic pressure,
                    lifestyle, and satisfaction indicators.
                  </p>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-2xl font-bold mb-6">Recommended Actions</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {result.recommendations.map((rec, i) => (
                  <div key={i} className="bg-white rounded-2xl p-6 shadow border">
                    <div className="flex gap-4">
                      <div className="w-9 h-9 flex items-center justify-center rounded-full bg-primary text-white font-bold">
                        {i + 1}
                      </div>
                      <p className="text-gray-700">{rec}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-center text-sm text-gray-500 italic">
              <Info className="w-4 h-4 mt-1 mr-2" />
              This assessment is informational and does not replace professional advice.
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default Recommendation;