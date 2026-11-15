"use client";

import React, { useState } from "react";
import toast from "react-hot-toast";

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

const MLAssessmentForm = () => {
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

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate required fields
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
      toast.error("Please fill in all required fields");
      return;
    }

    // Here you can send the data to your ML API for depression prediction
    console.log("Form Data for Depression Prediction:", formData);
    toast.success("Assessment submitted successfully! Processing depression prediction...");
    
    // Reset form after submission
    setFormData({
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
  };

  return (
    <section className="dark:bg-darkmode lg:pb-24 pb-16 pt-0">
      <div className="container mx-auto lg:max-w-screen-xl md:max-w-screen-md">
        <div className="max-w-4xl mx-auto">
          <h2 className="max-w-72 text-[40px] leading-[3.4rem] font-bold mb-9 text-secondary dark:text-white">
            Depression Prediction Assessment
          </h2>
          <form onSubmit={handleSubmit} className="flex flex-wrap w-full m-auto justify-between">
            {/* Personal Information Section */}
            <div className="sm:flex gap-3 w-full">
              <div className="mx-0 my-2.5 flex-1">
                <label
                  htmlFor="gender"
                  className="pb-3 inline-block text-base text-SlateBlueText dark:text-white"
                >
                  Gender *
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
                  <option value="Other">Other</option>
                  <option value="Prefer not to say">Prefer not to say</option>
                </select>
              </div>
              <div className="mx-0 my-2.5 flex-1">
                <label
                  htmlFor="age"
                  className="pb-3 inline-block text-base text-SlateBlueText dark:text-white"
                >
                  Age *
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
                  City *
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
                  Degree *
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
                  <option value="High School">High School</option>
                  <option value="Bachelor's">Bachelor's</option>
                  <option value="Master's">Master's</option>
                  <option value="PhD">PhD</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>

            {/* Academic Information Section */}
            <div className="sm:flex gap-3 w-full">
              <div className="mx-0 my-2.5 flex-1">
                <label
                  htmlFor="cgpa"
                  className="pb-3 inline-block text-base text-SlateBlueText dark:text-white"
                >
                  CGPA *
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
                  Academic Pressure (1-10) *
                </label>
                <input
                  id="academicPressure"
                  name="academicPressure"
                  type="number"
                  min="1"
                  max="10"
                  value={formData.academicPressure}
                  onChange={handleInputChange}
                  className="w-full text-base px-4 rounded-lg py-2.5 border-border dark:border-dark_border border-solid dark:text-white dark:bg-darkmode border transition-all duration-500 focus:border-primary dark:focus:border-primary focus:border-solid focus:outline-0"
                  placeholder="Rate from 1 (low) to 10 (high)"
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
                  Study Satisfaction (1-10) *
                </label>
                <input
                  id="studySatisfaction"
                  name="studySatisfaction"
                  type="number"
                  min="1"
                  max="10"
                  value={formData.studySatisfaction}
                  onChange={handleInputChange}
                  className="w-full text-base px-4 rounded-lg py-2.5 border-border dark:border-dark_border border-solid dark:text-white dark:bg-darkmode border transition-all duration-500 focus:border-primary dark:focus:border-primary focus:border-solid focus:outline-0"
                  placeholder="Rate from 1 (low) to 10 (high)"
                  required
                />
              </div>
              <div className="mx-0 my-2.5 flex-1">
                <label
                  htmlFor="workStudyHours"
                  className="pb-3 inline-block text-base text-SlateBlueText dark:text-white"
                >
                  Work/Study Hours (per day) *
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

            {/* Lifestyle Section */}
            <div className="sm:flex gap-3 w-full">
              <div className="mx-0 my-2.5 flex-1">
                <label
                  htmlFor="sleepDuration"
                  className="pb-3 inline-block text-base text-SlateBlueText dark:text-white"
                >
                  Sleep Duration (hours per day) *
                </label>
                <input
                  id="sleepDuration"
                  name="sleepDuration"
                  type="number"
                  min="0"
                  max="24"
                  step="0.5"
                  value={formData.sleepDuration}
                  onChange={handleInputChange}
                  className="w-full text-base px-4 rounded-lg py-2.5 border-border dark:border-dark_border border-solid dark:text-white dark:bg-darkmode border transition-all duration-500 focus:border-primary dark:focus:border-primary focus:border-solid focus:outline-0"
                  placeholder="Enter average hours of sleep per day"
                  required
                />
              </div>
              <div className="mx-0 my-2.5 flex-1">
                <label
                  htmlFor="dietaryHabits"
                  className="pb-3 inline-block text-base text-SlateBlueText dark:text-white"
                >
                  Dietary Habits *
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
                  <option value="Irregular">Irregular</option>
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
                  Financial Stress (1-10) *
                </label>
                <input
                  id="financialStress"
                  name="financialStress"
                  type="number"
                  min="1"
                  max="10"
                  value={formData.financialStress}
                  onChange={handleInputChange}
                  className="w-full text-base px-4 rounded-lg py-2.5 border-border dark:border-dark_border border-solid dark:text-white dark:bg-darkmode border transition-all duration-500 focus:border-primary dark:focus:border-primary focus:border-solid focus:outline-0"
                  placeholder="Rate from 1 (low) to 10 (high)"
                  required
                />
              </div>
              <div className="mx-0 my-2.5 flex-1">
                <label
                  htmlFor="familyHistoryMentalIllness"
                  className="pb-3 inline-block text-base text-SlateBlueText dark:text-white"
                >
                  Family History of Mental Illness *
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
                  <option value="Not sure">Not sure</option>
                </select>
              </div>
            </div>

            <div className="mx-0 my-2.5 w-full">
              <label
                htmlFor="suicidalThoughts"
                className="pb-3 inline-block text-base text-SlateBlueText dark:text-white"
              >
                Have you ever had suicidal thoughts? *
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
                <option value="Prefer not to answer">Prefer not to answer</option>
              </select>
            </div>

            {/* Submit Button */}
            <div className="mx-0 my-2.5 w-full">
              <button
                type="submit"
                className="mt-4 btn btn-1 hover-filled-slide-down overflow-hidden rounded-lg"
              >
                <span>Predict Depression</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

export default MLAssessmentForm;

