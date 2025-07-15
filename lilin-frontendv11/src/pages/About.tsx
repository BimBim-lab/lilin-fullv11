import { useEffect } from "react";

export default function About() {
  useEffect(() => {
    document.title = "Tentang WeisCandle - Cerita & Visi Misi Kami";
  }, []);

  return (
    <div className="min-h-screen py-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-display font-bold text-charcoal mb-6">
            Tentang WeisCandle
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Perjalanan kami dalam menciptakan produk aromaterapi berkualitas tinggi dan membantu orang lain menemukan ketenangan melalui seni pembuatan lilin.
          </p>
        </div>

        {/* Story Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-20">
          <div className="animate-fade-in-up">
            <h2 className="text-3xl font-display font-bold text-charcoal mb-6">Cerita Kami</h2>
            <div className="space-y-4 text-gray-600">
              <p>
                WeisCandle.co adalah brand aromaterapi berbasis homemade yang didirikan berdasarkan pengalaman pribadi sang founder, Wenti Hidayah, yang memiliki insomnia dan keresahan selama masa pandemi. 
              </p>
              <p>
               Berawal dari kecintaannya terhadap eksperimen dengan essential oil dan lilin, ia menemukan bahwa lilin aromaterapi memiliki efek menenangkan yang luar biasa. Dari pengalaman ini, WeisCandle.co lahir dengan tujuan menghadirkan kenyamanan dan ketenangan lewat produk-produk lilin aromaterapi buatan tangan yang berkualitas tinggi.
              </p>
              <p>
                Sejak tahun 2020, WeisCandle.co telah berkembang menjadi brand terpercaya di bidang aromaterapi, melayani ribuan pelanggan di seluruh Indonesia. Produk yang kami buat meliputi scented candle, wax sachet, wax melt, bath salt, serta craft items seperti tray dan coaster. Kami menggunakan soy wax yang lebih aman dan ramah lingkungan, serta fragrance oil bersertifikasi IFRA, menjadikan produk kami tidak hanya indah namun juga aman digunakan.
              </p>
              <p>
                WeisCandle.co juga aktif mengadakan workshop lilin aromaterapi, baik untuk pemula maupun calon entrepreneur. Workshop ini tidak hanya menjadi wadah ekspresi kreativitas, tetapi juga sarana relaksasi dari rutinitas harian.
              </p>
              <p>
                Kami percaya bahwa setiap orang bisa menciptakan produk aromaterapi yang personal dan bermakna, serta mendapatkan manfaat seperti:
              </p>
              <ul className="list-disc list-inside space-y-2">
                <li>Menenangkan pikiran</li>
                <li>Mengatasi insomnia</li>
                <li>Mempertahankan konsentrasi</li>
                <li>Menjadi dekorasi yang indah</li>
                <li>Mengharumkan ruangan</li>
              </ul>
            </div>
          </div>
          <div className="animate-fade-in-up">
            <img 
              src="https://res.cloudinary.com/djyboknz6/image/upload/v1752558898/About-Us_km8gpv.webp" 
              alt="WeisCandle workshop products" 
              className="rounded-2xl shadow-lg w-full hover-scale" 
            />
          </div>
        </div>

        {/* Vision & Mission */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
          <div className="bg-soft-pink bg-opacity-30 p-8 rounded-2xl hover-scale">
            <div className="w-16 h-16 bg-rose-gold rounded-full flex items-center justify-center mb-6">
              <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
              </svg>
            </div>
            <h3 className="text-2xl font-semibold text-charcoal mb-4">Visi Kami</h3>
            <p className="text-gray-600">
              Menjadi pusat pembelajaran aromaterapi terdepan di Indonesia yang menghasilkan produk berkualitas tinggi serta menciptakan entrepreneur sukses di bidang lilin aromaterapi yang sesuai standar.
            </p>
          </div>
          <div className="bg-soft-pink bg-opacity-30 p-8 rounded-2xl hover-scale">
            <div className="w-16 h-16 bg-rose-gold rounded-full flex items-center justify-center mb-6">
              <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
              </svg>
            </div>
            <h3 className="text-2xl font-semibold text-charcoal mb-4">Misi Kami</h3>
            <p className="text-gray-600">
              Memberikan edukasi dan pelatihan terbaik dalam pembuatan produk lilin aromaterapi, serta membantu setiap peserta workshop untuk mengembangkan skill dan menambah pengetahuan tentang lilin aromaterapi dan manfaatnya bagi tubuh.
            </p>
          </div>
        </div>

        {/* Team Section */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-display font-bold text-charcoal mb-6">
            Tim Kami
          </h2>
          <p className="text-lg text-gray-600 mb-12">
            Instruktur berpengalaman yang siap membimbing perjalanan aromaterapi Anda
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-8">
            {/* Founder */}
            <div className="bg-white p-6 rounded-2xl shadow-lg hover-scale">
              <img 
                src="https://res.cloudinary.com/djyboknz6/image/upload/v1752557629/2_yfjymz.png" 
                alt="Wenti Hidayah - Founder WeisCandle" 
                className="w-32 h-32 rounded-full mx-auto mb-4 object-cover" 
              />
              <h4 className="text-xl font-semibold text-charcoal mb-2">Wenti Hidayah</h4>
              <p className="text-rose-gold font-medium mb-3">Founder & Head Instructor</p>
              <p className="text-gray-600 text-sm mb-4">
                Aromatherapist dengan pengalaman 5+ tahun. Telah melatih ratusan peserta dalam pembutan llin aromaterapi.
              </p>
              <div className="flex justify-center space-x-2">
                <span className="bg-soft-pink text-charcoal px-2 py-1 rounded text-xs">Aromatherapist</span>
                <span className="bg-soft-pink text-charcoal px-2 py-1 rounded text-xs">Business Mentor</span>
              </div>
            </div>
          </div>
        </div>

        {/* Values */}
        <div className="bg-gradient-to-br from-soft-pink to-rose-gold rounded-3xl p-8 md:p-12">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-display font-bold text-charcoal mb-4">
              Nilai-Nilai Kami
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-rose-gold" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-charcoal mb-2">Kualitas</h3>
              <p className="text-gray-700">
                Komitmen pada kualitas terbaik dalam setiap produk dan pembelajaran yang kami berikan.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-rose-gold" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-charcoal mb-2">Komunitas</h3>
              <p className="text-gray-700">
                Membangun komunitas yang saling mendukung dalam perjalanan aromaterapi dan bisnis.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-rose-gold" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3 6a3 3 0 013-3h10a1 1 0 01.8 1.6L14.25 8l2.55 3.4A1 1 0 0116 13H6a1 1 0 00-1 1v3a1 1 0 11-2 0V6z" clipRule="evenodd" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-charcoal mb-2">Inovasi</h3>
              <p className="text-gray-700">
                Terus berinovasi dalam teknik pembelajaran dan pengembangan produk aromaterapi.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
