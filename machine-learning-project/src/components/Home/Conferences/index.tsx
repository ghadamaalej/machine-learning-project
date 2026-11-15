import React from "react";
import Link from "next/link";
import ThumbnailCarousel from "../ThumbnailCarousel";

const Conferences = () => {
  return (
    <>
      <section className="bg-IcyBreeze dark:bg-darklight relative overflow-hidden before:absolute before:content-[''] before:bg-PaleSkyBlu before:dark:bg-secondary before:w-687 before:h-687 before:-bottom-1/2 before:rounded-full before:xl:inline-block before:hidden">
        <div className="container">
          <div className="grid md:grid-cols-2 grid-cols-1 items-center lg:gap-24 gap-5">
            <div
              data-aos="fade-right"
              data-aos-delay="200"
              data-aos-duration="1000"
            >
              <ThumbnailCarousel />
            </div>
            <div
              className="md:pt-0 pt-6"
              data-aos="fade-left"
              data-aos-delay="200"
              data-aos-duration="1000"
            >
              <h2>Feeling overwhelmed and unsure what to do?</h2>
              <p className="text-lg font-normal text-SlateBlueText dark:text-opacity-80 max-w-506 md:pt-9 pt-5 md:pb-14 pb-6">
                College life can be challenging, and it’s normal to experience stress, pressure, 
                or moments of doubt. If you’re struggling with your mental well-being, 
                you don’t have to go through it alone. Explore helpful resources, coping strategies, 
                and professional support options that can guide you toward feeling better — one step at a time
              </p>
              <Link
                href="/recommend"
                className="btn_outline btn-2 hover-outline-slide-down"
              >
                <span>Get Recommendations</span>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Conferences;
