import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { Eye, Camera } from "lucide-react";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

interface Gallery {
  id?: number;
  title: string;
  description?: string;
  imageUrl: string;
  isHighlighted?: boolean;
  category?: string;
  order?: number;
  createdAt?: string;
  updatedAt?: string;
}

interface GallerySectionProps {
  title?: string;
  subtitle?: string;
  className?: string;
  showViewAllButton?: boolean;
}

export default function GallerySection({ 
  title = "Gallery Workshop",
  subtitle = "Lihat dokumentasi kegiatan workshop dan hasil karya peserta",
  className = "",
  showViewAllButton = false
}: GallerySectionProps) {
  const [highlightedGallery, setHighlightedGallery] = useState<Gallery[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadHighlightedGallery();
  }, []);

  const loadHighlightedGallery = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/gallery/highlighted`);
      if (response.ok) {
        const data = await response.json();
        setHighlightedGallery(data);
      } else {
        console.error('Failed to load highlighted gallery');
        // Fallback to static data
        const staticGallery: Gallery[] = [
          {
            id: 1,
            title: "Workshop Candle Making",
            description: "Peserta sedang belajar teknik dasar pembuatan lilin aromaterapi",
            imageUrl: "https://images.unsplash.com/photo-1571781926291-c477ebfd024b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
            isHighlighted: true,
            category: "workshop"
          },
          {
            id: 2,
            title: "Essential Oil Blending",
            description: "Proses pencampuran essential oil untuk menciptakan aroma signature",
            imageUrl: "https://images.unsplash.com/photo-1585652757173-57de8b1b744b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
            isHighlighted: true,
            category: "workshop"
          },
          {
            id: 3,
            title: "Finished Products",
            description: "Hasil karya peserta workshop yang siap untuk dibawa pulang",
            imageUrl: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
            isHighlighted: true,
            category: "products"
          }
        ];
        
        setHighlightedGallery(staticGallery);
      }
    } catch (error) {
      console.error('Error loading highlighted gallery:', error);
      // Fallback to static data
      const staticGallery: Gallery[] = [
        {
          id: 1,
          title: "Workshop Candle Making",
          description: "Peserta sedang belajar teknik dasar pembuatan lilin aromaterapi",
          imageUrl: "https://images.unsplash.com/photo-1571781926291-c477ebfd024b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
          isHighlighted: true,
          category: "workshop"
        },
        {
          id: 2,
          title: "Essential Oil Blending",
          description: "Proses pencampuran essential oil untuk menciptakan aroma signature",
          imageUrl: "https://images.unsplash.com/photo-1585652757173-57de8b1b744b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
          isHighlighted: true,
          category: "workshop"
        },
        {
          id: 3,
          title: "Finished Products",
          description: "Hasil karya peserta workshop yang siap untuk dibawa pulang",
          imageUrl: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
          isHighlighted: true,
          category: "products"
        }
      ];
      
      setHighlightedGallery(staticGallery);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <section className={`py-16 bg-gray-50 ${className}`}>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="h-8 bg-gray-200 rounded w-64 mx-auto mb-4 animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded w-96 mx-auto animate-pulse"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-gray-200 h-64 rounded-xl animate-pulse"></div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (highlightedGallery.length === 0) {
    return null;
  }

  return (
    <section className={`py-16 bg-gray-50 ${className}`}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-display font-bold text-charcoal mb-4">
            {title}
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {subtitle}
          </p>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {highlightedGallery.map((item) => (
            <div 
              key={item.id} 
              className="group relative overflow-hidden rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            >
              <div className="aspect-w-16 aspect-h-10">
                <img 
                  src={item.imageUrl} 
                  alt={item.title}
                  className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
                  onError={(e) => {
                    e.currentTarget.src = 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600';
                  }}
                />
              </div>
              
              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
                <div className="p-6 text-white transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                  <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                  {item.description && (
                    <p className="text-white/90 text-sm">{item.description}</p>
                  )}
                </div>
              </div>

              {/* Category Badge */}
              <div className="absolute top-4 left-4 bg-rose-gold text-white px-3 py-1 rounded-full text-sm font-medium capitalize">
                {item.category}
              </div>
            </div>
          ))}
        </div>

        {/* View All Button */}
        {showViewAllButton && (
          <div className="text-center">
            <Link href="/gallery">
              <Button 
                className="bg-rose-gold text-white hover:bg-charcoal transition-all duration-300 px-8 py-3 text-lg font-semibold rounded-full"
              >
                <Eye className="w-5 h-5 mr-2" />
                Lihat Semua Gallery
              </Button>
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
