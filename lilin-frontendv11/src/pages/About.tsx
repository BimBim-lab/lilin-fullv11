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
            Perjalanan kami dalam menciptakan produk aromaterapi berkualitas dan memberdayakan masyarakat 
            melalui workshop lilin aromaterapi profesional.
          </p>
        </div>

        {/* Story Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-20">
          <div className="animate-fade-in-up">
            <h2 className="text-3xl font-display font-bold text-charcoal mb-6">Cerita Kami</h2>
            <div className="space-y-4 text-gray-600">
              <p>
                WeisCandle didirikan pada tahun 2016 dengan visi untuk memberikan solusi alami bagi mereka 
                yang mencari ketenangan dan relaksasi dalam kehidupan sehari-hari. Berawal dari hobi pribadi 
                founder kami, Wulan Sari, yang gemar bereksperimen dengan essential oil dan lilin.
              </p>
              <p>
                Apa yang dimulai sebagai kegiatan kreatif di rumah, kini telah berkembang menjadi brand 
                aromaterapi terpercaya yang telah melayani ribuan pelanggan di seluruh Indonesia. Dengan 
                pengalaman lebih dari 8 tahun, kami telah melatih ratusan calon entrepreneur di bidang aromaterapi.
              </p>
              <p>
                Setiap produk kami dibuat dengan cinta dan perhatian terhadap detail, menggunakan bahan-bahan 
                berkualitas tinggi yang aman dan ramah lingkungan. Lokasi workshop kami berada di jantung kota 
                dengan fasilitas lengkap dan nyaman untuk memberikan pengalaman belajar yang optimal.
              </p>
            </div>
          </div>
          <div className="animate-fade-in-up">
            <img 
              src="https://images.unsplash.com/photo-1556761175-5973dc0f32e7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600" 
              alt="WeisCandle workshop studio interior" 
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
              Menjadi pusat pembelajaran aromaterapi terdepan di Indonesia yang menghasilkan produk berkualitas 
              tinggi dan menciptakan entrepreneur sukses di bidang aromaterapi dengan standar internasional.
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
              Memberikan edukasi dan pelatihan terbaik dalam pembuatan produk aromaterapi, serta membantu 
              setiap peserta untuk mengembangkan skill dan bisnis mereka dengan dukungan mentoring berkelanjutan.
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
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Founder */}
            <div className="bg-white p-6 rounded-2xl shadow-lg hover-scale">
              <img 
                src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300" 
                alt="Wulan Sari - Founder WeisCandle" 
                className="w-32 h-32 rounded-full mx-auto mb-4 object-cover" 
              />
              <h4 className="text-xl font-semibold text-charcoal mb-2">Wulan Sari</h4>
              <p className="text-rose-gold font-medium mb-3">Founder & Head Instructor</p>
              <p className="text-gray-600 text-sm mb-4">
                Certified Aromatherapist dengan pengalaman 8+ tahun. Telah melatih 500+ peserta dan membantu 
                puluhan entrepreneur sukses memulai bisnis aromaterapi.
              </p>
              <div className="flex justify-center space-x-2">
                <span className="bg-soft-pink text-charcoal px-2 py-1 rounded text-xs">Aromatherapist</span>
                <span className="bg-soft-pink text-charcoal px-2 py-1 rounded text-xs">Business Mentor</span>
              </div>
            </div>

            {/* Assistant Instructor */}
            <div className="bg-white p-6 rounded-2xl shadow-lg hover-scale">
              <img 
                src="https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300" 
                alt="Sarah Chen - Assistant Instructor" 
                className="w-32 h-32 rounded-full mx-auto mb-4 object-cover" 
              />
              <h4 className="text-xl font-semibold text-charcoal mb-2">Sarah Chen</h4>
              <p className="text-rose-gold font-medium mb-3">Assistant Instructor</p>
              <p className="text-gray-600 text-sm mb-4">
                Spesialis essential oil blending dengan background chemistry. Membantu peserta memahami 
                formulasi dan kombinasi aroma yang sempurna.
              </p>
              <div className="flex justify-center space-x-2">
                <span className="bg-soft-pink text-charcoal px-2 py-1 rounded text-xs">Chemistry</span>
                <span className="bg-soft-pink text-charcoal px-2 py-1 rounded text-xs">Oil Blending</span>
              </div>
            </div>

            {/* Business Consultant */}
            <div className="bg-white p-6 rounded-2xl shadow-lg hover-scale">
              <img 
                src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300" 
                alt="Andi Wijaya - Business Consultant" 
                className="w-32 h-32 rounded-full mx-auto mb-4 object-cover" 
              />
              <h4 className="text-xl font-semibold text-charcoal mb-2">Andi Wijaya</h4>
              <p className="text-rose-gold font-medium mb-3">Business Consultant</p>
              <p className="text-gray-600 text-sm mb-4">
                Expert dalam business development dan marketing strategy. Membantu peserta Workshop Pro 
                mengembangkan rencana bisnis yang menguntungkan.
              </p>
              <div className="flex justify-center space-x-2">
                <span className="bg-soft-pink text-charcoal px-2 py-1 rounded text-xs">Business Dev</span>
                <span className="bg-soft-pink text-charcoal px-2 py-1 rounded text-xs">Marketing</span>
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
