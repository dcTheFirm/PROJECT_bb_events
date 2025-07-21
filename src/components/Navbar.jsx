import React, { useState, useEffect } from 'react';
import { Menu, X, Phone } from 'lucide-react';
import { Button } from "@/components/ui/button";

function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [showContact, setShowContact] = useState(false);

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

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const handleContactClick = () => {
    setShowContact(true);
    const contactSection = document.getElementById('contact');
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: 'smooth' });
      contactSection.classList.add('ring-4', 'ring-[#4a90e2]/80');
      setTimeout(() => {
        contactSection.classList.remove('ring-4', 'ring-[#4a90e2]/80');
      }, 1200);
    }
  };

  return <header className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${isScrolled ? 'py-3 glass-effect shadow-lg' : 'py-6 bg-transparent'}`}>
      <div className="container mx-auto px-4 flex justify-between items-center">
        <div className="flex items-center">



          <h1 className="text-2xl md:text-3xl font-extrabold font-['Playfair_Display'] text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-300 to-gray-500 tracking-tight drop-shadow-lg">
            <span className="bg-gradient-to-r from-white to-gray-300 text-transparent bg-clip-text font-extrabold">
              Bartend
            </span>
            <span className="bg-gradient-to-r from-gray-300 via-gray-400 to-gray-600 text-transparent bg-clip-text font-bold">
              er Brothers
            </span>
          </h1>
        </div>
        
        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          {['Home', 'About', 'Team', 'Services', 'Gallery', 'Reviews'].map(item => <a key={item} href={`#${item.toLowerCase()}`} className="nav-link text-white text-sm uppercase tracking-wider hover:text-[#4a90e2] transition-colors font-medium">
              {item}
            </a>)}
          <Button className="bg-gradient-to-r from-[#4a90e2] to-[#4a90e2]/80 text-white font-medium" onClick={() => document.getElementById('booking')?.scrollIntoView({
          behavior: 'smooth'
        })}>
            Book Now
          </Button>
          <button
            className="ml-2 p-2 rounded-full bg-[#4a90e2]/80 hover:bg-[#4a90e2] transition-colors text-white flex items-center justify-center"
            aria-label="Show contact info"
            onClick={handleContactClick}
            type="button"
          >
            <Phone size={20} />
          </button>
        </nav>

        {/* Mobile Menu Button */}
        <button className="md:hidden text-white p-2" onClick={toggleMenu} aria-label="Toggle mobile menu">
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>
      
      {/* Mobile Menu */}
      {menuOpen && <div className="mob-menu md:hidden fixed inset-0 z-40 flex flex-col justify-start items-center backdrop-blur-md bg-black/70 animate-fade-in-up">
          <div className="w-full max-w-md mx-auto mt-4 bg-black/90 rounded-xl shadow-lg p-6 border border-white/10">
            <div className="flex justify-end mb-4">
              <button onClick={toggleMenu} aria-label="Close mobile menu" className="text-white"><X size={28} /></button>
            </div>
            <div className="flex flex-col space-y-4">
              {['Home', 'About', 'Team', 'Services', 'Gallery', 'Reviews'].map(item => <a key={item} href={`#${item.toLowerCase()}`} className="text-white py-2 hover:text-[#4a90e2] transition-colors text-center text-lg font-medium" onClick={toggleMenu}>
                  {item}
                </a>)}
              <Button className="bg-gradient-to-r from-[#4a90e2] to-[#4a90e2]/80 text-white w-full mt-2" onClick={() => {
                document.getElementById('booking')?.scrollIntoView({
                  behavior: 'smooth'
                });
                toggleMenu();
              }}>
                Book Now
              </Button>
              <button
                className="mt-2 p-2 rounded-full bg-[#4a90e2]/80 hover:bg-[#4a90e2] transition-colors text-white flex items-center justify-center w-full"
                aria-label="Show contact info"
                onClick={() => {
                  handleContactClick();
                  toggleMenu();
                }}
                type="button"
              >
                <Phone size={20} />
              </button>
            </div>
          </div>
        </div>}
    </header>;
}


export default Navbar;
