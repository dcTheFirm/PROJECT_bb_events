
import React, { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { Button } from "@/components/ui/button";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <header 
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        isScrolled ? 'py-3 glass-effect shadow-lg' : 'py-6 bg-transparent'
      }`}
    >
      <div className="container mx-auto px-4 flex justify-between items-center">
        <div className="flex items-center">
          <a href="#home" className="text-white text-2xl md:text-3xl font-bold font-['Playfair_Display']">
            <span className="text-cocktail-gold">Mixology</span> Masters
          </a>
        </div>
        
        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          {['Home', 'About', 'Team', 'Services', 'Gallery', 'Reviews'].map((item) => (
            <a 
              key={item} 
              href={`#${item.toLowerCase()}`}
              className="text-white text-sm uppercase tracking-wider hover:text-cocktail-gold transition-colors font-medium relative after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-0 after:bg-cocktail-gold after:transition-all hover:after:w-full"
            >
              {item}
            </a>
          ))}
          <Button 
            className="bg-gradient-to-r from-blue-500 to-pink-500 hover:from-blue-600 hover:to-pink-600 text-white font-medium"
            onClick={() => document.getElementById('booking')?.scrollIntoView({behavior: 'smooth'})}
          >
            Book Now
          </Button>
        </nav>

        {/* Mobile Menu Button */}
        <button 
          className="md:hidden text-white p-2"
          onClick={toggleMobileMenu}
          aria-label="Toggle mobile menu"
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>
      
      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full glass-effect border-t border-white/10 shadow-lg animate-fade-in-up">
          <div className="container mx-auto py-4 px-4 flex flex-col space-y-4">
            {['Home', 'About', 'Team', 'Services', 'Gallery', 'Reviews'].map((item) => (
              <a 
                key={item} 
                href={`#${item.toLowerCase()}`}
                className="text-white py-2 hover:text-cocktail-gold transition-colors text-center"
                onClick={toggleMobileMenu}
              >
                {item}
              </a>
            ))}
            <Button 
              className="bg-gradient-to-r from-blue-500 to-pink-500 hover:from-blue-600 hover:to-pink-600 text-white w-full"
              onClick={() => {
                document.getElementById('booking')?.scrollIntoView({behavior: 'smooth'});
                toggleMobileMenu();
              }}
            >
              Book Now
            </Button>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
