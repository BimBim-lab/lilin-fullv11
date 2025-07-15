import { useState, useEffect } from "react";

export default function TestimonialCarousel() {
  const [currentSlide, setCurrentSlide] = useState(0);

  const testimonials = [
    {
      name: "Nadya Rizky",
      role: "Karyawan Kantoran",
      image: "https://res.cloudinary.com/djyboknz6/image/upload/v1752557051/4_sok9iv.png",
      text: "Setelah kerjaan kantor yang padat, ikut workshop lilin aromaterapi ini bener-bener jadi healing time. Bisa belajar hal baru, bawa pulang hasil sendiri, dan aromanya bikin rileks.",
      rating: 5
    },
    {
      name: "Maya Putri",
      role: "Entrepreneur",
      image: "https://res.cloudinary.com/djyboknz6/image/upload/v1752557052/5_lswbuo.png",
      text: "Saya ikut kelas Ordinary dan Beverage Candle karena ingin menambah produk untuk bisnis hampers saya. Materinya mudah dipahami dan hasilnya langsung bisa saya jual.",
      rating: 5
    },
    {
      name: "Dewi Ananda",
      role: "Mahasiswa",
      image: "https://res.cloudinary.com/djyboknz6/image/upload/v1752557052/7_s1iy0m.png",
      text: "Botanical Candle Holder yang saya buat di workshop ini jadi inspirasi tugas kuliah saya. Teknik yang diajarkan sangat rapi, dan semua bahan disediakan. Recommended banget",
      rating: 5
    },
    {
      name: "Sartika indah pertiwi",
      role: "Ibu rumah tangga",
      image: "https://res.cloudinary.com/djyboknz6/image/upload/v1752557053/6_rcwqem.png",
      text: "Sangat puas dengan workshop ini. Selain membuat lilin yang cantik, saya juga mengetahui jenis lilin dan manfaat aromaterapi bagi tubuh.",
      rating: 5
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % Math.ceil(testimonials.length / 3));
    }, 5000);

    return () => clearInterval(interval);
  }, [testimonials.length]);

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <svg 
        key={i} 
        className={`w-4 h-4 ${i < rating ? 'text-yellow-400' : 'text-gray-300'}`} 
        fill="currentColor" 
        viewBox="0 0 20 20"
      >
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
    ));
  };

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-display font-bold text-charcoal mb-4">
            Testimoni Peserta
          </h2>
          <p className="text-lg text-gray-600">
            Dengarkan pengalaman mereka yang sudah mengikuti workshop kami
          </p>
        </div>
        
        <div className="relative">
          <div className="overflow-hidden">
            <div 
              className="flex transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${currentSlide * 100}%)` }}
            >
              {/* Group testimonials by 3 for each slide */}
              {Array.from({ length: Math.ceil(testimonials.length / 3) }, (_, slideIndex) => (
                <div key={slideIndex} className="w-full flex-shrink-0 px-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {testimonials
                      .slice(slideIndex * 3, slideIndex * 3 + 3)
                      .map((testimonial, index) => (
                        <div key={index} className="bg-soft-pink bg-opacity-30 p-6 rounded-2xl">
                          <div className="flex items-center mb-4">
                            <img 
                              src={testimonial.image} 
                              alt={`${testimonial.name} testimonial`} 
                              className="w-12 h-12 rounded-full mr-4 object-cover" 
                            />
                            <div>
                              <h4 className="font-semibold text-charcoal">{testimonial.name}</h4>
                              <p className="text-sm text-gray-600">{testimonial.role}</p>
                            </div>
                          </div>
                          <p className="text-gray-700 mb-4">"{testimonial.text}"</p>
                          <div className="flex">
                            {renderStars(testimonial.rating)}
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Navigation dots */}
          <div className="flex justify-center mt-8 space-x-2">
            {Array.from({ length: Math.ceil(testimonials.length / 3) }, (_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`w-3 h-3 rounded-full transition-colors duration-300 ${
                  currentSlide === index ? 'bg-rose-gold' : 'bg-gray-300'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
