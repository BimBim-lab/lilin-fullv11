import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { type Product, ContactInfo } from "@/shared/schema";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

interface ProductCategory {
  name: string;
  description: string;
  products: string[];
  moq: string;
  price: string;
}

interface ExportProps {
  productCategories?: ProductCategory[];
}

export default function Export({ productCategories }: ExportProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch contact info for WhatsApp, email, and phone integration
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

  // Fetch products from backend
  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/products');
      if (response.ok) {
        const data = await response.json();
        setProducts(data.filter((p: Product) => p.status === 'active')); // Only show active products
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    document.title = "Export & Wholesale - WeisCandle Aromaterapi";
    fetchProducts();

    // Auto-refresh products every 10 seconds to catch changes from admin dashboard
    const interval = setInterval(fetchProducts, 10000);

    // Listen for focus events to refresh when user comes back to tab
    const handleFocus = () => {
      fetchProducts();
    };
    window.addEventListener('focus', handleFocus);

    // Listen for visibility change to refresh when tab becomes visible
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        fetchProducts();
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      clearInterval(interval);
      window.removeEventListener('focus', handleFocus);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  // Static data for most sections (unchanged)
  const staticStats = {
    countries: "15+",
    clients: "500+", 
    products: "50+",
    experience: "8+"
  };

  // Group products by category for display ONLY in "Product Categories for Export" section
  const groupedProducts = products.reduce((acc, product) => {
    if (!acc[product.category]) {
      acc[product.category] = [];
    }
    acc[product.category].push(product);
    return acc;
  }, {} as Record<string, Product[]>);

  // Create dynamic product categories based on actual products from admin dashboard
  const dynamicProductCategories: ProductCategory[] = Object.entries(groupedProducts).map(([category, categoryProducts]) => ({
    name: category,
    description: `Produk ${category.toLowerCase()} berkualitas tinggi dengan standar internasional`,
    products: categoryProducts.map(p => p.name),
    moq: categoryProducts[0]?.moq || "Contact for MOQ",
    price: `${categoryProducts[0]?.price} - ${categoryProducts[categoryProducts.length - 1]?.price}` || "Contact for pricing"
  }));

  // Use provided categories or dynamic ones (this affects ONLY the Product Categories section)
  const displayCategories = productCategories || dynamicProductCategories;

  const exportServices = [
    {
      icon: "🌍",
      title: "International Shipping",
      description: "Pengiriman ke seluruh dunia dengan packaging aman dan dokumentasi lengkap"
    },
    {
      icon: "📋",
      title: "Export Documentation",
      description: "Kami handle semua dokumen export termasuk Certificate of Origin dan quality certificates"
    },
    {
      icon: "🏭",
      title: "OEM/ODM Services",
      description: "Layanan pembuatan produk dengan brand Anda sendiri dan formula custom"
    },
    {
      icon: "💼",
      title: "B2B Support",
      description: "Dedicated account manager untuk kebutuhan bisnis dan partnership jangka panjang"
    }
  ];

  const certifications = [
    "ISO 9001:2015 Quality Management",
    "HALAL Certification",
    "Good Manufacturing Practice (GMP)",
    "BPOM Registration",
    "Organic Certification"
  ];

  return (
    <div className="min-h-screen py-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-display font-bold text-charcoal mb-6">
            Export & Wholesale
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Partner dengan WeisCandle untuk kebutuhan aromaterapi skala besar. Kami menyediakan 
            produk berkualitas tinggi dengan layanan export profesional ke seluruh dunia.
          </p>
        </div>

        {/* Hero Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-20">
          <div>
            <h2 className="text-3xl font-display font-bold text-charcoal mb-6">
              Your Trusted Aromatherapy Export Partner
            </h2>
            <div className="space-y-4 text-gray-600 mb-8">
              <p>
                WeisCandle telah menjadi supplier terpercaya untuk bisnis aromaterapi di berbagai negara. 
                Dengan standar kualitas internasional dan sistem supply chain yang reliable, kami siap 
                mendukung kebutuhan bisnis Anda.
              </p>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-soft-pink bg-opacity-30 rounded-lg">
                  <div className="text-2xl font-bold text-rose-gold">{staticStats.countries}</div>
                  <div className="text-sm text-charcoal">Countries</div>
                </div>
                <div className="text-center p-4 bg-soft-pink bg-opacity-30 rounded-lg">
                  <div className="text-2xl font-bold text-rose-gold">{staticStats.clients}</div>
                  <div className="text-sm text-charcoal">B2B Clients</div>
                </div>
                <div className="text-center p-4 bg-soft-pink bg-opacity-30 rounded-lg">
                  <div className="text-2xl font-bold text-rose-gold">{staticStats.products}</div>
                  <div className="text-sm text-charcoal">Products</div>
                </div>
                <div className="text-center p-4 bg-soft-pink bg-opacity-30 rounded-lg">
                  <div className="text-2xl font-bold text-rose-gold">{staticStats.experience}</div>
                  <div className="text-sm text-charcoal">Years Experience</div>
                </div>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                onClick={() => window.open('https://wa.me/6281234567890?text=Hello%20WeisCandle%2C%20I%20am%20interested%20in%20export%20partnership', '_blank')}
                className="bg-rose-gold text-white hover:bg-charcoal"
              >
                Request Export Catalog
              </Button>
              <Button 
                variant="outline"
                onClick={() => {
                  const contactSection = document.getElementById('contact-form');
                  if (contactSection) {
                    contactSection.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
                className="border-charcoal text-charcoal hover:bg-charcoal hover:text-white"
              >
                Schedule Meeting
              </Button>
            </div>
          </div>
          <div>
            <img 
              src="https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600" 
              alt="WeisCandle export products display" 
              className="rounded-2xl shadow-lg w-full hover-scale" 
            />
          </div>
        </div>

        {/* Product Categories - DYNAMIC DATA FROM ADMIN DASHBOARD */}
        <div className="mb-20">
          <h2 className="text-3xl font-display font-bold text-charcoal text-center mb-12">
            Product Categories for Export
          </h2>
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-gray-500">Loading products...</div>
            </div>
          ) : displayCategories.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {displayCategories.map((category, index) => (
                <Card key={index} className="hover-scale shadow-lg">
                  <CardContent className="p-6">
                    <h3 className="text-xl font-semibold text-charcoal mb-3">{category.name}</h3>
                    <p className="text-gray-600 mb-4">{category.description}</p>
                    
                    <div className="space-y-3 mb-6">
                      <div>
                        <h4 className="font-medium text-charcoal mb-2">Available Products:</h4>
                        <div className="flex flex-wrap gap-2">
                          {category.products.slice(0, 5).map((product, idx) => (
                            <Badge key={idx} variant="secondary" className="bg-soft-pink text-charcoal">
                              {product}
                            </Badge>
                          ))}
                          {category.products.length > 5 && (
                            <Badge variant="secondary" className="bg-gray-100 text-gray-600">
                              +{category.products.length - 5} more
                            </Badge>
                          )}
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 gap-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">MOQ:</span>
                          <span className="font-medium text-charcoal">{category.moq}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Price Range:</span>
                          <span className="font-medium text-charcoal">{category.price}</span>
                        </div>
                      </div>
                    </div>
                    
                    <Button 
                      onClick={() => window.open(`https://wa.me/6281234567890?text=I%20am%20interested%20in%20${category.name.replace(/\s+/g, '%20')}%20for%20export`, '_blank')}
                      className="w-full bg-soft-pink text-charcoal hover:bg-rose-gold hover:text-white"
                    >
                      Inquire Now
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-gray-500 mb-4">No products available for export at the moment.</div>
              <Button 
                onClick={() => {
                  if (contactInfo?.whatsapp) {
                    const message = `Hello WeisCandle, I would like to inquire about available products for export`;
                    const whatsappUrl = `https://wa.me/${contactInfo.whatsapp.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(message)}`;
                    window.open(whatsappUrl, '_blank');
                  } else {
                    alert('WhatsApp contact not available');
                  }
                }}
                className="bg-rose-gold text-white hover:bg-charcoal"
              >
                Contact Us for Product Information
              </Button>
            </div>
          )}
        </div>

        {/* Export Services - STATIC DATA */}
        <div className="mb-20">
          <h2 className="text-3xl font-display font-bold text-charcoal text-center mb-12">
            Our Export Services
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {exportServices.map((service, index) => (
              <div key={index} className="text-center hover-scale">
                <div className="text-4xl mb-4">{service.icon}</div>
                <h3 className="text-lg font-semibold text-charcoal mb-3">{service.title}</h3>
                <p className="text-gray-600 text-sm">{service.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Certifications & Quality - STATIC DATA */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20">
          <div>
            <h2 className="text-3xl font-display font-bold text-charcoal mb-6">
              Quality Certifications
            </h2>
            <p className="text-gray-600 mb-6">
              Semua produk WeisCandle diproduksi dengan standar kualitas internasional dan 
              telah tersertifikasi oleh berbagai badan standar.
            </p>
            <div className="space-y-3">
              {certifications.map((cert, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span className="text-charcoal font-medium">{cert}</span>
                </div>
              ))}
            </div>
          </div>
          <div>
            <img 
              src="https://images.unsplash.com/photo-1559827260-dc66d52bef19?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600" 
              alt="WeisCandle quality control and certification" 
              className="rounded-2xl shadow-lg w-full" 
            />
          </div>
        </div>

        {/* Export Process - STATIC DATA */}
        <div className="mb-20">
          <h2 className="text-3xl font-display font-bold text-charcoal text-center mb-12">
            Export Process
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { step: "1", title: "Inquiry", desc: "Kirim inquiry dengan spesifikasi produk yang dibutuhkan" },
              { step: "2", title: "Quotation", desc: "Kami berikan quotation detail termasuk shipping cost" },
              { step: "3", title: "Sample", desc: "Pengiriman sample untuk quality approval" },
              { step: "4", title: "Production", desc: "Produksi dan pengiriman sesuai timeline yang disepakati" }
            ].map((process, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-rose-gold rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-white font-bold text-lg">{process.step}</span>
                </div>
                <h3 className="text-lg font-semibold text-charcoal mb-2">{process.title}</h3>
                <p className="text-gray-600 text-sm">{process.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Contact Form - STATIC DATA */}
        <div id="contact-form" className="bg-gradient-to-br from-soft-pink to-rose-gold rounded-3xl p-8 md:p-12">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-display font-bold text-charcoal mb-4">
              Ready to Start Export Partnership?
            </h2>
            <p className="text-lg text-charcoal opacity-90">
              Contact our export team for personalized service and competitive pricing
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="text-center">
              <CardContent className="p-6">
                <div className="w-16 h-16 bg-charcoal rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                  </svg>
                </div>
                <h3 className="font-semibold text-charcoal mb-2">Email Export</h3>
                <p className="text-gray-600">{contactInfo?.email || 'export@weiscandle.com'}</p>
                <Button 
                  onClick={() => {
                    const email = contactInfo?.email || 'export@weiscandle.com';
                    window.location.href = `mailto:${email}?subject=Export%20Inquiry`;
                  }}
                  className="mt-4 w-full bg-charcoal text-white hover:bg-opacity-90"
                >
                  Send Email
                </Button>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="p-6">
                <div className="w-16 h-16 bg-charcoal rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.690"/>
                  </svg>
                </div>
                <h3 className="font-semibold text-charcoal mb-2">WhatsApp Export</h3>
                <p className="text-gray-600">{contactInfo?.whatsapp || '+62 812-3456-7890'}</p>
                <Button 
                  onClick={() => {
                    if (contactInfo?.whatsapp) {
                      const message = `Hello WeisCandle, I am interested in export partnership`;
                      const whatsappUrl = `https://wa.me/${contactInfo.whatsapp.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(message)}`;
                      window.open(whatsappUrl, '_blank');
                    } else {
                      alert('WhatsApp contact not available');
                    }
                  }}
                  className="mt-4 w-full bg-green-500 text-white hover:bg-green-600"
                >
                  Chat Now
                </Button>
              </CardContent>
            </Card>
          </div>

          <div className="text-center mt-8">
            <p className="text-charcoal opacity-75">
              Export Department: Monday - Friday, 09:00 - 17:00 (GMT+7) | Response within 24 hours
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
