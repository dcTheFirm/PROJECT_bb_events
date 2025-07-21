import React, { useState, useEffect, useRef } from 'react';
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { ChevronLeft, ChevronRight, X, Volume2, VolumeX } from 'lucide-react';

import { supabase } from '../lib/supabaseClient'; // Add this import

const BUCKET = 'hero-media'; // Bucket name for hero media



function Hero() {
  const [mediaList, setMediaList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isMuted, setIsMuted] = useState(true); // Add this line to track mute status

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
  
  // Setup intersection observer to detect when hero is in viewport
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

  // Click to pause/resume video and unmute
  const handleVideoClick = () => {
    if (videoRef.current) {
      if (videoRef.current.paused) {
        // When user clicks to play, don't automatically unmute
        // Let the user control muting with the dedicated button
        videoRef.current.play().catch(e => console.log('Video play failed on click:', e));
        setVideoPaused(false);
      } else {
        videoRef.current.pause();
        setVideoPaused(true);
      }
    }
  };

  // Pause/resume autoplay and video when hero is out of view
  useEffect(() => {
    if (!isInView) {
      setIsAutoplay(false);
      if (videoRef.current && !videoRef.current.paused) {
        videoRef.current.pause();
        setVideoPaused(true);
      }
    } else if (isInView && isCurrentVideo) {
      // Only resume autoplay when coming back into view
      setIsAutoplay(true);
      // Only try to play if we previously paused due to scrolling away
      if (videoRef.current && videoPaused) {
        videoRef.current.play().catch(e => console.log('Video play failed on scroll back:', e));
        setVideoPaused(false);
      }
    } else {
      // For images, just resume autoplay
      setIsAutoplay(true);
    }
  }, [isInView, isCurrentVideo, videoPaused]);

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

  // When switching to a video, always play from start (muted for autoplay)
  useEffect(() => {
    if (isCurrentVideo && videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.muted = true; // Set to muted to allow autoplay
      videoRef.current.play().catch(e => console.log('Video play failed:', e));
      setVideoPaused(false);
    }
    // When leaving a video, stop it
    return () => {
      stopAndResetVideo();
    };
    // eslint-disable-next-line
  }, [currentIdx]);

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
      <section id="home" ref={heroRef} className="pt-24 pb-8 bg-black relative overflow-hidden scroll-mt-24">
        <div className="container mx-auto px-4">
          {/* Hero header */}
          <div className="text-center mb-8">
            <h1 className="text-[30px] md:text-[30px] font-extrabold font-['Playfair_Display'] text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-300 to-gray-500 drop-shadow-lg">
              <span className="bg-gradient-to-r from-white to-gray-300 text-transparent bg-clip-text font-extrabold">
                Our W
              </span>
              <span className="bg-gradient-to-r from-gray-300 via-gray-400 to-gray-600 text-transparent bg-clip-text font-bold">
                orks, Your Inspiration
              </span>
            </h1>
          </div>

          {/* Media Carousel */}
          <div className="w-full mx-auto relative">
            <div className="w-full flex items-center justify-between gap-2">
              {/* Navigation arrows - outside the media */}
              <button
                onClick={prevSlide}
                className="z-20 w-10 h-10 bg-black/60 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-black/90 transition-all hover:scale-110 shadow-lg"
                aria-label="Previous media"
              >
                <ChevronLeft size={20} />
              </button>

              {/* Main media display with fixed aspect ratio and max dimensions */}
              <div className="relative overflow-hidden rounded-xl glass-effect shadow-2xl flex-1 flex items-center justify-center bg-black/40 backdrop-blur-sm" style={{ height: "450px" }}>
                {mediaList.map((media, index) => (
                  <div 
                    key={media.id} 
                    className={`absolute top-0 left-0 w-full h-full transition-opacity duration-700 ease-out flex items-center justify-center ${
                      index === currentIdx ? 'opacity-100 z-10' : 'opacity-0 z-0'
                    }`}
                  >
                    <div className={`relative w-full h-full flex items-center justify-center mx-auto`}>
                      {!media.media_url ? (
                        <div className="text-red-500">Media URL not available</div>
                      ) : media.media_type === 'video' ? (
                        <div className="relative w-full h-full" onClick={index === currentIdx ? handleVideoClick : undefined}>
                          <video
                            ref={index === currentIdx ? videoRef : null}
                            src={media.media_url}
                            className="w-full h-full object-cover cursor-pointer shadow-lg"
                            autoPlay={index === currentIdx}
                            muted={isMuted} // Use the isMuted state
                            playsInline
                            preload="metadata"
                            poster={media.poster_url || undefined}
                            onEnded={index === currentIdx ? handleVideoEnd : undefined}
                            // Remove onClick from here as we've moved it to the parent div
                          />
                          {index === currentIdx && isCurrentVideo && (
                            <button 
                              onClick={(e) => {
                                e.stopPropagation(); // Prevent video play/pause
                                setIsMuted(!isMuted);
                                if (videoRef.current) {
                                  videoRef.current.muted = !isMuted;
                                }
                              }}
                              className="absolute bottom-4 right-4 z-20 w-10 h-10 bg-black/60 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-black/90 transition-all hover:scale-110 shadow-lg"
                              aria-label={isMuted ? "Unmute video" : "Mute video"}
                            >
                              {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
                            </button>
                          )}
                        </div>
                      ) : (
                        <img
                          src={media.media_url}
                          alt={media.title}
                          className="w-full h-full object-cover shadow-lg"
                          onClick={() => setSelectedMedia(media)}
                        />
                      )}

                      {/* Overlay info */}
                      {(media.title || media.description) && (
                        <div className="absolute bottom-3 left-3 max-w-[60%] bg-black/75 backdrop-blur-sm rounded-lg px-3 py-2 flex flex-col items-start gap-0.5 shadow-xl">
                          {media.title && <h3 className="text-base font-bold text-white leading-tight">{media.title}</h3>}
                          {media.description && <p className="text-white/80 text-xs leading-snug line-clamp-1">{media.description}</p>}
                          {media.category && (
                            <span className="inline-block bg-amber-400/90 text-black px-2 py-0.5 rounded-full text-xs font-semibold shadow-md mt-0.5">
                              {media.category}
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <button
                onClick={nextSlide}
                className="z-20 w-10 h-10 bg-black/60 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-black/90 transition-all hover:scale-110 shadow-lg"
                aria-label="Next media"
              >
                <ChevronRight size={20} />
              </button>
            </div>

            {/* Dots navigation */}
            <div className="flex justify-center mt-4 space-x-2">
              {mediaList.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
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
      

      {/* Media Modal */}
      <Dialog open={!!selectedMedia} onOpenChange={() => setSelectedMedia(null)}>
        <DialogContent className="max-w-5xl bg-black/95 border-gray-800 p-0 overflow-hidden rounded-xl">
          <div className="relative">
            {/* Close Button */}
            <button
              onClick={() => setSelectedMedia(null)}
              className="absolute top-4 right-4 z-20 w-10 h-10 bg-black/60 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-black/80 transition-colors shadow-lg"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Media Content */}
            <div className="relative p-4">
              {!selectedMedia?.media_url ? (
                <div className="text-red-500 p-8">Media URL not available</div>
              ) : selectedMedia?.media_type === 'video' ? (
                <div className="flex items-center justify-center w-full">
                  <div className="relative w-full aspect-video flex items-center justify-center">
                    <video
                      src={selectedMedia.media_url}
                      className="w-full h-full object-contain rounded-lg shadow-lg"
                      controls
                      autoPlay
                      muted
                      playsInline
                      poster={selectedMedia.poster_url || undefined}
                      onEnded={() => setSelectedMedia(null)}
                    />
                    {(selectedMedia.title || selectedMedia.description) && (
                      <div className="absolute bottom-6 left-6 max-w-[70%] bg-black/80 rounded-lg px-5 py-4 flex flex-col items-start gap-2 shadow-xl">
                        {selectedMedia.title && (
                          <h3 className="text-xl md:text-2xl font-bold text-white mb-1 leading-tight">
                            {selectedMedia.title}
                          </h3>
                        )}
                        {selectedMedia.description && (
                          <p className="text-white/90 text-sm md:text-base leading-snug">
                            {selectedMedia.description}
                          </p>
                        )}
                        {selectedMedia.category && (
                          <span className="inline-block bg-amber-400/90 text-black px-3 py-1 rounded-full text-xs font-semibold shadow-md mt-1">
                            {selectedMedia.category}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-center w-full">
                  <div className="relative w-full max-height-[80vh] flex items-center justify-center">
                    <img
                      src={selectedMedia.media_url}
                      alt={selectedMedia.title}
                      className="w-full max-h-[70vh] object-contain rounded-lg shadow-lg"
                    />
                    {(selectedMedia.title || selectedMedia.description) && (
                      <div className="absolute bottom-6 left-6 max-w-[70%] bg-black/80 rounded-lg px-5 py-4 flex flex-col items-start gap-2 shadow-xl">
                        {selectedMedia.title && (
                          <h3 className="text-xl md:text-2xl font-bold text-white mb-1 leading-tight">
                            {selectedMedia.title}
                          </h3>
                        )}
                        {selectedMedia.description && (
                          <p className="text-white/90 text-sm md:text-base leading-snug">
                            {selectedMedia.description}
                          </p>
                        )}
                        {selectedMedia.category && (
                          <span className="inline-block bg-amber-400/90 text-black px-3 py-1 rounded-full text-xs font-semibold shadow-md mt-1">
                            {selectedMedia.category}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </section>
  );
}

export default Hero;
