
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { GlassWater } from "lucide-react";

function NotFound() {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center text-white p-4">
      <div className="glass-card p-8 rounded-xl text-center max-w-md">
        <GlassWater size={64} className="mx-auto mb-6 text-gold" />
        <h1 className="text-4xl font-bold font-playfair mb-4">
          <span className="txt-gradient">404</span>
        </h1>
        <p className="text-xl mb-6">Oops! This page seems to have evaporated.</p>
        <p className="text-white/70 mb-8">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Button asChild className="bg-gold hover:bg-gold/80 text-black">
          <Link to="/">Back to Home</Link>
        </Button>
      </div>
    </div>
  );
}

export default NotFound;
