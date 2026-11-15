"use client";

import { useEffect, useState } from "react";
import HeroSub from "@/components/SharedComponent/HeroSub";

import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
} from "chart.js";
import { Doughnut, Bar } from "react-chartjs-2";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title
);

// Couleurs
const COLORS = {
  happyBg: "rgba(56, 189, 248, 0.7)", // bleu clair
  happyBorder: "rgba(56, 189, 248, 1)",
  depressedBg: "rgba(248, 113, 113, 0.7)", // rouge clair
  depressedBorder: "rgba(248, 113, 113, 1)",
};

// Palette pour les graphes “Students vs …”
const PALETTE_BG = [
  "#60a5fa", // blue
  "#f97316", // orange
  "#22c55e", // green
  "#e11d48", // red
  "#a855f7", // purple
  "#14b8a6", // teal
  "#facc15", // yellow
];
const PALETTE_BORDER = PALETTE_BG.map((c) => c);

// ──────────────────────────────────────────────────────────
// Types
// ──────────────────────────────────────────────────────────

type StudentRow = {
  depression: number;
  suicidalThoughts: string;
  sleepDuration: string;
  dietaryHabits: string;
  financialStress: string;
  familyHistory: string;
  academicPressure: string;
};

type CountMap = Record<string, number>;

interface DashboardStats {
  total: number;
  happyCount: number;
  depressedCount: number;

  suicidalHappy: CountMap;
  suicidalDepressed: CountMap;
  suicidalOverall: CountMap;

  sleepHappy: CountMap;
  sleepDepressed: CountMap;
  sleepOverall: CountMap;

  dietaryHappy: CountMap;
  dietaryDepressed: CountMap;
  dietaryOverall: CountMap;

  academicHappy: CountMap;
  academicDepressed: CountMap;

  financialHappy: CountMap;
  financialDepressed: CountMap;
  financialOverall: CountMap;

  familyHistory: CountMap;
  depressionOverall: CountMap;
}

// ──────────────────────────────────────────────────────────
// Helpers
// ──────────────────────────────────────────────────────────

const cleanCategory = (value: string): string =>
  value.replace(/^"|"$/g, "").replace(/'/g, "").trim();

const parseCsv = (csv: string): StudentRow[] => {
  const lines = csv.trim().split(/\r?\n/);
  const header = lines[0].split(",");

  const idx = {
    depression: header.indexOf("Depression"),
    suicidalThoughts: header.indexOf("Have you ever had suicidal thoughts ?"),
    sleepDuration: header.indexOf("Sleep Duration"),
    dietaryHabits: header.indexOf("Dietary Habits"),
    financialStress: header.indexOf("Financial Stress"),
    familyHistory: header.indexOf("Family History of Mental Illness"),
    academicPressure: header.indexOf("Academic Pressure"),
  };

  const rows: StudentRow[] = [];

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;
    const cols = line.split(",");

    const depression = Number(cols[idx.depression]);

    rows.push({
      depression: isNaN(depression) ? 0 : depression,
      suicidalThoughts: cleanCategory(cols[idx.suicidalThoughts] ?? ""),
      sleepDuration: cleanCategory(cols[idx.sleepDuration] ?? ""),
      dietaryHabits: cleanCategory(cols[idx.dietaryHabits] ?? ""),
      financialStress: cleanCategory(cols[idx.financialStress] ?? ""),
      familyHistory: cleanCategory(cols[idx.familyHistory] ?? ""),
      academicPressure: cleanCategory(cols[idx.academicPressure] ?? ""),
    });
  }

  return rows;
};

const countBy = (rows: StudentRow[], picker: (r: StudentRow) => string): CountMap => {
  const map: CountMap = {};
  rows.forEach((row) => {
    const key = picker(row) || "Unknown";
    map[key] = (map[key] || 0) + 1;
  });
  return map;
};

const normalizeSleepOrder = (map: CountMap): CountMap => {
  const order = ["7-8 hours", "Less than 5 hours", "5-6 hours", "More than 8 hours", "Others"];
  const res: CountMap = {};
  order.forEach((label) => (res[label] = map[label] || 0));
  return res;
};

const normalizeDietOrder = (map: CountMap): CountMap => {
  const order = ["Unhealthy", "Moderate", "Healthy", "Others"];
  const res: CountMap = {};
  order.forEach((label) => (res[label] = map[label] || 0));
  return res;
};

const normalizeFinancialOrder = (map: CountMap): CountMap => {
  const order = ["1.0", "2.0", "3.0", "4.0", "5.0", "?"];
  const res: CountMap = {};
  order.forEach((label) => (res[label] = map[label] || 0));
  return res;
};

const normalizeAcademicOrder = (map: CountMap): CountMap => {
  const order = ["0.0", "1.0", "2.0", "3.0", "4.0", "5.0"];
  const res: CountMap = {};
  order.forEach((label) => (res[label] = map[label] || 0));
  return res;
};

const buildStats = (rows: StudentRow[]): DashboardStats => {
  const total = rows.length;
  const depressed = rows.filter((r) => r.depression === 1);
  const happy = rows.filter((r) => r.depression === 0);

  const happyCount = happy.length;
  const depressedCount = depressed.length;

  const suicidalHappy = countBy(happy, (r) => r.suicidalThoughts);
  const suicidalDepressed = countBy(depressed, (r) => r.suicidalThoughts);
  const suicidalOverall = countBy(rows, (r) => r.suicidalThoughts);

  const sleepHappy = normalizeSleepOrder(countBy(happy, (r) => r.sleepDuration));
  const sleepDepressed = normalizeSleepOrder(countBy(depressed, (r) => r.sleepDuration));
  const sleepOverall = normalizeSleepOrder(countBy(rows, (r) => r.sleepDuration));

  const dietaryHappy = normalizeDietOrder(countBy(happy, (r) => r.dietaryHabits));
  const dietaryDepressed = normalizeDietOrder(countBy(depressed, (r) => r.dietaryHabits));
  const dietaryOverall = normalizeDietOrder(countBy(rows, (r) => r.dietaryHabits));

  const academicHappy = normalizeAcademicOrder(countBy(happy, (r) => r.academicPressure));
  const academicDepressed = normalizeAcademicOrder(countBy(depressed, (r) => r.academicPressure));

  const financialHappy = normalizeFinancialOrder(countBy(happy, (r) => r.financialStress));
  const financialDepressed = normalizeFinancialOrder(countBy(depressed, (r) => r.financialStress));
  const financialOverall = normalizeFinancialOrder(countBy(rows, (r) => r.financialStress));

  const familyHistory = countBy(rows, (r) => r.familyHistory);

  const depressionOverall: CountMap = {
    "No (0)": happyCount,
    "Yes (1)": depressedCount,
  };

  return {
    total,
    happyCount,
    depressedCount,
    suicidalHappy,
    suicidalDepressed,
    suicidalOverall,
    sleepHappy,
    sleepDepressed,
    sleepOverall,
    dietaryHappy,
    dietaryDepressed,
    dietaryOverall,
    academicHappy,
    academicDepressed,
    financialHappy,
    financialDepressed,
    financialOverall,
    familyHistory,
    depressionOverall,
  };
};

// ──────────────────────────────────────────────────────────
// Card component
// ──────────────────────────────────────────────────────────

const Card = ({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) => (
  <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-900">
    <h3 className="mb-1 text-lg font-semibold text-secondary dark:text-white">{title}</h3>
    {subtitle && <p className="mb-3 text-sm text-slate-500 dark:text-slate-400">{subtitle}</p>}
    <div className="h-[320px]">{children}</div>
  </div>
);

// ──────────────────────────────────────────────────────────
// Main client component
// ──────────────────────────────────────────────────────────

const DashboardClient = () => {
  const breadcrumbLinks = [
    { href: "/", text: "Home" },
    { href: "/dashboard", text: "Dashboard" },
  ];

  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch("/data/student_priority_10k.csv");
        if (!res.ok) throw new Error("Impossible de charger le dataset");
        const text = await res.text();
        const rows = parseCsv(text);
        const s = buildStats(rows);
        setStats(s);
      } catch (err: any) {
        setError(err.message ?? "Erreur inconnue");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  if (loading) {
    return (
      <>
        <HeroSub
          title="Dashboard"
          description="Visualisation des facteurs liés à la dépression chez les étudiants."
          breadcrumbLinks={breadcrumbLinks}
        />
        <section className="pb-20 pt-10 dark:bg-darkmode">
          <div className="container">
            <p className="text-center text-slate-500 dark:text-slate-300">
              Chargement des graphiques...
            </p>
          </div>
        </section>
      </>
    );
  }

  if (error || !stats) {
    return (
      <>
        <HeroSub
          title="Dashboard"
          description="Visualisation des facteurs liés à la dépression chez les étudiants."
          breadcrumbLinks={breadcrumbLinks}
        />
        <section className="pb-20 pt-10 dark:bg-darkmode">
          <div className="container">
            <p className="text-center text-red-500">
              Erreur : {error ?? "les statistiques n'ont pas pu être calculées."}
            </p>
          </div>
        </section>
      </>
    );
  }

  // ────────────────────────────────────────────────────
  // Préparation des données pour les graphiques
  // ────────────────────────────────────────────────────

  const depressionDoughnutData = {
    labels: ["Happy students", "Depressed students"],
    datasets: [
      {
        data: [stats.happyCount, stats.depressedCount],
        backgroundColor: [COLORS.happyBg, COLORS.depressedBg],
        borderColor: [COLORS.happyBorder, COLORS.depressedBorder],
        borderWidth: 1,
      },
    ],
  };

  const suicidalLabels = ["No", "Yes"];

  const suicidalOptions = {
    responsive: true,
    plugins: {
      legend: { position: "bottom" as const },
    },
  };

  const makeGroupedBarData = (labels: string[], happyMap: CountMap, depMap: CountMap) => ({
    labels,
    datasets: [
      {
        label: "Happy students",
        data: labels.map((l) => happyMap[l] || 0),
        backgroundColor: COLORS.happyBg,
        borderColor: COLORS.happyBorder,
        borderWidth: 1,
      },
      {
        label: "Depressed students",
        data: labels.map((l) => depMap[l] || 0),
        backgroundColor: COLORS.depressedBg,
        borderColor: COLORS.depressedBorder,
        borderWidth: 1,
      },
    ],
  });

  const sleepLabels = ["7-8 hours", "Less than 5 hours", "5-6 hours", "More than 8 hours", "Others"];
  const dietLabels = ["Moderate", "Healthy", "Unhealthy", "Others"];
  const academicLabels = ["0.0", "1.0", "2.0", "3.0", "4.0", "5.0"];
  const financialLabels = ["1.0", "2.0", "3.0", "4.0", "5.0"];

  const sleepGroupedData = makeGroupedBarData(
    sleepLabels,
    stats.sleepHappy,
    stats.sleepDepressed
  );

  const dietGroupedData = makeGroupedBarData(
    dietLabels,
    stats.dietaryHappy,
    stats.dietaryDepressed
  );

  const academicGroupedData = makeGroupedBarData(
    academicLabels,
    stats.academicHappy,
    stats.academicDepressed
  );

  const financialGroupedData = makeGroupedBarData(
    financialLabels,
    stats.financialHappy,
    stats.financialDepressed
  );

  // palette par barre pour les graphes "Students vs ..."
  const makeSingleBarData = (labels: string[], map: CountMap) => ({
    labels,
    datasets: [
      {
        label: "Students",
        data: labels.map((l) => map[l] || 0),
        backgroundColor: labels.map(
          (_, i) => PALETTE_BG[i % PALETTE_BG.length]
        ),
        borderColor: labels.map(
          (_, i) => PALETTE_BORDER[i % PALETTE_BORDER.length]
        ),
        borderWidth: 1,
      },
    ],
  });

  const sleepOverallData = makeSingleBarData(sleepLabels, stats.sleepOverall);
  const dietOverallData = makeSingleBarData(
    ["Unhealthy", "Moderate", "Healthy", "Others"],
    stats.dietaryOverall
  );
  const financialOverallData = makeSingleBarData(financialLabels, stats.financialOverall);
  const familyHistLabels = ["Yes", "No"];
  const familyHistData = makeSingleBarData(familyHistLabels, stats.familyHistory);
  const depressionOverallLabels = Object.keys(stats.depressionOverall);
  const depressionOverallData = makeSingleBarData(
    depressionOverallLabels,
    stats.depressionOverall
  );

  return (
    <>
      <HeroSub
        title="Students Mental Health Dashboard"
        description="Visual analysis of 10,000 students"
        breadcrumbLinks={breadcrumbLinks}
      />

      <section className="pb-20 pt-10 dark:bg-darkmode">
        <div className="container space-y-10">
          {/* Première ligne : donut + global suicidal */}
          <div className="grid gap-8 lg:grid-cols-2">
            <Card
              title="Why more than 58% of students feel depressed"
              subtitle={`Total: ${stats.total}`}
            >
              <Doughnut
                data={depressionDoughnutData}
                options={{
                  plugins: {
                    legend: { position: "bottom" as const },
                  },
                  cutout: "65%",
                  maintainAspectRatio: false,
                }}
              />
            </Card>

            <Card title="Students vs suicidal thoughts">
              <Bar
                data={makeSingleBarData(
                  suicidalLabels,
                  stats.suicidalOverall
                )}
                options={suicidalOptions}
              />
            </Card>
          </div>

          {/* Deuxième ligne : suicidal by group, diet by group */}
          <div className="grid gap-8 lg:grid-cols-2">
            <Card title="Have you ever had suicidal thoughts ?">
              <Bar
                data={{
                  labels: suicidalLabels,
                  datasets: [
                    {
                      label: "Happy students",
                      data: suicidalLabels.map((l) => stats.suicidalHappy[l] || 0),
                      backgroundColor: COLORS.happyBg,
                      borderColor: COLORS.happyBorder,
                      borderWidth: 1,
                    },
                    {
                      label: "Depressed students",
                      data: suicidalLabels.map((l) => stats.suicidalDepressed[l] || 0),
                      backgroundColor: COLORS.depressedBg,
                      borderColor: COLORS.depressedBorder,
                      borderWidth: 1,
                    },
                  ],
                }}
                options={suicidalOptions}
              />
            </Card>

            <Card title="Dietary habits (happy vs depressed)">
              <Bar
                data={dietGroupedData}
                options={{
                  responsive: true,
                  plugins: {
                    legend: { position: "bottom" as const },
                  },
                }}
              />
            </Card>
          </div>

          {/* Troisième ligne : sleep group + overall */}
          <div className="grid gap-8 lg:grid-cols-2">
            <Card title="Sleep duration (happy vs depressed)">
              <Bar
                data={sleepGroupedData}
                options={{
                  responsive: true,
                  plugins: {
                    legend: { position: "bottom" as const },
                  },
                }}
              />
            </Card>

            <Card title="Students vs sleep duration">
              <Bar
                data={sleepOverallData}
                options={{
                  responsive: true,
                  plugins: {
                    legend: { display: false },
                  },
                }}
              />
            </Card>
          </div>

          {/* Quatrième ligne : academic & financial stress by group */}
          <div className="grid gap-8 lg:grid-cols-2">
            <Card title="Academic pressure (happy vs depressed)">
              <Bar
                data={academicGroupedData}
                options={{
                  responsive: true,
                  plugins: {
                    legend: { position: "bottom" as const },
                  },
                }}
              />
            </Card>

            <Card title="Financial stress (happy vs depressed)">
              <Bar
                data={financialGroupedData}
                options={{
                  responsive: true,
                  plugins: {
                    legend: { position: "bottom" as const },
                  },
                }}
              />
            </Card>
          </div>

          {/* Cinquième ligne : financial overall + family history */}
          <div className="grid gap-8 lg:grid-cols-2">
            <Card title="Students vs financial stress">
              <Bar
                data={financialOverallData}
                options={{
                  responsive: true,
                  plugins: {
                    legend: { display: false },
                  },
                }}
              />
            </Card>

            <Card title="Students vs family history of mental illness">
              <Bar
                data={familyHistData}
                options={{
                  responsive: true,
                  plugins: {
                    legend: { display: false },
                  },
                }}
              />
            </Card>
          </div>

          {/* Sixième ligne : global depression */}
          <div className="grid gap-8 lg:grid-cols-2">
            <Card title="Students vs depression (0 = No, 1 = Yes)">
              <Bar
                data={depressionOverallData}
                options={{
                  responsive: true,
                  plugins: {
                    legend: { display: false },
                  },
                }}
              />
            </Card>
          </div>
        </div>
      </section>
    </>
  );
};

export default DashboardClient;
