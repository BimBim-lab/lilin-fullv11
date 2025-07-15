import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Plus, Edit3, Trash2, FileText, Eye, Calendar, Save, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { type BlogPost, type InsertBlogPost } from "@/shared/schema";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

export default function BlogDashboard() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [articles, setArticles] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [editingArticle, setEditingArticle] = useState<BlogPost | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newArticle, setNewArticle] = useState<InsertBlogPost>({
    title: "",
    slug: "",
    excerpt: "",
    content: "",
    imageUrl: "",
    featured: false
  });

  // Blog image upload state
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string>("");

  // Load articles on component mount
  useEffect(() => {
    loadArticles();
  }, []);

  const loadArticles = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/blog`);
      if (response.ok) {
        const data = await response.json();
        setArticles(data);
      } else {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
    } catch (error) {
      console.error('Error loading articles:', error);
      toast({
        title: "Error",
        description: "Gagal memuat data artikel",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9 -]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  };

  const handleAddArticle = () => {
    setEditingArticle(null);
    setNewArticle({
      title: "",
      slug: "",
      excerpt: "",
      content: "",
      imageUrl: "",
      featured: false
    });
    setIsDialogOpen(true);
  };

  const handleEditArticle = (article: BlogPost) => {
    setEditingArticle(article);
    setNewArticle({
      title: article.title,
      slug: article.slug,
      excerpt: article.excerpt,
      content: article.content,
      imageUrl: article.imageUrl,
      featured: article.featured
    });
    
    // Clear file upload state when editing existing article
    setSelectedFile(null);
    setPreviewUrl("");
    
    setIsDialogOpen(true);
  };

  const handleSaveArticle = async () => {
    try {
      // Validation
      if (!newArticle.title.trim()) {
        toast({
          title: "Error",
          description: "Judul artikel harus diisi",
          variant: "destructive"
        });
        return;
      }

      if (!newArticle.excerpt.trim()) {
        toast({
          title: "Error", 
          description: "Excerpt artikel harus diisi",
          variant: "destructive"
        });
        return;
      }

      if (!newArticle.content.trim()) {
        toast({
          title: "Error",
          description: "Konten artikel harus diisi", 
          variant: "destructive"
        });
        return;
      }

      setIsSaving(true);

      // Auto-generate slug if empty
      if (!newArticle.slug && newArticle.title) {
        newArticle.slug = generateSlug(newArticle.title);
      }

      // Handle image upload if file is selected
      let finalImageUrl = newArticle.imageUrl;
      if (selectedFile) {
        const uploadedUrl = await uploadFile();
        if (uploadedUrl) {
          finalImageUrl = uploadedUrl;
        } else {
          // Upload failed, don't proceed
          setIsSaving(false);
          return;
        }
      }

      // Prepare article data with uploaded image URL
      const articleData = {
        ...newArticle,
        imageUrl: finalImageUrl
      };

      let response;
      if (editingArticle) {
        // Update existing article
        response = await fetch(`${API_BASE_URL}/api/blog/${editingArticle.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('admin_token')}`,
          },
          body: JSON.stringify(articleData),
        });
      } else {
        // Create new article
        response = await fetch(`${API_BASE_URL}/api/blog`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('admin_token')}`,
          },
          body: JSON.stringify(articleData),
        });
      }

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Save failed: ${response.status} ${response.statusText} - ${errorText}`);
      }

      const savedArticle = await response.json();
      
      if (editingArticle) {
        setArticles(articles.map(a => a.id === editingArticle.id ? savedArticle : a));
      } else {
        setArticles([savedArticle, ...articles]);
      }

      // Invalidate React Query cache to update all components
      queryClient.invalidateQueries({ queryKey: ["/api/blog"] });
      queryClient.invalidateQueries({ queryKey: [`/api/blog/${savedArticle.slug}`] });

      setIsDialogOpen(false);
      
      // Reset form and file upload state
      setNewArticle({
        title: "",
        slug: "",
        excerpt: "",
        content: "",
        imageUrl: "",
        featured: false
      });
      setEditingArticle(null);
      setSelectedFile(null);
      setPreviewUrl("");
      
      toast({
        title: "Success",
        description: editingArticle ? "Artikel berhasil diupdate" : "Artikel berhasil ditambahkan",
      });
    } catch (error) {
      console.error('Error saving article:', error);
      toast({
        title: "Error",
        description: `Gagal menyimpan artikel: ${error instanceof Error ? error.message : 'Unknown error'}`,
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteArticle = async (articleId: number) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/blog/${articleId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('admin_token')}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Delete failed: ${response.status} ${response.statusText}`);
      }

      setArticles(articles.filter(a => a.id !== articleId));
      
      // Invalidate React Query cache to update all components
      queryClient.invalidateQueries({ queryKey: ["/api/blog"] });
      
      toast({
        title: "Success",
        description: "Artikel berhasil dihapus",
      });
    } catch (error) {
      console.error('Error deleting article:', error);
      toast({
        title: "Error",
        description: `Gagal menghapus artikel: ${error instanceof Error ? error.message : 'Unknown error'}`,
        variant: "destructive"
      });
    }
  };

  // Blog image upload functions
  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast({
          title: "Error",
          description: "File harus berupa gambar",
          variant: "destructive"
        });
        return;
      }

      // Validate file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "Error",
          description: "Ukuran file maksimal 5MB",
          variant: "destructive"
        });
        return;
      }

      setSelectedFile(file);
      
      // Create preview URL
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewUrl(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadFile = async (): Promise<string | null> => {
    if (!selectedFile) return null;

    setUploadingImage(true);
    try {
      const formData = new FormData();
      formData.append('image', selectedFile);

      const response = await fetch(`${API_BASE_URL}/api/upload`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('admin_token')}`,
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Upload failed: ${response.status}`);
      }

      const data = await response.json();
      return data.url;
    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: "Error",
        description: `Gagal mengupload gambar: ${error instanceof Error ? error.message : 'Unknown error'}`,
        variant: "destructive"
      });
      return null;
    } finally {
      setUploadingImage(false);
    }
  };

  const clearSelectedFile = () => {
    setSelectedFile(null);
    setPreviewUrl("");
    setNewArticle({...newArticle, imageUrl: ""});
  };

  const handlePreview = (slug: string) => {
    window.open(`/blog/${slug}`, '_blank');
  };

  const getStatusColor = (article: BlogPost) => {
    // Check if article is published (has publishedAt and featured status)
    if (article.publishedAt) {
      return "bg-green-100 text-green-800";
    }
    return "bg-yellow-100 text-yellow-800";
  };

  const getStatusText = (article: BlogPost) => {
    if (article.publishedAt) {
      return "Published";
    }
    return "Draft";
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  // Calculate stats from actual data
  const totalArticles = articles.length;
  const publishedArticles = articles.filter(a => a.publishedAt).length;
  const draftArticles = totalArticles - publishedArticles;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Blog Management</h2>
          <p className="text-sm text-gray-500">Kelola artikel blog dan konten edukasi</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={handleAddArticle} className="bg-rose-gold hover:bg-rose-gold/90">
              <Plus className="w-4 h-4 mr-2" />
              Tulis Artikel Baru
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingArticle ? 'Edit Artikel' : 'Tulis Artikel Baru'}</DialogTitle>
              <p className="text-sm text-gray-500">* = Field wajib diisi</p>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="title">Judul Artikel *</Label>
                <Input
                  id="title"
                  value={newArticle.title}
                  onChange={(e) => {
                    const title = e.target.value;
                    setNewArticle({
                      ...newArticle, 
                      title,
                      slug: generateSlug(title)
                    });
                  }}
                  placeholder="Masukkan judul artikel"
                  required
                />
              </div>
              <div>
                <Label htmlFor="slug">Slug URL</Label>
                <Input
                  id="slug"
                  value={newArticle.slug}
                  onChange={(e) => setNewArticle({...newArticle, slug: e.target.value})}
                  placeholder="url-artikel-ini"
                />
              </div>
              <div>
                <Label htmlFor="excerpt">Excerpt *</Label>
                <Textarea
                  id="excerpt"
                  value={newArticle.excerpt}
                  onChange={(e) => setNewArticle({...newArticle, excerpt: e.target.value})}
                  placeholder="Ringkasan artikel yang menarik..."
                  rows={3}
                  required
                />
              </div>
              <div>
                <Label htmlFor="imageFile">Gambar Artikel</Label>
                <div className="space-y-2">
                  <Input
                    id="imageFile"
                    type="file"
                    accept="image/*"
                    onChange={handleFileSelect}
                    className="file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-gray-50 file:text-gray-700 hover:file:bg-gray-100"
                  />
                  {selectedFile && (
                    <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                      <span className="text-sm text-gray-600">{selectedFile.name}</span>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={clearSelectedFile}
                      >
                        Hapus
                      </Button>
                    </div>
                  )}
                  {(previewUrl || newArticle.imageUrl) && (
                    <div className="mt-2">
                      <img 
                        src={previewUrl || newArticle.imageUrl} 
                        alt="Preview" 
                        className="w-32 h-24 object-cover rounded border"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = 'none';
                        }}
                      />
                    </div>
                  )}
                </div>
              </div>
              <div>
                <Label htmlFor="content">Konten Artikel *</Label>
                <Textarea
                  id="content"
                  value={newArticle.content}
                  onChange={(e) => setNewArticle({...newArticle, content: e.target.value})}
                  placeholder="Tulis konten artikel dalam HTML..."
                  rows={10}
                  required
                />
                <div className="text-xs text-gray-500 mt-1">
                  {newArticle.content.length} karakter
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="featured"
                  checked={newArticle.featured}
                  onCheckedChange={(checked) => setNewArticle({...newArticle, featured: checked})}
                />
                <Label htmlFor="featured">Artikel Pilihan</Label>
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Batal
                </Button>
                <Button onClick={handleSaveArticle} disabled={isSaving || uploadingImage}>
                  {(isSaving || uploadingImage) ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      {uploadingImage ? 'Mengupload...' : 'Menyimpan...'}
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      {editingArticle ? 'Update' : 'Publish'}
                    </>
                  )}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Artikel</p>
                <p className="text-2xl font-bold text-gray-900">{totalArticles}</p>
              </div>
              <FileText className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Published</p>
                <p className="text-2xl font-bold text-gray-900">{publishedArticles}</p>
              </div>
              <div className="text-green-500">
                <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Draft</p>
                <p className="text-2xl font-bold text-gray-900">{draftArticles}</p>
              </div>
              <div className="text-yellow-500">
                <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Articles List */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin" />
          <span className="ml-2">Loading...</span>
        </div>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Daftar Artikel ({articles.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {articles.map((article) => (
                <div key={article.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 
                          className="font-semibold text-gray-900 hover:text-rose-gold cursor-pointer"
                          onClick={() => handlePreview(article.slug)}
                        >
                          {article.title}
                        </h3>
                        <Badge className={getStatusColor(article)}>
                          {getStatusText(article)}
                        </Badge>
                        {article.featured && (
                          <Badge className="bg-rose-gold text-white">
                            Featured
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 mb-3 line-clamp-2">{article.excerpt}</p>
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <span>By Admin</span>
                        {article.publishedAt && (
                          <span className="flex items-center">
                            <Calendar className="w-4 h-4 mr-1" />
                            {formatDate(article.publishedAt)}
                          </span>
                        )}
                        <span className="flex items-center">
                          <FileText className="w-4 h-4 mr-1" />
                          {article.content.length} karakter
                        </span>
                        {article.imageUrl && (
                          <span className="text-green-600">
                            📷 Gambar
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 ml-4">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handlePreview(article.slug)}
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleEditArticle(article)}
                      >
                        <Edit3 className="w-4 h-4" />
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Hapus Artikel</AlertDialogTitle>
                            <AlertDialogDescription>
                              Apakah Anda yakin ingin menghapus artikel "{article.title}"? 
                              Tindakan ini tidak dapat dibatalkan.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Batal</AlertDialogCancel>
                            <AlertDialogAction 
                              onClick={() => handleDeleteArticle(article.id)}
                              className="bg-red-600 hover:bg-red-700"
                            >
                              Ya, Hapus
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                </div>
              ))}
              {articles.length === 0 && !isLoading && (
                <div className="text-center py-12 text-gray-500">
                  <FileText className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                  <h3 className="text-lg font-semibold text-gray-700 mb-2">Belum Ada Artikel</h3>
                  <p className="text-gray-500 mb-6">
                    Mulai dengan membuat artikel pertama Anda untuk berbagi pengetahuan tentang aromaterapi.
                  </p>
                  <Button 
                    onClick={handleAddArticle} 
                    className="bg-rose-gold hover:bg-rose-gold/90"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Tulis Artikel Pertama
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
