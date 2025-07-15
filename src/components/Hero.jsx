import React, { useState, useEffect, useRef } from 'react';
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { ChevronLeft, ChevronRight, X } from 'lucide-react';

import { supabase } from '../lib/supabaseClient'; // Add this import

const BUCKET = 'hero-media'; // Bucket name for hero media



function Hero() {
  const [mediaList, setMediaList] = useState([]);
  const [loading, setLoading] = useState(true);

  // Only add these two new lines:
  const heroRef = useRef(null);
  const [isInView, setIsInView] = useState(true); // Track if hero is in viewport

  // Fetch media from Supabase on mount
  useEffect(() => {
    async function fetchMedia() {
      setLoading(true);
      const { data, error } = await supabase.from('hero_media').select('*').order('id', { ascending: true });
      if (!error && data) {
        setMediaList(data);
      } else {
        setMediaList([]);
      }
      setLoading(false);
    }
    fetchMedia();
  }, []);

  // Carousel state
  const [selectedMedia, setSelectedMedia] = useState(null);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [isAutoplay, setIsAutoplay] = useState(true);
  const [videoPaused, setVideoPaused] = useState(false);
  const videoRef = useRef(null);
  const intervalRef = useRef(null);

  // Use mediaList instead of sampleMedia
  const currentMedia = mediaList[currentIdx] || null;
  const isCurrentVideo = currentMedia?.media_type === 'video';
  useEffect(() => {
    const observer = new window.IntersectionObserver(
      ([entry]) => {
        setIsInView(entry.isIntersecting);
      },
      { threshold: 0.15 }
    );
    if (heroRef.current) {
      observer.observe(heroRef.current);
    }
    return () => {
      if (heroRef.current) observer.unobserve(heroRef.current);
    };
  }, []);

  // Pause/resume autoplay and video when hero is out of view
  useEffect(() => {
    if (!isInView) {
      setIsAutoplay(false);
      if (videoRef.current && !videoRef.current.paused) {
        videoRef.current.pause();
        setVideoPaused(true);
      }
    } else {
      setIsAutoplay(true);
      if (videoRef.current && videoPaused) {
        videoRef.current.play();
        setVideoPaused(false);
      }
    }
    // eslint-disable-next-line
  }, [isInView]);

  // Helper to stop and reset video
  const stopAndResetVideo = () => {
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
    setVideoPaused(false);
  };

  // Go to next slide
  const nextSlide = () => {
    stopAndResetVideo();
    setCurrentIdx((prev) => (mediaList.length === 0 ? 0 : (prev === mediaList.length - 1 ? 0 : prev + 1)));
    setIsAutoplay(false);
  };

  // Go to previous slide
  const prevSlide = () => {
    stopAndResetVideo();
    setCurrentIdx((prev) => (mediaList.length === 0 ? 0 : (prev === 0 ? mediaList.length - 1 : prev - 1)));
    setIsAutoplay(false);
  };

  // Go to specific slide
  const goToSlide = (index) => {
    stopAndResetVideo();
    setCurrentIdx(index);
    setIsAutoplay(false);
  };

  // Handle video end event
  const handleVideoEnd = () => {
    nextSlide();
  };

  // Image auto-advance logic (1.5 seconds)
  useEffect(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    if (isAutoplay && !isCurrentVideo) {
      intervalRef.current = setInterval(() => {
        nextSlide();
      }, 1500);
    }
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [currentIdx, isAutoplay, isCurrentVideo]);

  // Reset autoplay after manual navigation
  useEffect(() => {
    if (!isAutoplay) {
      const timer = setTimeout(() => {
        setIsAutoplay(true);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [isAutoplay]);

  // When switching to a video, always play from start (unmuted)
  useEffect(() => {
    if (isCurrentVideo && videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.muted = false;
      videoRef.current.play();
      setVideoPaused(false);
    }
    // When leaving a video, stop it
    return () => {
      stopAndResetVideo();
    };
    // eslint-disable-next-line
  }, [currentIdx]);

  // Click to pause/resume video
  const handleVideoClick = () => {
    if (videoRef.current) {
      if (videoRef.current.paused) {
        videoRef.current.play();
        setVideoPaused(false);
      } else {
        videoRef.current.pause();
        setVideoPaused(true);
      }
    }
  };

  // Loading state
  if (loading) {
    return (
      <section className="py-24 bg-black flex items-center justify-center min-h-[400px]">
        <div className="text-white text-xl">Loading hero media...</div>
      </section>
    );
  }

  // Empty state
  if (!mediaList.length) {
    return (
      <section className="py-24 bg-black flex items-center justify-center min-h-[400px]">
        <div className="text-white text-xl">No hero media uploaded yet.</div>
      </section>
    );
  }

  return (
    <section ref={heroRef} className="py-24 bg-black relative overflow-hidden">
      <div className="container mx-auto px-4">
        {/* Hero header */}
        <div className="text-center mb-16">
          <h1 className="text-3xl md:text-4xl font-bold mb-4 font-['Playfair_Display'] text-[#b497bd]">
            Our Works, Your Inspiration
          </h1>
          <p className="text-white/80 text-lg">
            Experience the magic of our events through a stunning showcase of visuals and moments.
          </p>
        </div>

        {/* Media Carousel */}
        <div className="max-w-6xl mx-auto">
          <div className="relative">
            {/* Navigation arrows */}
            <button
              onClick={prevSlide}
              className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 bg-black/60 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-black/90 transition-all hover:scale-110 shadow-lg"
              aria-label="Previous media"
            >
              <ChevronLeft size={24} />
            </button>

            <button
              onClick={nextSlide}
              className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 bg-black/60 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-black/90 transition-all hover:scale-110 shadow-lg"
              aria-label="Next media"
            >
              <ChevronRight size={24} />
            </button>

            {/* Main media display */}
            <div className="relative overflow-hidden rounded-2xl glass-effect shadow-2xl">
              <div
                className="transition-all duration-700 ease-out"
                style={{ transform: `translateX(-${currentIdx * 100}%)` }}
              >
                <div className="flex">
                  {mediaList.map((media, index) => (
                    <div key={media.id} className="w-full flex-shrink-0">
                      <div className="relative aspect-video">
                        {!media.media_url ? (
                          <div className="text-red-500">Media URL not available</div>
                        ) : media.media_type === 'video' ? (
                          <div className="relative w-full h-full">
                            <video
                              ref={index === currentIdx ? videoRef : null}
                              src={media.media_url}
                              className="w-full h-full object-cover cursor-pointer"
                              autoPlay={index === currentIdx}
                              playsInline
                              preload="metadata"
                              poster={media.poster_url || undefined}
                              onEnded={index === currentIdx ? handleVideoEnd : undefined}
                              onClick={index === currentIdx ? handleVideoClick : undefined}
                            />
                            {index === currentIdx && (
                              <div className="absolute bottom-4 right-4 bg-black/60 rounded-full px-3 py-1 text-white text-xs select-none pointer-events-none">
                                {videoPaused ? 'Paused' : 'Playing'}
                              </div>
                            )}
                          </div>
                        ) : (
                          <img
                            src={media.media_url}
                            alt={media.title}
                            className="w-full h-full object-cover"
                          />
                        )}

                        {/* Overlay info */}
                        <div className="absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-black/90 via-black/50 to-transparent">
                          <h3 className="text-3xl font-bold text-white mb-3 drop-shadow-lg">{media.title}</h3>
                          <p className="text-white/90 text-lg mb-4 drop-shadow">{media.description}</p>
                          {media.category && (
                            <span className="inline-block bg-amber-400/90 text-black px-4 py-2 rounded-full text-sm font-semibold shadow-lg">
                              {media.category}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Dots navigation */}
            <div className="flex justify-center mt-8 space-x-3">
              {mediaList.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={`w-4 h-4 rounded-full transition-all duration-300 ${
                    index === currentIdx 
                      ? 'bg-amber-400 scale-125 shadow-lg' 
                      : 'bg-white/30 hover:bg-white/50 hover:scale-110'
                  }`}
                  aria-label={`Go to media ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Media Modal */}
      <Dialog open={!!selectedMedia} onOpenChange={() => setSelectedMedia(null)}>
        <DialogContent className="max-w-4xl bg-black/95 border-gray-800 p-0 overflow-hidden">
          <div className="relative">
            {/* Close Button */}
            <button
              onClick={() => setSelectedMedia(null)}
              className="absolute top-4 right-4 z-20 w-10 h-10 bg-black/60 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-black/80 transition-colors shadow-lg"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Media Content */}
            <div className="relative">
              {selectedMedia?.media_type === 'video' ? (
                <AspectRatio ratio={16/9}>
                  <video
                    src={selectedMedia?.public_url}
                    className="w-full h-full object-cover rounded-2xl shadow-lg"
                    controls
                    autoPlay
                  />
                </AspectRatio>
              ) : (
                <AspectRatio ratio={16/9}>
                  <img
                    src={selectedMedia?.public_url}
                    alt={selectedMedia?.title}
                    className="w-full h-full object-cover rounded-2xl shadow-lg"
                  />
                </AspectRatio>
              )}
            </div>

            {/* Media Info */}
            <div className="p-6">
              <h3 className="text-2xl font-bold text-white mb-2 drop-shadow">{selectedMedia?.title}</h3>
              <p className="text-gray-200 mb-4 drop-shadow">{selectedMedia?.description}</p>
              {selectedMedia?.category && (
                <span className="inline-block bg-amber-400/90 text-black px-3 py-1 rounded-full text-sm font-semibold shadow">
                  {selectedMedia.category}
                </span>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </section>
  );
}

export default Hero;
