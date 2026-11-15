import React from "react";
import Link from "next/link";
import Image from "next/image";

const Clustering = () => {
  return (
    <section className="dark:bg-darkmode pt-0">
      <div className="container">

        <div className="text-center md:pb-20 pb-8 mt-12">
          <h2
            className="pb-8"
            data-aos="fade-up"
            data-aos-delay="200"
            data-aos-duration="1000"
          >
            Data-Driven Identification of Student Mental Health Risk Profiles
          </h2>

          <p
            data-aos="fade-up"
            data-aos-delay="300"
            data-aos-duration="1000"
            className="text-SlateBlueText dark:text-opacity-80 text-lg font-normal max-w-920 m-auto"
          >
            The platform applies machine learning techniques to analyze
            behavioral, academic, and psychological variables among students.
            By identifying hidden patterns in the data, the model groups students
            into distinct mental health profiles, including low-risk and high-risk
            categories, with a particular focus on early detection of suicidal
            vulnerability and prevention-oriented intervention.
          </p>
        </div>
        <div
          className="flex flex-wrap items-stretch"
          data-aos="fade-up"
          data-aos-delay="400"
          data-aos-duration="1000"
        >
          {/* Image */}
          <div className="bg-primary flex items-center justify-center lg:px-16 px-8 lg:py-0 py-8 lg:rounded-l-22 rounded-t-22 md:rounded-tr-none md:rounded-bl-22 rounded-bl-none md:w-2/4 w-full">
            <Image
              src="/images/event-ticket/test.png"
              alt="Student mental health clustering visualization"
              width={0}
              height={0}
              quality={100}
              layout="responsive"
              sizes="100vh"
            />
          </div>

          {/* Text Card */}
          <div className="bg-ElectricAqua lg:py-14 py-6 lg:px-16 px-8 lg:rounded-r-22 rounded-b-22 md:rounded-bl-none md:rounded-tr-22 rounded-tr-none md:w-2/4 w-full">
            <div className="bg-white dark:bg-darklight rounded-22 lg:px-11 px-4 pt-8 pb-10">

              <h6 className="text-[26px] leading-[2.1rem] font-bold text-secondary dark:text-white pb-5">
                Profiling Risk Overview
              </h6>

              <div className="space-y-5">

                <div>
                  <span className="text-[22px] font-bold text-secondary dark:text-white">
                    Risk Profile Discovery
                  </span>
                  <p className="text-xl font-normal text-secondary dark:text-darktext mt-1">
                    Identify student groups based on mental health patterns, 
                    and psychological stress indicators.
                  </p>
                </div>

                <div>
                  <span className="text-[22px] font-bold text-secondary dark:text-white">
                    Early Intervention & Prevention
                  </span>
                  <p className="text-xl font-normal text-secondary dark:text-darktext mt-1">
                    Detect high-risk profiles early to enable timely 
                    support and prevention strategies.
                  </p>
                </div>

                <Link
                  href="/ml_clustering_model"
                  className="btn btn-1 hover-filled-slide-down w-full text-center rounded-lg overflow-hidden mt-6"
                >
                  <span>Discover Your Well-Being Profile</span>
                </Link>

              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};

export default Clustering;
