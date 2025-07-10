import { Button } from "@/components/ui/button";

interface WorkshopPackage {
  name: string;
  description: string;
  price: string;
  duration: string;
  features: string[];
  isPopular: boolean;
}

interface SchedulePricingProps {
  title?: string;
  subtitle?: string;
  packages?: WorkshopPackage[];
  onPackageSelect?: (packageName: string) => void;
}

const defaultPackages: WorkshopPackage[] = [
  {
    name: "Workshop Basic",
    description: "Untuk pemula yang ingin belajar dasar",
    price: "Rp 350.000",
    duration: "Durasi 3 jam",
    features: [
      "Membuat 2 lilin aromaterapi",
      "Materi & tools disediakan",
      "Sertifikat keikutsertaan"
    ],
    isPopular: false
  },
  {
    name: "Workshop Premium",
    description: "Untuk yang ingin belajar lebih mendalam",
    price: "Rp 550.000",
    duration: "Durasi 5 jam",
    features: [
      "Membuat 4 lilin aromaterapi",
      "Teknik advanced blending",
      "Starter kit take home",
      "Konsultasi 1 bulan"
    ],
    isPopular: true
  },
  {
    name: "Workshop Pro",
    description: "Untuk calon entrepreneur",
    price: "Rp 750.000",
    duration: "Durasi 8 jam (2 hari)",
    features: [
      "Membuat 6 lilin aromaterapi",
      "Business planning session",
      "Complete starter kit",
      "Mentoring 3 bulan"
    ],
    isPopular: false
  }
];

export default function SchedulePricing({ 
  title = "Jadwal & Harga Workshop",
  subtitle = "Pilih waktu yang sesuai dengan jadwal Anda",
  packages = defaultPackages,
  onPackageSelect
}: SchedulePricingProps) {
  const defaultSelectPackage = (packageName: string) => {
    alert(`Anda memilih paket ${packageName}. Silakan lanjutkan ke halaman kontak untuk mendaftar.`);
    const contactSection = document.getElementById('contact-section');
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const selectPackage = onPackageSelect || defaultSelectPackage;

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-display font-bold text-charcoal mb-4">
            {title}
          </h2>
          <p className="text-lg text-gray-600">
            {subtitle}
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {packages.map((pkg, index) => (
            <div 
              key={index}
              className={`bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 relative ${
                pkg.isPopular ? 'border-2 border-rose-gold' : ''
              }`}
            >
              {pkg.isPopular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-rose-gold text-white px-4 py-1 rounded-full text-sm font-semibold">
                  Paling Populer
                </div>
              )}
              
              <div className="text-center mb-6">
                <h3 className="text-2xl font-semibold text-charcoal mb-2">{pkg.name}</h3>
                <p className="text-gray-600 mb-4">{pkg.description}</p>
                <div className="text-3xl font-bold text-rose-gold mb-2">{pkg.price}</div>
                <p className="text-sm text-gray-500">per orang</p>
              </div>
              
              <ul className="space-y-3 mb-6">
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span>{pkg.duration}</span>
                </li>
                {pkg.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-center">
                    <svg className="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              
              <Button 
                onClick={() => selectPackage(pkg.name)}
                className={`w-full py-3 font-semibold transition-all duration-300 rounded-full ${
                  pkg.isPopular 
                    ? 'bg-rose-gold text-white hover:bg-charcoal' 
                    : 'bg-soft-pink text-charcoal hover:bg-rose-gold hover:text-white'
                }`}
              >
                Pilih Package
              </Button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
