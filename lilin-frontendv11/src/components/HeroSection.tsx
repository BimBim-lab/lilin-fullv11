import { Button } from "@/components/ui/button";
import { Link } from "wouter";

interface HeroSectionProps {
  image: string;
  title1: string;
  title2: string;
  description: string;
  showButtons?: boolean;
  imageAlt?: string;
  showStats?: boolean;
  statsNumber?: string;
  statsLabel?: string;
  onDaftarClick?: () => void;
}

export default function HeroSection({ 
  image, 
  title1, 
  title2,
  description, 
  showButtons = true,
  imageAlt = "Workshop image",
  showStats = true,
  statsNumber = "500+",
  statsLabel = "Peserta Puas",
  onDaftarClick
}: HeroSectionProps) {
  console.log('HeroSection received image URL:', image);
  
  const scrollToContact = () => {
    const contactSection = document.getElementById('contact-section');
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative bg-gradient-to-br from-soft-pink to-rose-gold min-h-screen flex items-center pt-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="text-center lg:text-left animate-fade-in-up">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-charcoal mb-6 leading-tight">
              {title1}{" "}
              <span className="text-rose-gold">{title2}</span>
            </h1>
            <p className="text-xl md:text-2xl text-charcoal mb-8 opacity-90">
              {description}
            </p>
            {showButtons && (
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Button 
                  onClick={onDaftarClick || scrollToContact}
                  className="bg-charcoal text-white px-8 py-6 text-lg font-semibold hover:bg-opacity-90 transform hover:scale-105 transition-all duration-300 shadow-lg rounded-full"
                >
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  Daftar Sekarang
                </Button>
                <Link href="/workshop">
                  <Button 
                    variant="outline" 
                    className="border-2 border-charcoal text-charcoal px-8 py-6 text-lg font-semibold hover:bg-charcoal hover:text-white transition-all duration-300 rounded-full"
                  >
                    <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                    </svg>
                    Pelajari Lebih Lanjut
                  </Button>
                </Link>
              </div>
            )}
          </div>
          <div className="relative animate-fade-in-up">
            <img 
              src={image}
              alt={imageAlt}
              className="rounded-2xl shadow-2xl w-full hover-scale" 
            />
            {showStats && (
              <div className="absolute -bottom-6 -right-6 bg-white p-4 rounded-xl shadow-lg animate-float">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-soft-pink rounded-full flex items-center justify-center">
                    <svg className="w-6 h-6 text-rose-gold" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-semibold text-charcoal">{statsNumber}</p>
                    <p className="text-sm text-gray-600">{statsLabel}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
