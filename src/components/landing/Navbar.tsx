import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { GraduationCap, Menu, X, Sparkles } from 'lucide-react';

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Features', href: '#features' },
    { name: 'About', href: '#about' },
    { name: 'Testimonials', href: '#testimonials' },
  ];

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
      isScrolled 
        ? 'bg-slate-900/95 backdrop-blur-xl shadow-2xl shadow-blue-500/10' 
        : 'bg-transparent'
    }`}>
      <div className="container mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl blur-md opacity-60 group-hover:opacity-100 transition-opacity" />
              <div className="relative w-11 h-11 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl flex items-center justify-center shadow-lg">
                <GraduationCap className="w-6 h-6 text-slate-900" />
              </div>
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
              CPS Portal
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-10">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="relative text-slate-300 hover:text-white transition-colors text-sm font-medium group"
              >
                {link.name}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-amber-400 to-orange-500 group-hover:w-full transition-all duration-300" />
              </a>
            ))}
          </div>

          {/* CTA Buttons */}
          <div className="hidden md:flex items-center gap-4">
            <Button 
              asChild
              variant="ghost" 
              className="text-slate-300 hover:text-white hover:bg-white/10 rounded-full px-6"
            >
              <Link to="/login">Sign In</Link>
            </Button>
            <Button 
              asChild
              className="relative overflow-hidden bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-500 hover:to-orange-600 text-slate-900 font-semibold rounded-full px-6 shadow-lg shadow-amber-500/25 hover:shadow-amber-500/40 transition-all duration-300"
            >
              <Link to="/signup" className="flex items-center gap-2">
                <Sparkles className="w-4 h-4" />
                Get Started
              </Link>
            </Button>
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden text-white p-2 hover:bg-white/10 rounded-xl transition-colors"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden py-6 border-t border-white/10 animate-fade-in">
            <div className="flex flex-col gap-2">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  className="text-slate-300 hover:text-white hover:bg-white/5 transition-colors font-medium py-3 px-4 rounded-xl"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link.name}
                </a>
              ))}
              <div className="flex flex-col gap-3 pt-4 mt-4 border-t border-white/10">
                <Button 
                  asChild
                  variant="ghost" 
                  className="text-slate-300 hover:text-white hover:bg-white/10 justify-center rounded-full"
                >
                  <Link to="/login">Sign In</Link>
                </Button>
                <Button 
                  asChild
                  className="bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-500 hover:to-orange-600 text-slate-900 font-semibold rounded-full shadow-lg"
                >
                  <Link to="/signup" className="flex items-center justify-center gap-2">
                    <Sparkles className="w-4 h-4" />
                    Get Started
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}