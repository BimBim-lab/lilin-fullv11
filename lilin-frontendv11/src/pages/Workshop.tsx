import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import SchedulePricing from "@/components/SchedulePricing";
import { ContactInfo } from "@/shared/schema";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

interface WorkshopCurriculum {
  id?: number;
  step: string;
  title: string;
  description: string;
  duration: string;
  order?: number;
}

interface WorkshopProps {
  onPackageSelect?: (packageName: string) => void;
}

export default function Workshop({ 
  onPackageSelect 
}: WorkshopProps) {
  const [curriculum, setCurriculum] = useState<WorkshopCurriculum[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch contact info for WhatsApp integration
  const { data: contactInfo } = useQuery<ContactInfo>({
    queryKey: ['contactInfo'],
    queryFn: async () => {
      const response = await fetch(`${API_BASE_URL}/api/contact-info`);
      if (!response.ok) {
        throw new Error('Failed to fetch contact info');
      }
      return response.json();
    },
  });

  useEffect(() => {
    document.title = "Detail Workshop Lilin Aromaterapi - WeisCandle";
    loadCurriculum();
  }, []);

  const loadCurriculum = async () => {
    try {
      const response = await fetch('/api/workshop/curriculum');
      if (response.ok) {
        const data = await response.json();
        setCurriculum(data);
      }
    } catch (error) {
      console.error('Error loading curriculum:', error);
      // Fallback to default curriculum if API fails
      setCurriculum([
        {
          step: "1",
          title: "Pengenalan Aromaterapi",
          description: "Memahami sejarah aromaterapi, manfaat kesehatan, jenis-jenis essential oil, dan properti terapeutiknya.",
          duration: "45 menit"
        },
        {
          step: "2",
          title: "Pemilihan Bahan & Alat",
          description: "Mengenal berbagai jenis wax (soy, beeswax, coconut), memilih wick yang tepat, dan essential oil berkualitas.",
          duration: "30 menit"
        },
        {
          step: "3",
          title: "Teknik Blending",
          description: "Mempelajari cara mencampur essential oil, menghitung persentase, dan menciptakan signature scent.",
          duration: "60 menit"
        },
        {
          step: "4",
          title: "Proses Pembuatan",
          description: "Praktik langsung melting wax, mixing essential oil, pouring, dan finishing dengan teknik profesional.",
          duration: "90 menit"
        },
        {
          step: "5",
          title: "Quality Control",
          description: "Memahami standar kualitas, troubleshooting masalah umum, dan tips untuk hasil optimal.",
          duration: "30 menit"
        },
        {
          step: "6",
          title: "Packaging & Branding",
          description: "Teknik packaging yang menarik, labeling produk, dan strategi branding untuk penjualan.",
          duration: "45 menit"
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-rose-gold mx-auto mb-4"></div>
            <p>Loading workshop curriculum...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-display font-bold text-charcoal mb-6">
            Workshop Lilin Aromaterapi
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Pelajari seni membuat lilin aromaterapi dengan kurikulum komprehensif, 
            instruktur berpengalaman, dan fasilitas workshop yang lengkap.
          </p>
        </div>

        {/* Curriculum Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20">
          <div>
            <h2 className="text-3xl font-display font-bold text-charcoal mb-8">
              Kurikulum Workshop
            </h2>
            <div className="space-y-6">
              {curriculum.map((item, index) => (
                <div key={item.id || index} className="flex items-start bg-white p-6 rounded-xl shadow-lg hover-scale">
                  <div className="w-12 h-12 bg-rose-gold rounded-full flex items-center justify-center flex-shrink-0 mr-4">
                    <span className="text-white font-bold">{item.step}</span>
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-xl font-semibold text-charcoal">{item.title}</h3>
                      <span className="bg-soft-pink text-charcoal px-3 py-1 rounded-full text-sm">
                        {item.duration}
                      </span>
                    </div>
                    <p className="text-gray-600">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-8">
            {/* Instructor Detail */}
            <div className="bg-white p-8 rounded-2xl shadow-lg">
              <h3 className="text-2xl font-semibold text-charcoal mb-6">Instruktur Utama</h3>
              <div className="text-center">
                <img 
                  src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300" 
                  alt="Wulan Sari - Instruktur WeisCandle" 
                  className="w-32 h-32 rounded-full mx-auto mb-4 object-cover" 
                />
                <h4 className="text-xl font-semibold text-charcoal mb-2">Wulan Sari</h4>
                <p className="text-rose-gold font-medium mb-4">Founder WeisCandle & Certified Aromatherapist</p>
                
                <div className="text-left space-y-3 mb-6">
                  <div className="flex items-center">
                    <svg className="w-5 h-5 text-rose-gold mr-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span>8+ tahun pengalaman aromaterapi</span>
                  </div>
                  <div className="flex items-center">
                    <svg className="w-5 h-5 text-rose-gold mr-3" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                    </svg>
                    <span>500+ peserta yang telah dilatih</span>
                  </div>
                  <div className="flex items-center">
                    <svg className="w-5 h-5 text-rose-gold mr-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span>Sertifikasi internasional IFPA</span>
                  </div>
                  <div className="flex items-center">
                    <svg className="w-5 h-5 text-rose-gold mr-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                    </svg>
                    <span>Author "Panduan Aromaterapi Modern"</span>
                  </div>
                </div>

                <div className="flex flex-wrap justify-center gap-2">
                  <span className="bg-soft-pink text-charcoal px-3 py-1 rounded-full text-sm">Aromatherapist</span>
                  <span className="bg-soft-pink text-charcoal px-3 py-1 rounded-full text-sm">Business Mentor</span>
                  <span className="bg-soft-pink text-charcoal px-3 py-1 rounded-full text-sm">IFPA Certified</span>
                </div>
              </div>
            </div>

            {/* Workshop Facilities */}
            <div className="bg-white p-8 rounded-2xl shadow-lg">
              <h3 className="text-2xl font-semibold text-charcoal mb-6">Fasilitas Workshop</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { icon: "🏢", text: "Studio ber-AC dengan lighting optimal" },
                  { icon: "🧪", text: "Peralatan lengkap dan steril" },
                  { icon: "🍪", text: "Snack dan minuman sehat" },
                  { icon: "📸", text: "Dokumentasi kegiatan gratis" },
                  { icon: "📋", text: "Handout dan worksheet" },
                  { icon: "🎁", text: "Goodie bag eksklusif" },
                  { icon: "🚗", text: "Area parkir luas" },
                  { icon: "📶", text: "WiFi berkecepatan tinggi" }
                ].map((facility, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <span className="text-xl">{facility.icon}</span>
                    <span className="text-gray-600">{facility.text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Workshop Package Information */}
        <div className="mb-16">
          <SchedulePricing 
            title="Pilih Paket Workshop yang Sesuai"
            subtitle="Temukan paket workshop yang cocok dengan kebutuhan dan budget Anda"
            onPackageSelect={onPackageSelect}
          />
        </div>

        {/* CTA Section */}
        <div className="bg-gradient-to-r from-soft-pink to-rose-gold rounded-3xl p-8 md:p-12 text-center">
          <h2 className="text-3xl md:text-4xl font-display font-bold text-charcoal mb-6">
            Siap Memulai Perjalanan Aromaterapi Anda?
          </h2>
          <p className="text-xl text-charcoal mb-8 opacity-90">
            Bergabunglah dengan 500+ peserta yang sudah merasakan manfaat workshop kami
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/contact">
              <Button className="bg-charcoal text-white px-8 py-4 text-lg font-semibold hover:bg-opacity-90 transition-all duration-300 rounded-full"
                onClick={(e) => {
                  e.preventDefault();
                  if (contactInfo?.whatsapp) {
                    const message = `Halo Kak, saya ingin daftar workshop Lilin Aromaterapi. Mohon info selanjutnya ya kak 😊`;
                    const whatsappUrl = `https://wa.me/${contactInfo.whatsapp.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(message)}`;
                    window.open(whatsappUrl, '_blank');
                  } else {
                    alert('Nomor WhatsApp belum tersedia');
                  }
                }}
              >
                Daftar Workshop Sekarang
              </Button>
            </Link>
            <Button 
              variant="outline"
              onClick={() => {
                if (contactInfo?.whatsapp) {
                  const message = `Halo WeisCandle, saya ingin konsultasi tentang workshop`;
                  const whatsappUrl = `https://wa.me/${contactInfo.whatsapp.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(message)}`;
                  window.open(whatsappUrl, '_blank');
                } else {
                  alert('Nomor WhatsApp belum tersedia');
                }
              }}
              className="border-2 border-charcoal text-charcoal px-8 py-4 text-lg font-semibold hover:bg-charcoal hover:text-white transition-all duration-300 rounded-full"
            >
              Konsultasi Gratis
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
