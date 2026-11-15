import React from "react";
import BlogList from "@/components/Blog/BlogList";
import HeroSub from "@/components/SharedComponent/HeroSub";
import { Metadata } from "next";
import TicketSection from "@/components/Home/TicketSection";
export const metadata: Metadata = {
  title: "Blog | Studentsense",
};

const BlogPage = () => {
    const breadcrumbLinks = [
        { href: "/", text: "Home" },
        { href: "/blog", text: "Blog" },
    ];
    return (
        <>
            <HeroSub
                title="Blog"
                description="Explore articles focused on student mental health, depression awareness, stress management, and academic well-being. Our blog provides practical insights, research-based explanations, and helpful guidance to support students in their daily challenges."
                breadcrumbLinks={breadcrumbLinks}
            />
            <BlogList />
            <TicketSection/>
        </>
    );
};

export default BlogPage;