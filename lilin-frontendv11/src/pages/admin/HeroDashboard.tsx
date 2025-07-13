import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Edit3, Eye, Save, Upload, Image, Loader2, X } from "lucide-react";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

interface HeroData {
  title1: string;
  title2: string;
  description: string;
  imageAlt: string;
  showButtons: boolean;
  showStats: boolean;
  statsNumber: string;
  statsLabel: string;
  imageUrl?: string;
}

export default function HeroDashboard() {
  const { toast } = useToast();
  const [heroData, setHeroData] = useState<HeroData>({
    title1: "Workshop Lilin Aromaterapi oleh",
    title2: "WeisCandle",
    description: "Pelajari seni membuat lilin aromaterapi yang menenangkan dengan teknik profesional dan bahan berkualitas tinggi.",
    imageAlt: "Aromatherapy candle making workshop setup",
    showButtons: true,
    showStats: true,
    statsNumber: "500+",
    statsLabel: "Peserta Puas",
    imageUrl: ""
  });

  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);

  // Load hero data on component mount
  useEffect(() => {
    loadHeroData();
  }, []);

  const loadHeroData = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/hero`);
      if (response.ok) {
        const data = await response.json();
        setHeroData(data);
      } else {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
    } catch (error) {
      console.error('Error loading hero data:', error);
      toast({
        title: "Error",
        description: "Gagal memuat data hero section",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: keyof HeroData, value: string | boolean) => {
    setHeroData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast({
          title: "Error",
          description: "Hanya file gambar yang diperbolehkan (PNG, JPG, WEBP, dll.)",
          variant: "destructive"
        });
        return;
      }
      
      // Validate file size (10MB limit)
      if (file.size > 10 * 1024 * 1024) {
        toast({
          title: "Error", 
          description: "Ukuran file terlalu besar. Maksimal 10MB.",
          variant: "destructive"
        });
        return;
      }
      
      setSelectedFile(file);
      
      // Create preview URL
      const reader = new FileReader();
      reader.onload = () => {
        setFilePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      
      toast({
        title: "File Selected",
        description: `${file.name} siap untuk diupload. Klik simpan untuk melanjutkan.`,
      });
    }
  };

  const uploadFile = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append('image', file);
    
    setIsUploading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/upload`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('admin_token')}`,
        },
        body: formData
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Upload failed: ${response.status}`);
      }
      
      const data = await response.json();
      return data.url;
    } catch (error) {
      console.error('File upload error:', error);
      throw error;
    } finally {
      setIsUploading(false);
    }
  };

  const saveHeroData = async () => {
    setIsSaving(true);
    try {
      let dataToSave = { ...heroData };

      // If there's a selected file, upload it first
      if (selectedFile) {
        try {
          const uploadedUrl = await uploadFile(selectedFile);
          dataToSave.imageUrl = uploadedUrl;
          toast({
            title: "Success",
            description: "File berhasil diupload!",
          });
        } catch (uploadError) {
          toast({
            title: "Upload Error",
            description: `Gagal mengupload file: ${uploadError instanceof Error ? uploadError.message : 'Unknown error'}`,
            variant: "destructive"
          });
          // Continue with save even if upload fails
        }
      }

      const response = await fetch(`${API_BASE_URL}/api/hero`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('admin_token')}`,
        },
        body: JSON.stringify(dataToSave),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Save failed: ${response.status} ${response.statusText} - ${errorText}`);
      }

      const savedData = await response.json();
      setHeroData(savedData);
      setSelectedFile(null);
      setFilePreview(null);
      
      // Clear file input
      const fileInput = document.getElementById('hero-image-upload') as HTMLInputElement;
      if (fileInput) {
        fileInput.value = '';
      }
      
      toast({
        title: "Success",
        description: "Hero section berhasil disimpan dan akan tampil di homepage!",
      });
    } catch (error) {
      console.error('Error saving hero data:', error);
      toast({
        title: "Error",
        description: `Gagal menyimpan hero section: ${error instanceof Error ? error.message : 'Unknown error'}`,
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handlePreview = () => {
    // Open preview in new tab/window
    window.open('/', '_blank');
  };

  const clearSelectedFile = () => {
    setSelectedFile(null);
    setFilePreview(null);
    const fileInput = document.getElementById('hero-image-upload') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  };
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Hero Section Management</h2>
          <p className="text-sm text-gray-500">Kelola konten hero section di halaman utama</p>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="outline" size="sm" onClick={handlePreview}>
            <Eye className="w-4 h-4 mr-2" />
            Preview
          </Button>
          <Button 
            size="sm" 
            className="bg-rose-gold hover:bg-rose-gold/90"
            onClick={saveHeroData}
            disabled={isSaving}
          >
            {isSaving ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Save className="w-4 h-4 mr-2" />
            )}
            {isSaving ? 'Menyimpan...' : 'Simpan'}
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin" />
          <span className="ml-2">Loading...</span>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Hero Content */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Edit3 className="w-5 h-5 mr-2" />
                  Hero Content
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="title1">Title 1</Label>
                    <Input
                      id="title1"
                      placeholder="Workshop Lilin Aromaterapi oleh"
                      value={heroData.title1}
                      onChange={(e) => handleInputChange('title1', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="title2">Title 2 (Highlighted)</Label>
                    <Input
                      id="title2"
                      placeholder="WeisCandle"
                      value={heroData.title2}
                      onChange={(e) => handleInputChange('title2', e.target.value)}
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Masukkan deskripsi hero section..."
                    value={heroData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    rows={4}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Hero Image */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Image className="w-5 h-5 mr-2" />
                  Hero Image
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Image URL Input */}
                  <div>
                    <Label htmlFor="imageUrl">Image URL</Label>
                    <Input
                      id="imageUrl"
                      placeholder="https://example.com/image.jpg atau gunakan upload file di bawah"
                      value={heroData.imageUrl || ""}
                      onChange={(e) => handleInputChange('imageUrl', e.target.value)}
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Masukkan URL gambar dari internet, atau upload file di bawah
                    </p>
                  </div>

                  {/* File Upload Area */}
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                    {selectedFile && filePreview ? (
                      <div className="space-y-3">
                        <div className="relative inline-block">
                          <img 
                            src={filePreview} 
                            alt="Preview"
                            className="w-32 h-32 object-cover rounded mx-auto"
                          />
                          <Button
                            size="sm"
                            variant="destructive"
                            className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0"
                            onClick={clearSelectedFile}
                          >
                            <X className="w-3 h-3" />
                          </Button>
                        </div>
                        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                          <Image className="w-8 h-8 text-green-600" />
                        </div>
                        <p className="text-sm text-green-600 font-medium">{selectedFile.name}</p>
                        <p className="text-xs text-gray-500">File siap untuk disimpan</p>
                        <p className="text-xs text-blue-600">Klik tombol "Simpan" di atas untuk mengupload dan menyimpan</p>
                      </div>
                    ) : heroData.imageUrl ? (
                      <div className="space-y-2">
                        <img 
                          src={heroData.imageUrl} 
                          alt={heroData.imageAlt}
                          className="w-32 h-32 object-cover rounded mx-auto"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1544947950-fa07a98d237f?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300";
                          }}
                        />
                        <p className="text-xs text-gray-500">Gambar saat ini</p>
                      </div>
                    ) : (
                      <>
                        <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-sm text-gray-600 mb-2">Upload gambar hero atau drag & drop</p>
                        <p className="text-xs text-gray-500">PNG, JPG, WEBP, AVIF hingga 10MB</p>
                      </>
                    )}
                    <div className="mt-4">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileSelect}
                        className="hidden"
                        id="hero-image-upload"
                      />
                      <Button 
                        variant="outline" 
                        onClick={() => document.getElementById('hero-image-upload')?.click()}
                        disabled={isUploading}
                      >
                        {isUploading ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Uploading...
                          </>
                        ) : (
                          <>
                            <Upload className="w-4 h-4 mr-2" />
                            Pilih File
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="imageAlt">Alt Text</Label>
                    <Input
                      id="imageAlt"
                      placeholder="Aromatherapy candle making workshop setup"
                      value={heroData.imageAlt}
                      onChange={(e) => handleInputChange('imageAlt', e.target.value)}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Settings */}
            <Card>
              <CardHeader>
                <CardTitle>Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="showButtons">Show Buttons</Label>
                  <input
                    type="checkbox"
                    id="showButtons"
                    checked={heroData.showButtons}
                    onChange={(e) => handleInputChange('showButtons', e.target.checked)}
                    className="rounded border-gray-300"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="showStats">Show Stats</Label>
                  <input
                    type="checkbox"
                    id="showStats"
                    checked={heroData.showStats}
                    onChange={(e) => handleInputChange('showStats', e.target.checked)}
                    className="rounded border-gray-300"
                  />
                </div>
                <div>
                  <Label htmlFor="statsNumber">Stats Number</Label>
                  <Input
                    id="statsNumber"
                    placeholder="500+"
                    value={heroData.statsNumber}
                    onChange={(e) => handleInputChange('statsNumber', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="statsLabel">Stats Label</Label>
                  <Input
                    id="statsLabel"
                    placeholder="Peserta Puas"
                    value={heroData.statsLabel}
                    onChange={(e) => handleInputChange('statsLabel', e.target.value)}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Status */}
            <Card>
              <CardHeader>
                <CardTitle>Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Status</span>
                    <Badge className="bg-green-100 text-green-800">Published</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Last Modified</span>
                    <span className="text-sm text-gray-500">
                      {new Date().toLocaleString('id-ID')}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Perubahan Tersimpan</span>
                    <span className="text-sm font-medium">
                      {isSaving || isUploading ? (
                        <Loader2 className="w-3 h-3 animate-spin" />
                      ) : !selectedFile ? '✓' : '○'}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}
