import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Filter, Camera, Grid, List } from "lucide-react";
import { type Gallery } from "@/shared/schema";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

export default function GalleryPage() {
  const [gallery, setGallery] = useState<Gallery[]>([]);
  const [filteredGallery, setFilteredGallery] = useState<Gallery[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  useEffect(() => {
    document.title = "Gallery - WeisCandle Workshop";
    loadGallery();
  }, []);

  useEffect(() => {
    filterGallery();
  }, [gallery, searchTerm, selectedCategory]);

  const loadGallery = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/gallery`);
      if (response.ok) {
        const data = await response.json();
        setGallery(data);
      } else {
        console.error('Failed to load gallery');
      }
    } catch (error) {
      console.error('Error loading gallery:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filterGallery = () => {
    let filtered = gallery;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(item =>
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (item.description && item.description.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Filter by category
    if (selectedCategory !== "all") {
      filtered = filtered.filter(item => item.category === selectedCategory);
    }

    setFilteredGallery(filtered);
  };

  const categories = [
    { value: "all", label: "Semua Kategori" },
    { value: "workshop", label: "Workshop" },
    { value: "products", label: "Products" },
    { value: "studio", label: "Studio" },
    { value: "other", label: "Lainnya" }
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <div className="h-12 bg-gray-200 rounded w-64 mx-auto mb-4 animate-pulse"></div>
            <div className="h-6 bg-gray-200 rounded w-96 mx-auto animate-pulse"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-gray-200 h-64 rounded-xl animate-pulse"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-display font-bold text-charcoal mb-6">
            Gallery WeisCandle
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Koleksi foto dari berbagai kegiatan workshop, produk hasil karya peserta, 
            dan suasana studio yang inspiratif
          </p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="flex flex-col md:flex-row gap-4 flex-1">
              {/* Search */}
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  placeholder="Cari foto..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              {/* Category Filter */}
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-full md:w-48">
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.value} value={category.value}>
                      {category.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* View Mode Toggle */}
            <div className="flex items-center space-x-2 bg-gray-100 rounded-lg p-1">
              <Button
                size="sm"
                variant={viewMode === "grid" ? "default" : "ghost"}
                onClick={() => setViewMode("grid")}
                className="h-8 w-8 p-0"
              >
                <Grid className="w-4 h-4" />
              </Button>
              <Button
                size="sm"
                variant={viewMode === "list" ? "default" : "ghost"}
                onClick={() => setViewMode("list")}
                className="h-8 w-8 p-0"
              >
                <List className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-gray-600">
            Menampilkan {filteredGallery.length} dari {gallery.length} foto
          </p>
        </div>

        {/* Gallery Grid */}
        {filteredGallery.length > 0 ? (
          <div className={`gap-6 ${
            viewMode === "grid" 
              ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3" 
              : "flex flex-col space-y-6"
          }`}>
            {filteredGallery.map((item) => (
              <div 
                key={item.id} 
                className={`group relative overflow-hidden bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 ${
                  viewMode === "grid" 
                    ? "transform hover:scale-105" 
                    : "flex flex-col md:flex-row"
                }`}
              >
                {viewMode === "grid" ? (
                  <>
                    {/* Grid View */}
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
                  </>
                ) : (
                  <>
                    {/* List View */}
                    <div className="w-full md:w-64 h-48 md:h-auto">
                      <img 
                        src={item.imageUrl} 
                        alt={item.title}
                        className="w-full h-full object-cover md:rounded-l-xl rounded-t-xl md:rounded-t-none"
                        onError={(e) => {
                          e.currentTarget.src = 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600';
                        }}
                      />
                    </div>
                    <div className="flex-1 p-6">
                      <div className="flex items-start justify-between mb-4">
                        <h3 className="text-xl font-semibold text-charcoal">{item.title}</h3>
                        <span className="bg-rose-gold text-white px-3 py-1 rounded-full text-sm font-medium capitalize">
                          {item.category}
                        </span>
                      </div>
                      {item.description && (
                        <p className="text-gray-600 mb-4">{item.description}</p>
                      )}
                      <div className="text-sm text-gray-500">
                        {item.createdAt && new Date(item.createdAt).toLocaleDateString('id-ID', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </div>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <Camera className="w-16 h-16 mx-auto mb-4 text-gray-400" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">
              Tidak ada foto ditemukan
            </h3>
            <p className="text-gray-500">
              Coba ubah kata kunci pencarian atau kategori filter
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
