import Testimonials from "@/components/Home/Testimonials";
import TicketSection from "@/components/Home/TicketSection";
import HeroSub from "@/components/SharedComponent/HeroSub";
import Developpers from '@/components/Home/Developpers';
import React from "react";
import { Metadata } from "next";
export const metadata: Metadata = {
  title: "Speakers | Studentsense",
};

const page = () => {
    const breadcrumbLinks = [
        { href: "/", text: "Home" },
        { href: "/speakers", text: "Students" },
      ];
  return (
    <>
      <HeroSub
        title="Our Creators"
        description="See what students who tried our platform have to say. Their experiences reflect how data-driven insights can support real academic and well-being improvement."
        breadcrumbLinks={breadcrumbLinks}
      />
      <Developpers showTitle={false} />
      <Testimonials/>
      <TicketSection/>
    </>
  );
};

export default page;
