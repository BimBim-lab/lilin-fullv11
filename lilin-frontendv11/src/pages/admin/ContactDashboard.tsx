import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Edit3, Save, Phone, MapPin, MessageCircle } from "lucide-react";

export default function ContactDashboard() {
  const contactInfo = {
    phone: "+62 812-3456-7890",
    whatsapp: "+62 812-3456-7890",
    email: "info@weiscandle.com",
    website: "https://weiscandle.com",
    address: "Jl. Aromaterapi No. 123, Jakarta Selatan, DKI Jakarta 12345",
    mapEmbed: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3966.4...",
    socialMedia: {
      instagram: "@weiscandle_official",
      facebook: "WeisCandle Indonesia",
      tiktok: "@weiscandle"
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Contact Information Management</h2>
          <p className="text-sm text-gray-500">Kelola informasi kontak dan alamat perusahaan</p>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="outline">
            <Edit3 className="w-4 h-4 mr-2" />
            Edit Mode
          </Button>
          <Button className="bg-rose-gold hover:bg-rose-gold/90">
            <Save className="w-4 h-4 mr-2" />
            Simpan Perubahan
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Contact Details */}
        <div className="space-y-6">
          {/* Primary Contact */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Phone className="w-5 h-5 mr-2" />
                Kontak Utama
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="phone">Nomor Telepon</Label>
                <Input
                  id="phone"
                  defaultValue={contactInfo.phone}
                  placeholder="+62 812-3456-7890"
                />
              </div>
              <div>
                <Label htmlFor="whatsapp">WhatsApp</Label>
                <Input
                  id="whatsapp"
                  defaultValue={contactInfo.whatsapp}
                  placeholder="+62 812-3456-7890"
                />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  defaultValue={contactInfo.email}
                  placeholder="info@weiscandle.com"
                />
              </div>
              <div>
                <Label htmlFor="website">Website</Label>
                <Input
                  id="website"
                  type="url"
                  defaultValue={contactInfo.website}
                  placeholder="https://weiscandle.com"
                />
              </div>
            </CardContent>
          </Card>

          {/* Social Media */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <MessageCircle className="w-5 h-5 mr-2" />
                Media Sosial
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="instagram">Instagram</Label>
                <Input
                  id="instagram"
                  defaultValue={contactInfo.socialMedia.instagram}
                  placeholder="@weiscandle_official"
                />
              </div>
              <div>
                <Label htmlFor="facebook">Facebook</Label>
                <Input
                  id="facebook"
                  defaultValue={contactInfo.socialMedia.facebook}
                  placeholder="WeisCandle Indonesia"
                />
              </div>
              <div>
                <Label htmlFor="tiktok">TikTok</Label>
                <Input
                  id="tiktok"
                  defaultValue={contactInfo.socialMedia.tiktok}
                  placeholder="@weiscandle"
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Address & Map */}
        <div className="space-y-6">
          {/* Address */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <MapPin className="w-5 h-5 mr-2" />
                Alamat
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="address">Alamat Lengkap</Label>
                <Textarea
                  id="address"
                  defaultValue={contactInfo.address}
                  placeholder="Jl. Aromaterapi No. 123, Jakarta Selatan..."
                  rows={4}
                />
              </div>
              <div>
                <Label htmlFor="mapEmbed">Google Maps Embed URL</Label>
                <Textarea
                  id="mapEmbed"
                  defaultValue={contactInfo.mapEmbed}
                  placeholder="https://www.google.com/maps/embed?pb=..."
                  rows={3}
                />
                <p className="text-xs text-gray-500 mt-1">
                  Dapatkan embed URL dari Google Maps → Share → Embed a map
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Map Preview */}
          <Card>
            <CardHeader>
              <CardTitle>Preview Peta</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-gray-100 rounded-lg h-64 flex items-center justify-center">
                <div className="text-center">
                  <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-500">Map Preview</p>
                  <p className="text-xs text-gray-400">Google Maps akan muncul di sini</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
