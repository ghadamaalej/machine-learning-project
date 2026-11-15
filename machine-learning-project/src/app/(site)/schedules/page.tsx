import BoxSlider from "@/components/SharedComponent/BoxSlider";
import HeroSub from "@/components/SharedComponent/HeroSub";
import React from "react";
import '@/Style/style.css'
import Schedules from "@/components/Home/Schedules";
import TicketSection from "@/components/Home/TicketSection";
import Testimonial from "@/components/SharedComponent/Testimonial";
import Testimonials from "@/components/Home/Testimonials";
import { Metadata } from "next";
export const metadata: Metadata = {
  title: "Schedules | Studentsense",
};

const page = () => {
  const breadcrumbLinks = [
    { href: "/", text: "Home" },
    { href: "/schedules", text: "Schedules" },
  ];
  return (
    <>
      <HeroSub
        title="Session Schedules"
        description="Discover how mental health can affect your academic outcome. Learn how to deal with stress and depression."
        breadcrumbLinks={breadcrumbLinks}
      />
      <section className="dark:bg-darkmode">  
        <div className="container upcoming">
          <BoxSlider/>
          <Schedules/>        
        </div>
      </section>      
      <div>
        <Testimonials />
        <TicketSection/>
      </div>
    </>
  );
};

export default page;
