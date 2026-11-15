import React from "react";

/* =======================
   TYPES STRICTS
======================= */
export type RiskLabel = "LOW RISK" | "HIGH RISK";

export type RiskProbabilities = {
  "LOW RISK": number;
  "HIGH RISK": number;
};

type Props = {
  result: {
    riskLabel: RiskLabel;
    probabilities: RiskProbabilities;
    comparison?: Record<string, string>;
  };
};

/* =======================
   COMPONENT
======================= */
const PredictionResult: React.FC<Props> = ({ result }) => {
  const { riskLabel, probabilities, comparison } = result;
  const prob = probabilities[riskLabel];

  /* ===== Confidence ===== */
  const confidence =
    prob < 0.6 ? "Low confidence" : prob < 0.75 ? "Moderate confidence" : "High confidence";

  /* ===== Personality-style interpretation ===== */
  const interpretation: string[] = [];

  if (comparison?.["Academic Pressure"] === "above average") {
    interpretation.push(
      "You tend to place strong academic demands on yourself, reflecting ambition but also increased mental pressure."
    );
  }

  if (comparison?.["Sleep Duration"] === "below average") {
    interpretation.push(
      "Your sleep duration is shorter than average, which may impact emotional stability, focus, and stress regulation."
    );
  }

  if (comparison?.["Work/Study Hours"] === "above average") {
    interpretation.push(
      "Extended work or study hours suggest high engagement, but may increase fatigue over time."
    );
  }

  if (comparison?.["CGPA"] === "below average") {
    interpretation.push(
      "Your academic performance appears slightly below average, possibly reflecting workload or stress effects."
    );
  }

  interpretation.push(
    riskLabel === "HIGH RISK"
      ? "Overall, this profile aligns with increased psychological vulnerability. Improving balance between rest, workload, and personal support could significantly enhance well-being."
      : "Overall, this profile appears relatively balanced compared to the average student."
  );

  return (
    <div className="mt-8 p-6 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700">
      <h2 className="text-xl font-semibold mb-2">
         Your profile suicidal risk Interpretation
      </h2>

      {/* Badge */}
      <span
        className={`inline-block px-4 py-1 rounded-full text-sm font-semibold ${
          riskLabel === "HIGH RISK"
            ? "bg-red-100 text-red-700"
            : "bg-green-100 text-green-700"
        }`}
      >
        {riskLabel}
      </span>

      {/* Confidence */}
      <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
        Confidence level: <strong>{confidence}</strong>
      </p>

      {/* Probability bar */}
      <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-3 mt-3">
        <div
          className={`h-3 rounded-full ${
            riskLabel === "HIGH RISK" ? "bg-red-500" : "bg-green-500"
          }`}
          style={{ width: `${prob * 100}%` }}
        />
      </div>
      <p className="text-sm mt-1">{(prob * 100).toFixed(1)}%</p>

      {/* Narrative interpretation */}
      <div className="mt-4 space-y-2 text-sm text-slate-700 dark:text-slate-300">
        {interpretation.map((line, i) => (
          <p key={i}>• {line}</p>
        ))}
      </div>

      {/* Disclaimer */}
      <p className="mt-4 text-xs text-slate-500">
        ⚠️ This interpretation does not constitute a medical diagnosis.
      </p>
    </div>
  );
};

export default PredictionResult;
