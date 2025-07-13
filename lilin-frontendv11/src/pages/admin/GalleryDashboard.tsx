import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Plus, Edit, Trash2, Upload, Eye, Star, Calendar } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

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

export default function GalleryDashboard() {
  const [gallery, setGallery] = useState<Gallery[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [editingItem, setEditingItem] = useState<Gallery | null>(null);
  const { toast } = useToast();

  const [formData, setFormData] = useState<Gallery>({
    title: "",
    description: "",
    imageUrl: "",
    isHighlighted: false,
    category: "workshop",
    order: 0
  });

  useEffect(() => {
    loadGallery();
  }, []);

  const loadGallery = async () => {
    try {
      const token = localStorage.getItem('admin_token');
      const response = await fetch(`${API_BASE_URL}/api/gallery`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setGallery(data.sort((a: Gallery, b: Gallery) => (a.order || 0) - (b.order || 0)));
      } else {
        toast({
          title: "Error",
          description: "Gagal memuat data gallery",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error loading gallery:', error);
      toast({
        title: "Error",
        description: "Terjadi kesalahan saat memuat data",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Error",
        description: "File harus berupa gambar",
        variant: "destructive",
      });
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "Error",
        description: "Ukuran file maksimal 5MB",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);
    const formDataUpload = new FormData();
    formDataUpload.append('image', file);

    try {
      const token = localStorage.getItem('admin_token');
      const response = await fetch(`${API_BASE_URL}/api/upload`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formDataUpload
      });

      if (response.ok) {
        const data = await response.json();
        setFormData(prev => ({ ...prev, imageUrl: data.imageUrl }));
        toast({
          title: "Success",
          description: "Gambar berhasil diupload",
        });
      } else {
        throw new Error('Upload failed');
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      toast({
        title: "Error",
        description: "Gagal mengupload gambar",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim() || !formData.imageUrl.trim()) {
      toast({
        title: "Error",
        description: "Judul dan gambar wajib diisi",
        variant: "destructive",
      });
      return;
    }

    try {
      const token = localStorage.getItem('admin_token');
      if (!token) {
        toast({
          title: "Error",
          description: "Anda belum login atau session telah berakhir",
          variant: "destructive",
        });
        return;
      }

      const url = editingItem 
        ? `${API_BASE_URL}/api/gallery/${editingItem.id}`
        : `${API_BASE_URL}/api/gallery`;
      
      const method = editingItem ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        toast({
          title: "Success",
          description: editingItem ? "Gallery berhasil diupdate" : "Gallery berhasil ditambahkan",
        });
        await loadGallery();
        resetForm();
      } else if (response.status === 401) {
        toast({
          title: "Error",
          description: "Session berakhir, silakan login ulang",
          variant: "destructive",
        });
      } else {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to save gallery');
      }
    } catch (error) {
      console.error('Error saving gallery:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Gagal menyimpan data gallery",
        variant: "destructive",
      });
    }
  };

  const handleEdit = (item: Gallery) => {
    setFormData(item);
    setEditingItem(item);
    setIsEditing(true);
  };

  const handleDelete = async (id: number) => {
    try {
      const token = localStorage.getItem('admin_token');
      if (!token) {
        toast({
          title: "Error",
          description: "Anda belum login atau session telah berakhir",
          variant: "destructive",
        });
        return;
      }

      const response = await fetch(`${API_BASE_URL}/api/gallery/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        toast({
          title: "Success",
          description: "Gallery berhasil dihapus",
        });
        await loadGallery();
      } else if (response.status === 401) {
        toast({
          title: "Error",
          description: "Session berakhir, silakan login ulang",
          variant: "destructive",
        });
      } else {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to delete gallery');
      }
    } catch (error) {
      console.error('Error deleting gallery:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Gagal menghapus gallery",
        variant: "destructive",
      });
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      imageUrl: "",
      isHighlighted: false,
      category: "workshop",
      order: 0
    });
    setEditingItem(null);
    setIsEditing(false);
  };

  const categories = [
    { value: "workshop", label: "Workshop" },
    { value: "products", label: "Products" },
    { value: "studio", label: "Studio" },
    { value: "other", label: "Lainnya" }
  ];

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="h-8 bg-gray-200 rounded w-64 animate-pulse"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="bg-gray-200 h-64 rounded-xl animate-pulse"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gallery Management</h1>
          <p className="text-gray-600 mt-2">Kelola foto gallery untuk ditampilkan di website</p>
        </div>
        <Button 
          onClick={() => setIsEditing(true)}
          className="bg-rose-gold hover:bg-rose-gold/90"
        >
          <Plus className="w-4 h-4 mr-2" />
          Tambah Gallery
        </Button>
      </div>

      {/* Add/Edit Form */}
      {isEditing && (
        <Card>
          <CardHeader>
            <CardTitle>{editingItem ? 'Edit Gallery' : 'Tambah Gallery Baru'}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Judul *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="Masukkan judul gallery"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category">Kategori</Label>
                  <Select 
                    value={formData.category} 
                    onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}
                  >
                    <SelectTrigger>
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
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Deskripsi</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Masukkan deskripsi gallery (opsional)"
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="order">Urutan</Label>
                  <Input
                    id="order"
                    type="number"
                    value={formData.order}
                    onChange={(e) => setFormData(prev => ({ ...prev, order: parseInt(e.target.value) || 0 }))}
                    placeholder="0"
                    min="0"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Tampilkan di Highlight</Label>
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={formData.isHighlighted}
                      onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isHighlighted: checked }))}
                    />
                    <span className="text-sm text-gray-600">
                      {formData.isHighlighted ? 'Ya' : 'Tidak'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="image-upload">Upload Gambar *</Label>
                <div className="flex items-center space-x-4">
                  <Input
                    id="image-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    disabled={isUploading}
                    className="flex-1"
                  />
                  {isUploading && (
                    <div className="flex items-center text-sm text-gray-600">
                      <Upload className="w-4 h-4 mr-1 animate-spin" />
                      Uploading...
                    </div>
                  )}
                </div>
                {formData.imageUrl && (
                  <div className="mt-2">
                    <img 
                      src={formData.imageUrl} 
                      alt="Preview" 
                      className="w-32 h-24 object-cover rounded-lg border"
                    />
                  </div>
                )}
              </div>

              <div className="flex justify-end space-x-4">
                <Button type="button" variant="outline" onClick={resetForm}>
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  className="bg-rose-gold hover:bg-rose-gold/90"
                  disabled={isUploading}
                >
                  {editingItem ? 'Update' : 'Simpan'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Gallery Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {gallery.map((item) => (
          <Card key={item.id} className="overflow-hidden">
            <div className="relative aspect-w-16 aspect-h-10">
              <img 
                src={item.imageUrl} 
                alt={item.title}
                className="w-full h-48 object-cover"
                onError={(e) => {
                  e.currentTarget.src = 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600';
                }}
              />
              <div className="absolute top-2 left-2 flex space-x-2">
                {item.isHighlighted && (
                  <Badge className="bg-yellow-500 text-white">
                    <Star className="w-3 h-3 mr-1" />
                    Highlight
                  </Badge>
                )}
                <Badge variant="secondary" className="capitalize">
                  {item.category}
                </Badge>
              </div>
            </div>
            
            <CardContent className="p-4">
              <h3 className="font-semibold text-lg mb-2 line-clamp-2">{item.title}</h3>
              {item.description && (
                <p className="text-gray-600 text-sm mb-3 line-clamp-2">{item.description}</p>
              )}
              
              <div className="flex items-center text-xs text-gray-500 mb-4">
                <Calendar className="w-3 h-3 mr-1" />
                {item.createdAt && new Date(item.createdAt).toLocaleDateString('id-ID')}
                <span className="mx-2">•</span>
                Urutan: {item.order || 0}
              </div>

              <div className="flex justify-between">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleEdit(item)}
                >
                  <Edit className="w-4 h-4 mr-1" />
                  Edit
                </Button>
                
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive" size="sm">
                      <Trash2 className="w-4 h-4 mr-1" />
                      Delete
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Hapus Gallery</AlertDialogTitle>
                      <AlertDialogDescription>
                        Apakah Anda yakin ingin menghapus "{item.title}"? 
                        Tindakan ini tidak dapat dibatalkan.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction 
                        onClick={() => item.id && handleDelete(item.id)}
                        className="bg-red-600 hover:bg-red-700"
                      >
                        Hapus
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {gallery.length === 0 && (
        <div className="text-center py-12">
          <Eye className="w-12 h-12 mx-auto mb-4 text-gray-400" />
          <h3 className="text-lg font-semibold text-gray-600 mb-2">
            Belum ada gallery
          </h3>
          <p className="text-gray-500 mb-4">
            Mulai dengan menambahkan gallery pertama
          </p>
          <Button 
            onClick={() => setIsEditing(true)}
            className="bg-rose-gold hover:bg-rose-gold/90"
          >
            <Plus className="w-4 h-4 mr-2" />
            Tambah Gallery
          </Button>
        </div>
      )}
    </div>
  );
}
