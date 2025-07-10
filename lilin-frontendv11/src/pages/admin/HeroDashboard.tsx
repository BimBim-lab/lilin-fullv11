import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Edit3, Eye, Save, Upload, Image } from "lucide-react";

export default function HeroDashboard() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Hero Section Management</h2>
          <p className="text-sm text-gray-500">Kelola konten hero section di halaman utama</p>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="outline" size="sm">
            <Eye className="w-4 h-4 mr-2" />
            Preview
          </Button>
          <Button size="sm" className="bg-rose-gold hover:bg-rose-gold/90">
            <Save className="w-4 h-4 mr-2" />
            Simpan
          </Button>
        </div>
      </div>

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
                    defaultValue="Workshop Lilin Aromaterapi oleh"
                  />
                </div>
                <div>
                  <Label htmlFor="title2">Title 2 (Highlighted)</Label>
                  <Input
                    id="title2"
                    placeholder="WeisCandle"
                    defaultValue="WeisCandle"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Masukkan deskripsi hero section..."
                  defaultValue="Pelajari seni membuat lilin aromaterapi yang menenangkan dengan teknik profesional dan bahan berkualitas tinggi."
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
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                  <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-sm text-gray-600 mb-2">Upload gambar hero atau drag & drop</p>
                  <p className="text-xs text-gray-500">PNG, JPG, WEBP up to 10MB</p>
                  <Button variant="outline" className="mt-4">
                    <Upload className="w-4 h-4 mr-2" />
                    Pilih File
                  </Button>
                </div>
                <div>
                  <Label htmlFor="imageAlt">Alt Text</Label>
                  <Input
                    id="imageAlt"
                    placeholder="Aromatherapy candle making workshop setup"
                    defaultValue="Aromatherapy candle making workshop setup"
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
                  defaultChecked
                  className="rounded border-gray-300"
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="showStats">Show Stats</Label>
                <input
                  type="checkbox"
                  id="showStats"
                  defaultChecked
                  className="rounded border-gray-300"
                />
              </div>
              <div>
                <Label htmlFor="statsNumber">Stats Number</Label>
                <Input
                  id="statsNumber"
                  placeholder="500+"
                  defaultValue="500+"
                />
              </div>
              <div>
                <Label htmlFor="statsLabel">Stats Label</Label>
                <Input
                  id="statsLabel"
                  placeholder="Peserta Puas"
                  defaultValue="Peserta Puas"
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
                  <span className="text-sm text-gray-500">2 hours ago</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Views Today</span>
                  <span className="text-sm font-medium">1,234</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
