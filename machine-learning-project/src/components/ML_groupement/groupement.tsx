"use client";

import React, { useState } from "react";
import toast from "react-hot-toast";
import PredictionResult from "./PredictionResult";

interface FormData {
  gender: string;
  age: string;
  city: string;
  academicPressure: string;
  cgpa: string;
  studySatisfaction: string;
  sleepDuration: string;
  dietaryHabits: string;
  degree: string;
  suicidalThoughts: string;
  workStudyHours: string;
  financialStress: string;
  familyHistoryMentalIllness: string;
}

const validateForm = (data: FormData): string | null => {
  const age = Number(data.age);
  if (!Number.isInteger(age) || age <= 0 || age > 60) {
    return "Age must be a positive integer between 1 and 60.";
  }

  const cgpa = Number(data.cgpa);
  if (isNaN(cgpa) || cgpa < 0 || cgpa > 10) {
    return "CGPA must be between 0 and 10.";
  }

  const academicPressure = Number(data.academicPressure);
  if (isNaN(academicPressure) || academicPressure < 0 || academicPressure > 5) {
    return "Academic pressure must be between 0 and 5.";
  }

  const studySatisfaction = Number(data.studySatisfaction);
  if (isNaN(studySatisfaction) || studySatisfaction < 0 || studySatisfaction > 5) {
    return "Study satisfaction must be between 0 and 5.";
  }

  const workStudyHours = Number(data.workStudyHours);
  if (isNaN(workStudyHours) || workStudyHours < 0 || workStudyHours > 24) {
    return "Work / Study hours must be between 0 and 24.";
  }

  const financialStress = Number(data.financialStress);
  if (isNaN(financialStress) || financialStress < 0 || financialStress > 5) {
    return "Financial stress must be between 0 and 5.";
  }

  return null;
};

const ClusteringForm = () => {
  const [formData, setFormData] = useState<FormData>({
    gender: "",
    age: "",
    city: "",
    academicPressure: "",
    cgpa: "",
    studySatisfaction: "",
    sleepDuration: "",
    dietaryHabits: "",
    degree: "",
    suicidalThoughts: "",
    workStudyHours: "",
    financialStress: "",
    familyHistoryMentalIllness: "",
  });

  const [loading, setLoading] = useState(false);
  const [riskLabel, setRiskLabel] = useState<string | null>(null);
  const [probabilities, setProbabilities] = useState<Record<string, number> | null>(null);
  const [comparison, setComparison] = useState<Record<string, string> | null>(null);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const requiredFields = [
      "gender",
      "age",
      "city",
      "academicPressure",
      "cgpa",
      "studySatisfaction",
      "sleepDuration",
      "dietaryHabits",
      "degree",
      "suicidalThoughts",
      "workStudyHours",
      "financialStress",
      "familyHistoryMentalIllness",
    ];

    const missingFields = requiredFields.filter(
      (field) => !formData[field as keyof FormData]
    );

    if (missingFields.length > 0) {
      toast.error("Please fill in all required fields.");
      return;
    }

    const validationError = validateForm(formData);
    if (validationError) {
      toast.error(validationError);
      return;
    }

    try {
      setLoading(true);
      setRiskLabel(null);
      setProbabilities(null);

      const res = await fetch("http://localhost:5000/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok || data.error) {
        console.error(data);
        toast.error("Error while computing risk profile.");
        return;
      }

      setRiskLabel(data.riskLabel);
      setProbabilities(data.probabilities || null);
    setComparison(data.comparison || null);
      toast.success("Risk profile computed!");
    } catch (err) {
      console.error(err);
      toast.error("Cannot contact risk profiling API.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="dark:bg-darkmode lg:pb-24 pb-16 pt-0">
      <div className="container mx-auto lg:max-w-screen-xl md:max-w-screen-md">
        <div className="max-w-4xl mx-auto bg-slate-50 dark:bg-slate-800 rounded-2xl shadow-md border border-slate-200 dark:border-slate-700 px-6 py-6 md:px-10 md:py-8">
          <form
            onSubmit={handleSubmit}
            className="flex flex-wrap w-full m-auto justify-between"
          >
            {/* Personal Information Section */}
            <div className="sm:flex gap-3 w-full">
              <div className="mx-0 my-2.5 flex-1">
                <label
                  htmlFor="gender"
                  className="pb-3 inline-block text-base text-SlateBlueText dark:text-white"
                >
                  Gender{" "}
                  <span className="text-red-500">*</span>
                </label>
                <select
                  id="gender"
                  name="gender"
                  value={formData.gender}
                  onChange={handleInputChange}
                  className="w-full text-base px-4 py-2.5 text-SlateBlueText rounded-lg border-border dark:text-white border-solid dark:bg-darkmode border transition-all duration-500 focus:border-primary dark:focus:border-primary dark:border-dark_border focus:border-solid focus:outline-0"
                  required
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
              </div>
              <div className="mx-0 my-2.5 flex-1">
                <label
                  htmlFor="age"
                  className="pb-3 inline-block text-base text-SlateBlueText dark:text-white"
                >
                  Age{" "}
                  <span className="text-red-500">*</span>
                </label>
                <input
                  id="age"
                  name="age"
                  type="number"
                  min="1"
                  max="120"
                  value={formData.age}
                  onChange={handleInputChange}
                  className="w-full text-base px-4 rounded-lg py-2.5 border-border dark:border-dark_border border-solid dark:text-white dark:bg-darkmode border transition-all duration-500 focus:border-primary dark:focus:border-primary focus:border-solid focus:outline-0"
                  placeholder="Enter your age"
                  required
                />
              </div>
            </div>

            <div className="sm:flex gap-3 w-full">
              <div className="mx-0 my-2.5 flex-1">
                <label
                  htmlFor="city"
                  className="pb-3 inline-block text-base text-SlateBlueText dark:text-white"
                >
                  City{" "}
                  <span className="text-red-500">*</span>
                </label>
                <input
                  id="city"
                  name="city"
                  type="text"
                  value={formData.city}
                  onChange={handleInputChange}
                  className="w-full text-base px-4 rounded-lg py-2.5 border-border dark:border-dark_border border-solid dark:text-white dark:bg-darkmode border transition-all duration-500 focus:border-primary dark:focus:border-primary focus:border-solid focus:outline-0"
                  placeholder="Enter your city"
                  required
                />
              </div>
              <div className="mx-0 my-2.5 flex-1">
                <label
                  htmlFor="degree"
                  className="pb-3 inline-block text-base text-SlateBlueText dark:text-white"
                >
                  Degree{" "}
                  <span className="text-red-500">*</span>
                </label>
                <select
                  id="degree"
                  name="degree"
                  value={formData.degree}
                  onChange={handleInputChange}
                  className="w-full text-base px-4 py-2.5 text-SlateBlueText rounded-lg border-border dark:text-white border-solid dark:bg-darkmode border transition-all duration-500 focus:border-primary dark:focus:border-primary dark:border-dark_border focus:border-solid focus:outline-0"
                  required
                >
                  <option value="">Select Degree</option>
                  <option value="Class 12">Class 12 (High School)</option>
                  <option value="B.Ed">B.Ed — Bachelor of Education</option>
                  <option value="B.Com">B.Com — Bachelor of Commerce</option>
                  <option value="B.Arch">B.Arch — Bachelor of Architecture</option>
                  <option value="BCA">BCA — Bachelor of Computer Applications</option>
                  <option value="MSc">MSc — Master of Science</option>
                  <option value="B.Tech">B.Tech — Bachelor of Technology</option>
                  <option value="MCA">MCA — Master of Computer Applications</option>
                  <option value="M.Tech">M.Tech — Master of Technology</option>
                  <option value="BHM">BHM — Bachelor of Hotel Management</option>
                  <option value="BSc">BSc — Bachelor of Science</option>
                  <option value="B.Pharm">B.Pharm — Bachelor of Pharmacy</option>
                  <option value="M.Ed">M.Ed — Master of Education</option>
                  <option value="BBA">BBA — Bachelor of Business Administration</option>
                  <option value="MBBS">MBBS — Bachelor of Medicine & Surgery</option>
                  <option value="LLB">LLB — Bachelor of Laws</option>
                  <option value="M.Com">M.Com — Master of Commerce</option>
                  <option value="BA">BA — Bachelor of Arts</option>
                  <option value="M.Pharm">M.Pharm — Master of Pharmacy</option>
                  <option value="BE">BE — Bachelor of Engineering</option>
                  <option value="MD">MD — Doctor of Medicine</option>
                  <option value="MA">MA — Master of Arts</option>
                  <option value="MBA">MBA — Master of Business Administration</option>
                  <option value="LLM">LLM — Master of Laws</option>
                  <option value="PhD">PhD — Doctor of Philosophy</option>
                  <option value="MHM">MHM — Master of Hotel Management</option>
                  <option value="ME">ME — Master of Engineering</option>
                  <option value="Others">Others</option>
                </select>
              </div>
            </div>

            {/* Academic Information */}
            <div className="sm:flex gap-3 w-full">
              <div className="mx-0 my-2.5 flex-1">
                <label
                  htmlFor="cgpa"
                  className="pb-3 inline-block text-base text-SlateBlueText dark:text-white"
                >
                  CGPA{" "}
                  <span className="text-red-500">*</span>
                </label>
                <input
                  id="cgpa"
                  name="cgpa"
                  type="number"
                  min="0"
                  max="10"
                  step="0.01"
                  value={formData.cgpa}
                  onChange={handleInputChange}
                  className="w-full text-base px-4 rounded-lg py-2.5 border-border dark:border-dark_border border-solid dark:text-white dark:bg-darkmode border transition-all duration-500 focus:border-primary dark:focus:border-primary focus:border-solid focus:outline-0"
                  placeholder="Enter your CGPA (0-10)"
                  required
                />
              </div>
              <div className="mx-0 my-2.5 flex-1">
                <label
                  htmlFor="academicPressure"
                  className="pb-3 inline-block text-base text-SlateBlueText dark:text-white"
                >
                  Academic Pressure (0–5){" "}
                  <span className="text-red-500">*</span>
                </label>
                <input
                  id="academicPressure"
                  name="academicPressure"
                  type="number"
                  min="0"
                  max="5"
                  step="0.1"
                  value={formData.academicPressure}
                  onChange={handleInputChange}
                  className="w-full text-base px-4 rounded-lg py-2.5 border-border dark:border-dark_border border-solid dark:text-white dark:bg-darkmode border transition-all duration-500 focus:border-primary dark:focus:border-primary focus:border-solid focus:outline-0"
                  placeholder="Rate from 0 (low) to 5 (high)"
                  required
                />
              </div>
            </div>

            <div className="sm:flex gap-3 w-full">
              <div className="mx-0 my-2.5 flex-1">
                <label
                  htmlFor="studySatisfaction"
                  className="pb-3 inline-block text-base text-SlateBlueText dark:text-white"
                >
                  Study Satisfaction (0–5){" "}
                  <span className="text-red-500">*</span>
                </label>
                <input
                  id="studySatisfaction"
                  name="studySatisfaction"
                  type="number"
                  min="0"
                  max="5"
                  step="0.1"
                  value={formData.studySatisfaction}
                  onChange={handleInputChange}
                  className="w-full text-base px-4 rounded-lg py-2.5 border-border dark:border-dark_border border-solid dark:text-white dark:bg-darkmode border transition-all duration-500 focus:border-primary dark:focus:border-primary focus:border-solid focus:outline-0"
                  placeholder="Rate from 0 (low) to 5 (high)"
                  required
                />
              </div>
              <div className="mx-0 my-2.5 flex-1">
                <label
                  htmlFor="workStudyHours"
                  className="pb-3 inline-block text-base text-SlateBlueText dark:text-white"
                >
                  Work/Study Hours (per day){" "}
                  <span className="text-red-500">*</span>
                </label>
                <input
                  id="workStudyHours"
                  name="workStudyHours"
                  type="number"
                  min="0"
                  max="24"
                  step="0.5"
                  value={formData.workStudyHours}
                  onChange={handleInputChange}
                  className="w-full text-base px-4 rounded-lg py-2.5 border-border dark:border-dark_border border-solid dark:text-white dark:bg-darkmode border transition-all duration-500 focus:border-primary dark:focus:border-primary focus:border-solid focus:outline-0"
                  placeholder="Enter average hours per day"
                  required
                />
              </div>
            </div>

            {/* Lifestyle */}
            <div className="sm:flex gap-3 w-full">
              <div className="mx-0 my-2.5 flex-1">
                <label
                  htmlFor="sleepDuration"
                  className="pb-3 inline-block text-base text-SlateBlueText dark:text-white"
                >
                  Sleep Duration{" "}
                  <span className="text-red-500">*</span>
                </label>
                <select
                  id="sleepDuration"
                  name="sleepDuration"
                  value={formData.sleepDuration}
                  onChange={handleInputChange}
                  className="w-full text-base px-4 py-2.5 text-SlateBlueText rounded-lg border-border dark:text-white border-solid dark:bg-darkmode border transition-all duration-500 focus:border-primary dark:focus:border-primary dark:border-dark_border focus:border-solid focus:outline-0"
                  required
                >
                  <option value="">Select sleep duration</option>
                  <option value="7.5">7–8 hours</option>
                  <option value="4.5">Less than 5 hours</option>
                  <option value="5.5">5–6 hours</option>
                  <option value="9.0">More than 8 hours</option>
                </select>
              </div>
              <div className="mx-0 my-2.5 flex-1">
                <label
                  htmlFor="dietaryHabits"
                  className="pb-3 inline-block text-base text-SlateBlueText dark:text-white"
                >
                  Dietary Habits{" "}
                  <span className="text-red-500">*</span>
                </label>
                <select
                  id="dietaryHabits"
                  name="dietaryHabits"
                  value={formData.dietaryHabits}
                  onChange={handleInputChange}
                  className="w-full text-base px-4 py-2.5 text-SlateBlueText rounded-lg border-border dark:text-white border-solid dark:bg-darkmode border transition-all duration-500 focus:border-primary dark:focus:border-primary dark:border-dark_border focus:border-solid focus:outline-0"
                  required
                >
                  <option value="">Select Dietary Habits</option>
                  <option value="Healthy">Healthy</option>
                  <option value="Moderate">Moderate</option>
                  <option value="Unhealthy">Unhealthy</option>
                </select>
              </div>
            </div>

            {/* Mental Health Section */}
            <div className="sm:flex gap-3 w-full">
              <div className="mx-0 my-2.5 flex-1">
                <label
                  htmlFor="financialStress"
                  className="pb-3 inline-block text-base text-SlateBlueText dark:text-white"
                >
                  Financial Stress (0–5){" "}
                  <span className="text-red-500">*</span>
                </label>
                <input
                  id="financialStress"
                  name="financialStress"
                  type="number"
                  min="0"
                  max="5"
                  step="0.1"
                  value={formData.financialStress}
                  onChange={handleInputChange}
                  className="w-full text-base px-4 rounded-lg py-2.5 border-border dark:border-dark_border border-solid dark:text-white dark:bg-darkmode border transition-all duration-500 focus:border-primary dark:focus:border-primary focus:border-solid focus:outline-0"
                  placeholder="Rate from 0 (low) to 5 (high)"
                  required
                />
              </div>
              <div className="mx-0 my-2.5 flex-1">
                <label
                  htmlFor="familyHistoryMentalIllness"
                  className="pb-3 inline-block text-base text-SlateBlueText dark:text-white"
                >
                  Family History of Mental Illness{" "}
                  <span className="text-red-500">*</span>
                </label>
                <select
                  id="familyHistoryMentalIllness"
                  name="familyHistoryMentalIllness"
                  value={formData.familyHistoryMentalIllness}
                  onChange={handleInputChange}
                  className="w-full text-base px-4 py-2.5 text-SlateBlueText rounded-lg border-border dark:text-white border-solid dark:bg-darkmode border transition-all duration-500 focus:border-primary dark:focus:border-primary dark:border-dark_border focus:border-solid focus:outline-0"
                  required
                >
                  <option value="">Select an option</option>
                  <option value="Yes">Yes</option>
                  <option value="No">No</option>
                </select>
              </div>
            </div>

            <div className="mx-0 my-2.5 w-full">
              <label
                htmlFor="suicidalThoughts"
                className="pb-3 inline-block text-base text-SlateBlueText dark:text-white"
              >
                Have you ever had suicidal thoughts?{" "}
                <span className="text-red-500">*</span>
              </label>
              <select
                id="suicidalThoughts"
                name="suicidalThoughts"
                value={formData.suicidalThoughts}
                onChange={handleInputChange}
                className="w-full text-base px-4 py-2.5 text-SlateBlueText rounded-lg border-border dark:text-white border-solid dark:bg-darkmode border transition-all duration-500 focus:border-primary dark:focus:border-primary dark:border-dark_border focus:border-solid focus:outline-0"
                required
              >
                <option value="">Select an option</option>
                <option value="Yes">Yes</option>
                <option value="No">No</option>
              </select>
            </div>

            {/* Submit Button */}
            <div className="mx-0 my-2.5 w-full">
              <button
                type="submit"
                disabled={loading}
                className="mt-4 btn btn-1 hover-filled-slide-down overflow-hidden rounded-lg disabled:opacity-60"
              >
                <span>
                  {loading ? "Loading risk profile..." : "Predict Risk Profile"}
                </span>
              </button>
            </div>
          </form>

          
            {riskLabel && probabilities && (
  <PredictionResult
    result={{
      riskLabel: riskLabel as "LOW RISK" | "HIGH RISK",
      probabilities: probabilities as {
        "LOW RISK": number;
        "HIGH RISK": number;
      },
      comparison: comparison ?? undefined,
    }}
  />
)}

        </div>
      </div>
    </section>
  );
};

export default ClusteringForm;
