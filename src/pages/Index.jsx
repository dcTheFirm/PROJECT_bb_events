
import React, { useEffect } from "react";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Team from "@/components/Team";
import Services from "@/components/Services";
import Gallery from "@/components/Gallery";
import Testimonials from "@/components/Testimonials";
import Footer from "@/components/Footer";
import BackgroundEffects from "@/components/BackgroundEffects";
import BookingForm from "@/components/BookingForm";

const Index = () => {
  // Smooth scroll effect for anchor links
  useEffect(() => {
    const handleAnchorClick = (e) => {
      const target = e.target;
      if (target.tagName === 'A' && target.getAttribute('href')?.startsWith('#')) {
        e.preventDefault();
        const targetId = target.getAttribute('href')?.substring(1);
        const targetElement = document.getElementById(targetId || '');
        
        if (targetElement) {
          window.scrollTo({
            top: targetElement.offsetTop,
            behavior: 'smooth'
          });
        }
      }
    };

    document.addEventListener('click', handleAnchorClick);
    return () => document.removeEventListener('click', handleAnchorClick);
  }, []);
  
  return (
    <div className="min-h-screen bg-black text-white font-['Montserrat'] relative antialiased overflow-x-hidden">
      <BackgroundEffects />
      <Navbar />
      <Hero />
      <About />
      <Team />
      <Services />
      <Gallery />
      <Testimonials />
      <BookingForm />
      <Footer />
    </div>
  );
};

export default Index;
