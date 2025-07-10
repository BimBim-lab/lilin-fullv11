import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit3, Trash2, FileText, Eye, Calendar } from "lucide-react";

export default function BlogDashboard() {
  const articles = [
    {
      id: 1,
      title: "Tips Memilih Essential Oil Terbaik untuk Lilin Aromaterapi",
      slug: "tips-memilih-essential-oil-terbaik",
      excerpt: "Panduan lengkap memilih essential oil berkualitas untuk hasil lilin aromaterapi yang sempurna.",
      status: "published",
      author: "Admin",
      publishDate: "2024-01-10",
      views: 1234,
      comments: 12
    },
    {
      id: 2,
      title: "5 Manfaat Aromaterapi untuk Kesehatan Mental",
      slug: "manfaat-aromaterapi-kesehatan-mental",
      excerpt: "Eksplorasi manfaat aromaterapi dalam meningkatkan kesehatan mental dan mengurangi stress.",
      status: "published",
      author: "Admin",
      publishDate: "2024-01-08",
      views: 987,
      comments: 8
    },
    {
      id: 3,
      title: "Tutorial Lengkap Membuat Lilin Aromaterapi di Rumah",
      slug: "tutorial-membuat-lilin-aromaterapi",
      excerpt: "Step by step panduan membuat lilin aromaterapi berkualitas di rumah dengan alat sederhana.",
      status: "draft",
      author: "Admin",
      publishDate: null,
      views: 0,
      comments: 0
    },
    {
      id: 4,
      title: "Sejarah dan Perkembangan Aromaterapi di Dunia",
      slug: "sejarah-perkembangan-aromaterapi",
      excerpt: "Menelusuri perjalanan aromaterapi dari zaman kuno hingga menjadi tren modern.",
      status: "published",
      author: "Admin",
      publishDate: "2024-01-05",
      views: 756,
      comments: 15
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "published": return "bg-green-100 text-green-800";
      case "draft": return "bg-yellow-100 text-yellow-800";
      case "archived": return "bg-gray-100 text-gray-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "published": return "Published";
      case "draft": return "Draft";
      case "archived": return "Archived";
      default: return "Unknown";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Blog Management</h2>
          <p className="text-sm text-gray-500">Kelola artikel blog dan konten edukasi</p>
        </div>
        <Button className="bg-rose-gold hover:bg-rose-gold/90">
          <Plus className="w-4 h-4 mr-2" />
          Tulis Artikel Baru
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Artikel</p>
                <p className="text-2xl font-bold text-gray-900">24</p>
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
                <p className="text-2xl font-bold text-gray-900">18</p>
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
                <p className="text-2xl font-bold text-gray-900">6</p>
              </div>
              <div className="text-yellow-500">
                <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Views</p>
                <p className="text-2xl font-bold text-gray-900">45.2K</p>
              </div>
              <Eye className="w-8 h-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Articles List */}
      <Card>
        <CardHeader>
          <CardTitle>Daftar Artikel</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {articles.map((article) => (
              <div key={article.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="font-semibold text-gray-900 hover:text-rose-gold cursor-pointer">
                        {article.title}
                      </h3>
                      <Badge className={getStatusColor(article.status)}>
                        {getStatusText(article.status)}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">{article.excerpt}</p>
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <span>By {article.author}</span>
                      {article.publishDate && (
                        <span className="flex items-center">
                          <Calendar className="w-4 h-4 mr-1" />
                          {article.publishDate}
                        </span>
                      )}
                      <span className="flex items-center">
                        <Eye className="w-4 h-4 mr-1" />
                        {article.views} views
                      </span>
                      <span>{article.comments} comments</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 ml-4">
                    <Button variant="outline" size="sm">
                      <Eye className="w-4 h-4" />
                    </Button>
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
