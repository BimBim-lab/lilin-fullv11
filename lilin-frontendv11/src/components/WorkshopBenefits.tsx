export default function WorkshopBenefits() {
  const benefits = [
    {
      icon: (
        <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
          <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      title: "Teknik Profesional",
      description: "Pelajari teknik pembuatan lilin aromaterapi yang digunakan oleh para profesional dengan standar internasional."
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
        </svg>
      ),
      title: "Bahan Berkualitas",
      description: "Menggunakan essential oil premium dan lilin berkualitas tinggi untuk hasil yang terbaik dan aman."
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
        </svg>
      ),
      title: "Manfaat Kesehatan",
      description: "Ciptakan produk aromaterapi yang membantu relaksasi, mengurangi stres, dan meningkatkan mood."
    }
  ];

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-display font-bold text-charcoal mb-4">
            Apa itu Workshop Lilin Aromaterapi?
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Kelas praktis yang mengajarkan teknik membuat lilin aromaterapi berkualitas tinggi untuk relaksasi dan kesehatan mental.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {benefits.map((benefit, index) => (
            <div 
              key={index}
              className="text-center p-6 bg-soft-pink bg-opacity-30 rounded-2xl hover:transform hover:scale-105 transition-all duration-300 hover-scale"
            >
              <div className="w-16 h-16 bg-rose-gold rounded-full flex items-center justify-center mx-auto mb-4 text-white">
                {benefit.icon}
              </div>
              <h3 className="text-xl font-semibold text-charcoal mb-3">{benefit.title}</h3>
              <p className="text-gray-600">{benefit.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
