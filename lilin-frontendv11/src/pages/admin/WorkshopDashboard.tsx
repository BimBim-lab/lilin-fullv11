import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit3, Trash2, Users, Calendar, Clock } from "lucide-react";

export default function WorkshopDashboard() {
  const workshops = [
    {
      id: 1,
      title: "Workshop Basic - Lilin Aromaterapi Pemula",
      price: "Rp 250.000",
      duration: "4 jam",
      participants: 12,
      maxParticipants: 15,
      date: "2024-01-15",
      status: "upcoming",
      description: "Workshop dasar pembuatan lilin aromaterapi untuk pemula"
    },
    {
      id: 2,
      title: "Workshop Premium - Teknik Advance",
      price: "Rp 450.000",
      duration: "6 jam",
      participants: 8,
      maxParticipants: 12,
      date: "2024-01-20",
      status: "available",
      description: "Workshop lanjutan dengan teknik profesional"
    },
    {
      id: 3,
      title: "Workshop Pro - Business & Marketing",
      price: "Rp 750.000",
      duration: "8 jam",
      participants: 10,
      maxParticipants: 10,
      date: "2024-01-25",
      status: "full",
      description: "Workshop lengkap dengan strategi bisnis"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "upcoming": return "bg-blue-100 text-blue-800";
      case "available": return "bg-green-100 text-green-800";
      case "full": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "upcoming": return "Akan Datang";
      case "available": return "Tersedia";
      case "full": return "Penuh";
      default: return "Unknown";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Workshop Management</h2>
          <p className="text-sm text-gray-500">Kelola workshop dan pendaftaran peserta</p>
        </div>
        <Button className="bg-rose-gold hover:bg-rose-gold/90">
          <Plus className="w-4 h-4 mr-2" />
          Tambah Workshop
        </Button>
      </div>

      {/* Kurikulum Workshop */}
      <Card>
        <CardHeader>
          <CardTitle>Kurikulum Workshop</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              {
                step: "1",
                title: "Pengenalan Aromaterapi",
                description: "Memahami sejarah aromaterapi, manfaat kesehatan, jenis-jenis essential oil, dan properti terapeutiknya.",
                duration: "45 menit"
              },
              {
                step: "2",
                title: "Pemilihan Bahan & Alat",
                description: "Mengenal berbagai jenis wax (soy, beeswax, coconut), memilih wick yang tepat, dan essential oil berkualitas.",
                duration: "30 menit"
              },
              {
                step: "3",
                title: "Teknik Blending",
                description: "Mempelajari cara mencampur essential oil, menghitung persentase, dan menciptakan signature scent.",
                duration: "60 menit"
              },
              {
                step: "4",
                title: "Proses Pembuatan",
                description: "Praktik langsung melting wax, mixing essential oil, pouring, dan finishing dengan teknik profesional.",
                duration: "90 menit"
              },
              {
                step: "5",
                title: "Quality Control",
                description: "Memahami standar kualitas, troubleshooting masalah umum, dan tips untuk hasil optimal.",
                duration: "30 menit"
              },
              {
                step: "6",
                title: "Packaging & Branding",
                description: "Teknik packaging yang menarik, labeling produk, dan strategi branding untuk penjualan.",
                duration: "45 menit"
              }
            ].map((item, index) => (
              <div key={index} className="flex items-start border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                <div className="w-10 h-10 bg-rose-gold rounded-full flex items-center justify-center flex-shrink-0 mr-4">
                  <span className="text-white font-bold text-sm">{item.step}</span>
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-gray-900">{item.title}</h3>
                    <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">
                      {item.duration}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">{item.description}</p>
                </div>
                <div className="flex items-center space-x-2 ml-4">
                  <Button variant="outline" size="sm">
                    <Edit3 className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4">
            <Button variant="outline" className="w-full">
              <Plus className="w-4 h-4 mr-2" />
              Tambah Langkah Kurikulum
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Workshop List */}
      <Card>
        <CardHeader>
          <CardTitle>Daftar Workshop</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {workshops.map((workshop) => (
              <div key={workshop.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="font-semibold text-gray-900">{workshop.title}</h3>
                      <Badge className={getStatusColor(workshop.status)}>
                        {getStatusText(workshop.status)}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{workshop.description}</p>
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <span className="flex items-center">
                        <Calendar className="w-4 h-4 mr-1" />
                        {workshop.date}
                      </span>
                      <span className="flex items-center">
                        <Clock className="w-4 h-4 mr-1" />
                        {workshop.duration}
                      </span>
                      <span className="flex items-center">
                        <Users className="w-4 h-4 mr-1" />
                        {workshop.participants}/{workshop.maxParticipants}
                      </span>
                      <span className="font-semibold text-rose-gold">{workshop.price}</span>
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
