import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";

export default function Navigation() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [location] = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isActive = (path: string) => {
    if (path === "/" && location === "/") return true;
    if (path !== "/" && location.startsWith(path)) return true;
    return false;
  };

  const navigationItems = [
    { path: "/", label: "Beranda" },
    { path: "/workshop", label: "Workshop" },
    { path: "/about", label: "Tentang Kami" },
    { path: "/blog", label: "Blog" },
    { path: "/contact", label: "Kontak" },
    { path: "/export", label: "Export" },
  ];

  return (
    <nav className={`bg-white sticky top-0 z-50 transition-all duration-300 ${isScrolled ? 'shadow-lg' : 'shadow-sm'}`}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Link href="/">
                <h1 className="text-2xl font-display font-bold text-charcoal hover:text-rose-gold transition-colors duration-300 cursor-pointer">
                  WeisCandle
                </h1>
              </Link>
            </div>
          </div>
          
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              {navigationItems.map((item) => (
                <Link key={item.path} href={item.path}>
                  <span className={`font-medium transition-colors duration-300 cursor-pointer ${
                    isActive(item.path) 
                      ? 'text-rose-gold border-b-2 border-rose-gold pb-1' 
                      : 'text-charcoal hover:text-rose-gold'
                  }`}>
                    {item.label}
                  </span>
                </Link>
              ))}
            </div>
          </div>
          
          <div className="md:hidden">
            <button
              type="button"
              className="text-charcoal hover:text-rose-gold transition-colors duration-300"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isMobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t">
            {navigationItems.map((item) => (
              <Link key={item.path} href={item.path}>
                <span 
                  className={`block px-3 py-2 transition-colors duration-300 cursor-pointer ${
                    isActive(item.path) 
                      ? 'text-rose-gold bg-soft-pink bg-opacity-30 rounded-md' 
                      : 'text-charcoal hover:text-rose-gold'
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.label}
                </span>
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}
