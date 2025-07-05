import React, { useState, useEffect, useRef } from 'react';
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { ChevronLeft, ChevronRight, X } from 'lucide-react';

// Sample media (images and videos from Unsplash/Pexels)
const sampleMedia = [
  {
    id: 1,
    media_type: 'image',
    media_url: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80',
    title: 'Elegant Event Setup',
    description: 'A beautifully decorated event space with ambient lighting and modern decor.',
    category: 'Event',
  },
  {
    id: 2,
    media_type: 'video',
    media_url: 'https://www.learningcontainer.com/wp-content/uploads/2020/05/sample-mp4-file.mp4',
    title: 'Mixology in Action',
    description: 'Watch our bartender craft signature cocktails with flair and precision.',
    category: 'Bartending',
  },
  {
    id: 3,
    media_type: 'image',
    media_url: 'https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=800&q=80',
    title: 'Gourmet Presentation',
    description: 'Stunning food and drink presentation for a luxury event.',
    category: 'Catering',
  },
  {
    id: 4,
    media_type: 'video',
    media_url: 'https://www.learningcontainer.com/wp-content/uploads/2020/05/sample-mp4-file.mp4',
    title: 'Event Highlights',
    description: 'A quick look at the highlights from our recent events.',
    category: 'Highlights',
  },
  {
    id: 5,
    media_type: 'image',
    media_url: 'https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=800&q=80',
    title: 'Live Music Vibes',
    description: 'Live band performance energizing the crowd at a night event.',
    category: 'Entertainment',
  },
  {
    id: 6,
    media_type: 'image',
    media_url: 'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=800&q=80',
    title: 'Chic Lounge Area',
    description: 'Modern lounge area for guests to relax and socialize.',
    category: 'Lounge',
  },
];

function Hero() {
  const [selectedMedia, setSelectedMedia] = useState(null);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [isAutoplay, setIsAutoplay] = useState(true);
  const [videoPaused, setVideoPaused] = useState(false);
  const videoRef = useRef(null);
  const intervalRef = useRef(null);

  const currentMedia = sampleMedia[currentIdx];
  const isCurrentVideo = currentMedia?.media_type === 'video';

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
    setCurrentIdx((prev) => (prev === sampleMedia.length - 1 ? 0 : prev + 1));
    setIsAutoplay(false);
  };

  // Go to previous slide
  const prevSlide = () => {
    stopAndResetVideo();
    setCurrentIdx((prev) => (prev === 0 ? sampleMedia.length - 1 : prev - 1));
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

  return (
    <section className="py-24 bg-black relative overflow-hidden">
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
                  {sampleMedia.map((media, index) => (
                    <div key={media.id} className="w-full flex-shrink-0">
                      <div className="relative aspect-video">
                        {media.media_type === 'video' ? (
                          <div className="relative w-full h-full">
                            <video
                              ref={index === currentIdx ? videoRef : null}
                              src={media.media_url}
                              className="w-full h-full object-cover cursor-pointer"
                              autoPlay={index === currentIdx}
                              playsInline
                              preload="metadata"
                              poster="https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80"
                              onEnded={index === currentIdx ? handleVideoEnd : undefined}
                              onClick={index === currentIdx ? handleVideoClick : undefined}
                            />
                            {/* Optional: show pause/play overlay */}
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
                          <span className="inline-block bg-amber-400/90 text-black px-4 py-2 rounded-full text-sm font-semibold shadow-lg">
                            {media.category}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Dots navigation */}
            <div className="flex justify-center mt-8 space-x-3">
              {sampleMedia.map((_, index) => (
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
                    src={selectedMedia?.media_url}
                    className="w-full h-full object-cover rounded-2xl shadow-lg"
                    controls
                    autoPlay
                  />
                </AspectRatio>
              ) : (
                <AspectRatio ratio={16/9}>
                  <img
                    src={selectedMedia?.media_url}
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
