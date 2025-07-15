import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Edit3, Trash2, Package, Save, Loader2, Eye, Upload, Image, X } from "lucide-react";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { type Product, type InsertProduct } from "@/shared/schema";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

export default function ProductExportDashboard() {
  const { toast } = useToast();
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  // Category management states
  const [categories, setCategories] = useState<string[]>([
    "Aromaterapi", 
    "DIY Kit", 
    "Essential Oil", 
    "Accessories"
  ]);
  const [isCategoryDialogOpen, setIsCategoryDialogOpen] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [editingCategoryIndex, setEditingCategoryIndex] = useState<number | null>(null);
  
  const [newProduct, setNewProduct] = useState<InsertProduct>({
    name: "",
    category: "",
    price: "",
    stock: "",
    sold: "",
    status: "active",
    imageUrl: "",
    description: "",
    moq: ""
  });

  // Image upload states
  const [isUploading, setIsUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);

  // Load products on component mount
  useEffect(() => {
    loadProducts();
    loadCategoriesFromProducts();
  }, []);

  // Load unique categories from existing products
  const loadCategoriesFromProducts = () => {
    const uniqueCategories = [...new Set(products.map(p => p.category))];
    if (uniqueCategories.length > 0) {
      setCategories(prev => {
        const combined = [...new Set([...prev, ...uniqueCategories])];
        return combined;
      });
    }
  };

  // Update categories when products change
  useEffect(() => {
    loadCategoriesFromProducts();
  }, [products]);

  const loadProducts = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/products`);
      if (response.ok) {
        const data = await response.json();
        setProducts(data);
      } else {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
    } catch (error) {
      console.error('Error loading products:', error);
      toast({
        title: "Error",
        description: "Gagal memuat data produk",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Image upload functions
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
        description: `${file.name} siap untuk diupload.`,
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

  const clearSelectedFile = () => {
    setSelectedFile(null);
    setFilePreview(null);
    const fileInput = document.getElementById('product-image-upload') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  };

  const saveProducts = async () => {
    setIsSaving(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/products`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('admin_token')}`,
        },
        body: JSON.stringify(products.map(product => {
          const { id, updatedAt, ...productData } = product;
          return productData;
        })),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Save failed: ${response.status} ${response.statusText} - ${errorText}`);
      }

      const savedProducts = await response.json();
      setProducts(savedProducts);
      
      toast({
        title: "Success",
        description: "Produk berhasil disimpan",
      });
    } catch (error) {
      console.error('Error saving products:', error);
      toast({
        title: "Error",
        description: `Gagal menyimpan produk: ${error instanceof Error ? error.message : 'Unknown error'}`,
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setNewProduct({
      name: product.name,
      category: product.category,
      price: product.price,
      stock: product.stock,
      sold: product.sold,
      status: product.status as "active" | "out_of_stock" | "inactive",
      imageUrl: product.imageUrl || "",
      description: product.description || "",
      moq: product.moq || ""
    });
    setIsDialogOpen(true);
  };

  const handleAddProduct = () => {
    setEditingProduct(null);
    setNewProduct({
      name: "",
      category: "",
      price: "",
      stock: "",
      sold: "0",
      status: "active",
      imageUrl: "",
      description: "",
      moq: ""
    });
    setSelectedFile(null);
    setFilePreview(null);
    setIsDialogOpen(true);
  };

  const handleSaveProduct = async () => {
    setIsSaving(true);
    try {
      let dataToSave = { ...newProduct };

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

      let updatedProducts;
      
      if (editingProduct) {
        // Update existing product
        updatedProducts = products.map(p => 
          p.id === editingProduct.id 
            ? { ...p, ...dataToSave, updatedAt: new Date().toISOString() }
            : p
        );
      } else {
        // Add new product
        const newId = Math.max(...products.map(p => p.id), 0) + 1;
        updatedProducts = [...products, {
          id: newId,
          ...dataToSave,
          updatedAt: new Date().toISOString()
        }];
      }

      // Update local state
      setProducts(updatedProducts);
      setIsDialogOpen(false);
      setSelectedFile(null);
      setFilePreview(null);

      // Clear file input
      const fileInput = document.getElementById('product-image-upload') as HTMLInputElement;
      if (fileInput) {
        fileInput.value = '';
      }

      // Immediately sync to backend
      const response = await fetch(`${API_BASE_URL}/api/products`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('admin_token')}`,
        },
        body: JSON.stringify(updatedProducts.map(product => {
          const { id, updatedAt, ...productData } = product;
          return productData;
        })),
      });

      if (!response.ok) {
        throw new Error(`Sync failed: ${response.status} ${response.statusText}`);
      }

      const savedProducts = await response.json();
      setProducts(savedProducts);

      toast({
        title: "Success",
        description: editingProduct ? "Produk berhasil diupdate dan disinkronkan" : "Produk berhasil ditambahkan dan disinkronkan",
      });
    } catch (error) {
      console.error('Error saving product:', error);
      toast({
        title: "Error",
        description: `Gagal menyimpan produk: ${error instanceof Error ? error.message : 'Unknown error'}`,
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };

  // Category management functions
  const handleAddCategory = () => {
    setEditingCategoryIndex(null);
    setNewCategoryName("");
    setIsCategoryDialogOpen(true);
  };

  const handleEditCategory = (index: number) => {
    setEditingCategoryIndex(index);
    setNewCategoryName(categories[index]);
    setIsCategoryDialogOpen(true);
  };

  const handleSaveCategory = () => {
    if (!newCategoryName.trim()) {
      toast({
        title: "Error",
        description: "Nama kategori tidak boleh kosong",
        variant: "destructive"
      });
      return;
    }

    if (editingCategoryIndex !== null) {
      // Edit existing category
      const oldCategory = categories[editingCategoryIndex];
      const newCategories = [...categories];
      newCategories[editingCategoryIndex] = newCategoryName.trim();
      setCategories(newCategories);

      // Update products that use the old category
      const updatedProducts = products.map(product => 
        product.category === oldCategory 
          ? { ...product, category: newCategoryName.trim() }
          : product
      );
      setProducts(updatedProducts);

      toast({
        title: "Success",
        description: `Kategori "${oldCategory}" berhasil diubah menjadi "${newCategoryName.trim()}"`,
      });
    } else {
      // Add new category
      if (categories.includes(newCategoryName.trim())) {
        toast({
          title: "Error",
          description: "Kategori sudah ada",
          variant: "destructive"
        });
        return;
      }
      setCategories([...categories, newCategoryName.trim()]);
      toast({
        title: "Success",
        description: `Kategori "${newCategoryName.trim()}" berhasil ditambahkan`,
      });
    }

    setIsCategoryDialogOpen(false);
    setNewCategoryName("");
    setEditingCategoryIndex(null);
  };

  const handleDeleteCategory = (index: number) => {
    const categoryToDelete = categories[index];
    const productsUsingCategory = products.filter(p => p.category === categoryToDelete);
    
    if (productsUsingCategory.length > 0) {
      toast({
        title: "Error",
        description: `Tidak dapat menghapus kategori "${categoryToDelete}" karena masih digunakan oleh ${productsUsingCategory.length} produk`,
        variant: "destructive"
      });
      return;
    }

    const newCategories = categories.filter((_, i) => i !== index);
    setCategories(newCategories);
    toast({
      title: "Success",
      description: `Kategori "${categoryToDelete}" berhasil dihapus`,
    });
  };

  const handleDeleteProduct = async (productId: number) => {
    try {
      const updatedProducts = products.filter(p => p.id !== productId);
      
      // Update local state
      setProducts(updatedProducts);

      // Immediately sync to backend
      const response = await fetch(`${API_BASE_URL}/api/products`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('admin_token')}`,
        },
        body: JSON.stringify(updatedProducts.map(product => {
          const { id, updatedAt, ...productData } = product;
          return productData;
        })),
      });

      if (!response.ok) {
        throw new Error(`Sync failed: ${response.status} ${response.statusText}`);
      }

      const savedProducts = await response.json();
      setProducts(savedProducts);

      toast({
        title: "Success",
        description: "Produk berhasil dihapus dan disinkronkan",
      });
    } catch (error) {
      console.error('Error deleting product:', error);
      toast({
        title: "Error",
        description: `Gagal menghapus produk: ${error instanceof Error ? error.message : 'Unknown error'}`,
        variant: "destructive"
      });
    }
  };

  const handleExportData = () => {
    const csvContent = [
      ['ID', 'Name', 'Category', 'Price', 'Stock', 'Sold', 'Status', 'MOQ'].join(','),
      ...products.map(product => [
        product.id,
        `"${product.name}"`,
        `"${product.category}"`,
        `"${product.price}"`,
        product.stock,
        product.sold,
        product.status,
        `"${product.moq || ''}"`
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'products-export.csv';
    a.click();
    window.URL.revokeObjectURL(url);
    
    toast({
      title: "Success",
      description: "Data produk berhasil diexport",
    });
  };

  const handlePreview = () => {
    // Open export page in new tab
    window.open('/export', '_blank');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "bg-green-100 text-green-800";
      case "out_of_stock": return "bg-red-100 text-red-800";
      case "inactive": return "bg-gray-100 text-gray-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "active": return "Aktif";
      case "out_of_stock": return "Stok Habis";
      case "inactive": return "Tidak Aktif";
      default: return "Unknown";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Product Export Management</h2>
          <p className="text-sm text-gray-500">Kelola produk yang dijual dan ekspor data</p>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="outline" onClick={() => setIsCategoryDialogOpen(true)}>
            <Package className="w-4 h-4 mr-2" />
            Kelola Kategori
          </Button>
          <Button variant="outline" onClick={handlePreview}>
            <Eye className="w-4 h-4 mr-2" />
            Preview Export Page
          </Button>
          <Button variant="outline" onClick={handleExportData}>
            <Package className="w-4 h-4 mr-2" />
            Export Data
          </Button>
          <Button onClick={saveProducts} disabled={isSaving} className="bg-rose-gold hover:bg-rose-gold/90">
            {isSaving ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Save className="w-4 h-4 mr-2" />
            )}
            {isSaving ? 'Menyimpan...' : 'Simpan'}
          </Button>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={handleAddProduct} className="bg-green-600 hover:bg-green-700">
                <Plus className="w-4 h-4 mr-2" />
                Tambah Produk
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>{editingProduct ? 'Edit Produk' : 'Tambah Produk Baru'}</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="name">Nama Produk</Label>
                  <Input
                    id="name"
                    value={newProduct.name}
                    onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
                    placeholder="Masukkan nama produk"
                  />
                </div>
                <div>
                  <Label htmlFor="category">Kategori</Label>
                  <div className="flex space-x-2">
                    <Select value={newProduct.category} onValueChange={(value) => setNewProduct({...newProduct, category: value})}>
                      <SelectTrigger className="flex-1">
                        <SelectValue placeholder="Pilih kategori" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category} value={category}>{category}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Button 
                      type="button"
                      variant="outline" 
                      size="sm"
                      onClick={handleAddCategory}
                      className="px-3"
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="price">Harga</Label>
                    <Input
                      id="price"
                      value={newProduct.price}
                      onChange={(e) => setNewProduct({...newProduct, price: e.target.value})}
                      placeholder="Rp 50.000"
                    />
                  </div>
                  <div>
                    <Label htmlFor="stock">Stok</Label>
                    <Input
                      id="stock"
                      value={newProduct.stock}
                      onChange={(e) => setNewProduct({...newProduct, stock: e.target.value})}
                      placeholder="100"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="sold">Terjual</Label>
                    <Input
                      id="sold"
                      value={newProduct.sold}
                      onChange={(e) => setNewProduct({...newProduct, sold: e.target.value})}
                      placeholder="0"
                    />
                  </div>
                  <div>
                    <Label htmlFor="status">Status</Label>
                    <Select value={newProduct.status} onValueChange={(value) => setNewProduct({...newProduct, status: value as "active" | "out_of_stock" | "inactive"})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="active">Aktif</SelectItem>
                        <SelectItem value="out_of_stock">Stok Habis</SelectItem>
                        <SelectItem value="inactive">Tidak Aktif</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div>
                  <Label htmlFor="moq">MOQ (Minimum Order Quantity)</Label>
                  <Input
                    id="moq"
                    value={newProduct.moq}
                    onChange={(e) => setNewProduct({...newProduct, moq: e.target.value})}
                    placeholder="50 pcs"
                  />
                </div>
                <div>
                  <Label>Gambar Produk</Label>
                  {/* Image URL Input */}
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="imageUrl">Image URL (opsional)</Label>
                      <Input
                        id="imageUrl"
                        value={newProduct.imageUrl}
                        onChange={(e) => setNewProduct({...newProduct, imageUrl: e.target.value})}
                        placeholder="https://example.com/image.jpg atau upload file di bawah"
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
                        </div>
                      ) : newProduct.imageUrl ? (
                        <div className="space-y-2">
                          <img 
                            src={newProduct.imageUrl} 
                            alt="Product"
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
                          <p className="text-sm text-gray-600 mb-2">Upload gambar produk atau drag & drop</p>
                          <p className="text-xs text-gray-500">PNG, JPG, WEBP, AVIF hingga 10MB</p>
                        </>
                      )}
                      <div className="mt-4">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleFileSelect}
                          className="hidden"
                          id="product-image-upload"
                        />
                        <Button 
                          variant="outline" 
                          onClick={() => document.getElementById('product-image-upload')?.click()}
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
                  </div>
                </div>
                <div>
                  <Label htmlFor="description">Deskripsi</Label>
                  <Textarea
                    id="description"
                    value={newProduct.description}
                    onChange={(e) => setNewProduct({...newProduct, description: e.target.value})}
                    placeholder="Deskripsi produk..."
                    rows={3}
                  />
                </div>
                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Batal
                  </Button>
                  <Button onClick={handleSaveProduct} disabled={isSaving || isUploading}>
                    {isSaving || isUploading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        {isUploading ? 'Mengupload...' : 'Menyimpan...'}
                      </>
                    ) : (
                      editingProduct ? 'Update' : 'Tambah'
                    )}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          {/* Category Management Dialog */}
          <Dialog open={isCategoryDialogOpen} onOpenChange={setIsCategoryDialogOpen}>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Kelola Kategori Produk</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                {/* Add/Edit Category Form */}
                <div className="space-y-3">
                  <Label htmlFor="categoryName">
                    {editingCategoryIndex !== null ? 'Edit Kategori' : 'Tambah Kategori Baru'}
                  </Label>
                  <div className="flex space-x-2">
                    <Input
                      id="categoryName"
                      value={newCategoryName}
                      onChange={(e) => setNewCategoryName(e.target.value)}
                      placeholder="Masukkan nama kategori"
                      className="flex-1"
                    />
                    <Button onClick={handleSaveCategory} size="sm">
                      {editingCategoryIndex !== null ? 'Update' : 'Tambah'}
                    </Button>
                  </div>
                </div>

                {/* Category List */}
                <div>
                  <h4 className="text-sm font-medium text-gray-900 mb-3">Daftar Kategori:</h4>
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {categories.map((category, index) => {
                      const productCount = products.filter(p => p.category === category).length;
                      return (
                        <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                          <div>
                            <span className="font-medium text-gray-900">{category}</span>
                            <span className="text-sm text-gray-500 ml-2">({productCount} produk)</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleEditCategory(index)}
                              className="px-2"
                            >
                              <Edit3 className="w-3 h-3" />
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleDeleteCategory(index)}
                              className="px-2 text-red-600 hover:text-red-700"
                              disabled={productCount > 0}
                            >
                              <Trash2 className="w-3 h-3" />
                            </Button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button variant="outline" onClick={() => {
                    setIsCategoryDialogOpen(false);
                    setNewCategoryName("");
                    setEditingCategoryIndex(null);
                  }}>
                    Selesai
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Product List */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin" />
          <span className="ml-2">Loading...</span>
        </div>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Daftar Produk ({products.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {products.map((product) => (
                <div key={product.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center overflow-hidden">
                      {product.imageUrl ? (
                        <img 
                          src={product.imageUrl} 
                          alt={product.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100";
                          }}
                        />
                      ) : (
                        <Package className="w-8 h-8 text-gray-400" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="font-semibold text-gray-900">{product.name}</h3>
                        <Badge className={getStatusColor(product.status)}>
                          {getStatusText(product.status)}
                        </Badge>
                      </div>
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <span>Kategori: {product.category}</span>
                        <span>Harga: {product.price}</span>
                        <span>Stok: {product.stock}</span>
                        <span>Terjual: {product.sold}</span>
                        {product.moq && <span>MOQ: {product.moq}</span>}
                      </div>
                      {product.description && (
                        <p className="text-sm text-gray-600 mt-1 line-clamp-2">{product.description}</p>
                      )}
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button variant="outline" size="sm" onClick={() => handleEditProduct(product)}>
                        <Edit3 className="w-4 h-4" />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="text-red-600 hover:text-red-700"
                        onClick={() => handleDeleteProduct(product.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
              {products.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <Package className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <p>Belum ada produk. Klik "Tambah Produk" untuk menambahkan produk baru.</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
