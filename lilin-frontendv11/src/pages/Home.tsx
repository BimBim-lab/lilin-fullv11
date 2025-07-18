import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import HeroSection from "@/components/HeroSection";
import WorkshopBenefits from "@/components/WorkshopBenefits";
import SchedulePricing from "@/components/SchedulePricing";
import TestimonialCarousel from "@/components/TestimonialCarousel";
import GallerySection from "@/components/GallerySection";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { type ContactInfo } from "@/shared/schema";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

interface HeroData {
  title1: string;
  title2: string;
  description: string;
  imageUrl?: string;
  imageAlt: string;
  showButtons: boolean;
  showStats: boolean;
  statsNumber: string;
  statsLabel: string;
}

export default function Home() {
  // Fetch hero data with useQuery for automatic cache management
  const { data: heroData, isLoading: heroLoading } = useQuery<HeroData>({
    queryKey: ['heroData'],
    queryFn: async () => {
      const response = await fetch(`${API_BASE_URL}/api/hero`);
      if (!response.ok) {
        throw new Error('Failed to fetch hero data');
      }
      return response.json();
    },
    retry: 1,
    staleTime: 30 * 1000, // 30 seconds - shorter for faster updates
    refetchOnWindowFocus: true, // Refetch when window gets focus
    refetchOnMount: true, // Always refetch on component mount
    refetchInterval: 60 * 1000, // Auto-refetch every minute when page is active
  });

  // Default hero data fallback
  const defaultHeroData: HeroData = {
    title1: "Workshop Lilin Aromaterapi oleh",
    title2: "WeisCandle", 
    description: "Pelajari seni membuat lilin aromaterapi yang menenangkan dengan teknik profesional dan bahan berkualitas tinggi.",
    imageUrl: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=600",
    imageAlt: "Aromatherapy candle making workshop setup",
    showButtons: true,
    showStats: true,
    statsNumber: "500+",
    statsLabel: "Peserta Puas"
  };

  // Use fetched data or fallback to default
  const currentHeroData = heroData || defaultHeroData;

  // Fetch contact info for WhatsApp integration
  const { data: contactInfo } = useQuery<ContactInfo>({
    queryKey: ["/api/contact-info"],
    queryFn: async () => {
      const response = await fetch(`${API_BASE_URL}/api/contact-info`);
      if (!response.ok) {
        throw new Error('Failed to fetch contact info');
      }
      return response.json();
    },
    retry: 1,
    staleTime: 5 * 60 * 1000,
  });

  // Default WhatsApp number if API fails
  const whatsappNumber = contactInfo?.whatsapp || "+62 812-3456-7890";

  const handleWhatsAppRegistration = (message: string = "Halo Kak, saya ingin daftar workshop Lilin Aromaterapi. Mohon info selanjutnya ya kak 😊") => {
    const whatsappUrl = `https://wa.me/${whatsappNumber.replace(/\s/g, '').replace('+', '')}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  useEffect(() => {
    document.title = "WeisCandle - Workshop Lilin Aromaterapi Terbaik di Indonesia";
  }, []);

  return (
    <div className="min-h-screen">
      {heroLoading ? (
        // Loading skeleton for hero section
        <div className="h-96 bg-gray-200 animate-pulse flex items-center justify-center">
          <div className="text-gray-500">Loading...</div>
        </div>
      ) : (
        <HeroSection 
          image={currentHeroData.imageUrl || "https://images.unsplash.com/photo-1544947950-fa07a98d237f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=600"}
          title1={currentHeroData.title1}
          title2={currentHeroData.title2}
          description={currentHeroData.description}
          imageAlt={currentHeroData.imageAlt}
          showButtons={currentHeroData.showButtons}
          showStats={currentHeroData.showStats}
          statsNumber={currentHeroData.statsNumber}
          statsLabel={currentHeroData.statsLabel}
          onDaftarClick={() => handleWhatsAppRegistration()}
        />
      )}
      <WorkshopBenefits />
      <SchedulePricing />
      <TestimonialCarousel />
      
      {/* Gallery Section */}
      <GallerySection />
      
      {/* Workshop Details Preview */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-charcoal mb-4">
              Detail Workshop
            </h2>
            <p className="text-lg text-gray-600">
              Kurikulum lengkap dan instruktur berpengalaman
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <h3 className="text-2xl font-semibold text-charcoal mb-6">Silabus Workshop</h3>
              <div className="space-y-4">
                {[
                  { step: "1", title: "Pengenalan Aromaterapi", desc: "Sejarah, manfaat, dan jenis-jenis essential oil" },
                  { step: "2", title: "Bahan dan Alat", desc: "Pemilihan wax, wick, dan essential oil berkualitas" },
                  { step: "3", title: "Teknik Pembuatan", desc: "Mixing, pouring, dan finishing techniques" },
                  { step: "4", title: "Praktik Langsung", desc: "Membuat lilin aromaterapi dengan guided practice" },
                  { step: "5", title: "Packaging & Branding", desc: "Tips untuk presentasi dan penjualan produk" }
                ].map((item, index) => (
                  <div key={index} className="flex items-start">
                    <div className="w-8 h-8 bg-rose-gold rounded-full flex items-center justify-center flex-shrink-0 mr-4 mt-1">
                      <span className="text-white font-semibold text-sm">{item.step}</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-charcoal">{item.title}</h4>
                      <p className="text-gray-600">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div>
              <h3 className="text-2xl font-semibold text-charcoal mb-6">Instruktur</h3>
              <div className="bg-white p-6 rounded-2xl shadow-lg">
                <img 
                  src="https://res.cloudinary.com/djyboknz6/image/upload/v1752557629/2_yfjymz.png" 
                  alt="Instructor WeisCandle" 
                  className="w-24 h-24 rounded-full mx-auto mb-4 object-cover" 
                />
                <div className="text-center">
                  <h4 className="text-xl font-semibold text-charcoal mb-2">Wenti Hidayah</h4>
                  <p className="text-rose-gold font-medium mb-3">Founder WeisCandle</p>
                  <p className="text-gray-600 mb-4">
                    Berpengalaman 5 tahun di industri aromaterapi dan telah melatih ratusan orang.
                  </p>
                  <div className="flex justify-center space-x-2">
                    <span className="bg-soft-pink text-charcoal px-3 py-1 rounded-full text-sm">
                      Experienced Aromatherapist
                    </span>
                    <span className="bg-soft-pink text-charcoal px-3 py-1 rounded-full text-sm">
                      Business Mentor
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="mt-6">
                <Link href="/workshop">
                  <Button className="w-full bg-rose-gold text-white hover:bg-charcoal transition-all duration-300">
                    Lihat Detail Lengkap
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact-section" className="py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-charcoal mb-4">
              Siap Memulai Journey Aromaterapi Anda?
            </h2>
            <p className="text-lg text-gray-600 mb-8">
              Daftar sekarang dan bergabung dengan ratusan peserta yang sudah merasakan manfaatnya
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                onClick={() => handleWhatsAppRegistration()}
                className="bg-rose-gold text-white px-8 py-4 text-lg font-semibold hover:bg-charcoal transition-all duration-300 rounded-full"
              >
                Daftar Workshop
              </Button>
              <Button 
                variant="outline"
                onClick={() => handleWhatsAppRegistration("Halo WeisCandle, saya ingin konsultasi tentang workshop")}
                className="border-2 border-charcoal text-charcoal px-8 py-4 text-lg font-semibold hover:bg-charcoal hover:text-white transition-all duration-300 rounded-full"
              >
                Konsultasi Gratis
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
