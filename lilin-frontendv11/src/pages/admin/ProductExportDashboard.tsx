import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit3, Trash2, Package } from "lucide-react";

export default function ProductExportDashboard() {
  const products = [
    {
      id: 1,
      name: "Lilin Aromaterapi Lavender",
      category: "Aromaterapi",
      price: "Rp 45.000",
      stock: 24,
      sold: 156,
      status: "active",
      image: "/api/placeholder/100/100"
    },
    {
      id: 2,
      name: "Lilin Aromaterapi Eucalyptus",
      category: "Aromaterapi",
      price: "Rp 48.000",
      stock: 18,
      sold: 132,
      status: "active",
      image: "/api/placeholder/100/100"
    },
    {
      id: 3,
      name: "Lilin Aromaterapi Rose",
      category: "Aromaterapi",
      price: "Rp 52.000",
      stock: 0,
      sold: 89,
      status: "out_of_stock",
      image: "/api/placeholder/100/100"
    },
    {
      id: 4,
      name: "Starter Kit Lilin DIY",
      category: "DIY Kit",
      price: "Rp 125.000",
      stock: 15,
      sold: 67,
      status: "active",
      image: "/api/placeholder/100/100"
    }
  ];

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
          <Button variant="outline">
            <Package className="w-4 h-4 mr-2" />
            Export Data
          </Button>
          <Button className="bg-rose-gold hover:bg-rose-gold/90">
            <Plus className="w-4 h-4 mr-2" />
            Tambah Produk
          </Button>
        </div>
      </div>

      {/* Product List */}
      <Card>
        <CardHeader>
          <CardTitle>Daftar Produk</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {products.map((product) => (
              <div key={product.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
                    <Package className="w-8 h-8 text-gray-400" />
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
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button variant="outline" size="sm">
                      <Edit3 className="w-4 h-4" />
                    </Button>
                    <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
