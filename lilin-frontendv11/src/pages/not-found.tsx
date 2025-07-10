import { useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

export default function NotFound() {
  useEffect(() => {
    document.title = "Halaman Tidak Ditemukan - WeisCandle";
  }, []);

  return (
    <div className="min-h-screen bg-cream flex items-center justify-center">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <Card className="max-w-2xl mx-auto shadow-lg">
          <CardContent className="p-8 md:p-12 text-center">
            {/* 404 Illustration */}
            <div className="mb-8">
              <div className="relative">
                <div className="text-8xl md:text-9xl font-display font-bold text-soft-pink opacity-50">
                  404
                </div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <svg className="w-24 h-24 text-rose-gold animate-float" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Error Message */}
            <div className="mb-8">
              <h1 className="text-3xl md:text-4xl font-display font-bold text-charcoal mb-4">
                Halaman Tidak Ditemukan
              </h1>
              <p className="text-lg text-gray-600 mb-6">
                Maaf, halaman yang Anda cari tidak dapat ditemukan. Mungkin halaman tersebut 
                telah dipindahkan atau alamatnya salah.
              </p>
              <p className="text-gray-500">
                Jangan khawatir, mari kembali ke halaman utama dan temukan workshop aromaterapi terbaik bersama WeisCandle!
              </p>
            </div>

            {/* Navigation Options */}
            <div className="space-y-4 mb-8">
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/">
                  <Button className="bg-rose-gold text-white hover:bg-charcoal transition-all duration-300 px-8 py-3">
                    <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                    </svg>
                    Kembali ke Beranda
                  </Button>
                </Link>
                <Link href="/workshop">
                  <Button 
                    variant="outline" 
                    className="border-charcoal text-charcoal hover:bg-charcoal hover:text-white transition-all duration-300 px-8 py-3"
                  >
                    <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Lihat Workshop
                  </Button>
                </Link>
              </div>
            </div>

            {/* Quick Links */}
            <div className="border-t border-gray-200 pt-8">
              <h3 className="text-lg font-semibold text-charcoal mb-4">
                Atau kunjungi halaman populer kami:
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <Link href="/about">
                  <span className="text-rose-gold hover:text-charcoal transition-colors duration-300 cursor-pointer">
                    Tentang Kami
                  </span>
                </Link>
                <Link href="/blog">
                  <span className="text-rose-gold hover:text-charcoal transition-colors duration-300 cursor-pointer">
                    Blog & Tips
                  </span>
                </Link>
                <Link href="/contact">
                  <span className="text-rose-gold hover:text-charcoal transition-colors duration-300 cursor-pointer">
                    Kontak
                  </span>
                </Link>
                <Link href="/export">
                  <span className="text-rose-gold hover:text-charcoal transition-colors duration-300 cursor-pointer">
                    Export
                  </span>
                </Link>
              </div>
            </div>

            {/* Help Section */}
            <div className="mt-8 p-6 bg-soft-pink bg-opacity-30 rounded-lg">
              <h4 className="font-semibold text-charcoal mb-2">Butuh Bantuan?</h4>
              <p className="text-gray-600 text-sm mb-4">
                Tim customer service kami siap membantu Anda menemukan informasi yang dibutuhkan.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button 
                  size="sm"
                  onClick={() => window.open('https://wa.me/6281234567890?text=Halo%20WeisCandle%2C%20saya%20butuh%20bantuan', '_blank')}
                  className="bg-green-500 text-white hover:bg-green-600"
                >
                  <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.690"/>
                  </svg>
                  Chat WhatsApp
                </Button>
                <Button 
                  size="sm"
                  variant="outline"
                  onClick={() => window.location.href = 'mailto:info@weiscandle.com?subject=Bantuan%20Website'}
                  className="border-charcoal text-charcoal hover:bg-charcoal hover:text-white"
                >
                  <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                  </svg>
                  Email Kami
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
