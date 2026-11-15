import React from 'react'
import { Metadata } from "next";
import Hero from '@/components/Home/Hero';
import ThumbnailCarousel from '@/components/Home/Conferences';
import WorkSpeakers from '@/components/Home/WorkSpeakers';
import EventTicket from '@/components/Home/EventTicket';
import Highlight from '@/components/Home/YearHighlight/page';
import Upcoming from '@/components/Home/Upcoming';
import Testimonials from '@/components/Home/Testimonials';
import TicketSection from '@/components/Home/TicketSection';
import Developpers from '@/components/Home/Developpers';
import Clustering from '@/components/Home/clustering';
export const metadata: Metadata = {
  title: "Studentsense",
};

export default function Home() {
  return (
    <main>
      <Hero />
      <ThumbnailCarousel/>
      <WorkSpeakers/>
      <EventTicket/>
      <Highlight/>
      <Clustering/>
      <Upcoming/>
      <Testimonials/>
      <TicketSection/>
    </main>
  )
}
