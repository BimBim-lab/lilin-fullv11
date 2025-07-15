import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Edit3, Save, Phone, MapPin, MessageCircle, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { type ContactInfo, type InsertContactInfo } from "@/shared/schema";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

export default function ContactDashboard() {
  const { toast } = useToast();
  const [contactInfo, setContactInfo] = useState<ContactInfo>({
    id: 1,
    phone: "+62 812-3456-7890",
    whatsapp: "+62 812-3456-7890",
    email: "info@weiscandle.com",
    website: "https://weiscandle.com",
    address: "Jl. Raya No. 123, Kemang\nJakarta Selatan 12345\nIndonesia",
    mapEmbed: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3966.521260322283!2d106.8195613!3d-6.2!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e69f5d2e764b12d%3A0x3d2ad6e1e0e9bcc8!2sJakarta%2C%20Indonesia!5e0!3m2!1sen!2sid!4v1234567890123!5m2!1sen!2sid",
    instagram: "@weiscandle_official",
    facebook: "WeisCandle Indonesia",
    tiktok: "@weiscandle",
    updatedAt: new Date().toISOString()
  });

  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  // Load contact info on component mount
  useEffect(() => {
    loadContactInfo();
  }, []);

  const loadContactInfo = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/contact-info`);
      if (response.ok) {
        const data = await response.json();
        setContactInfo(data);
      } else {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
    } catch (error) {
      console.error('Error loading contact info:', error);
      // Don't show error toast on initial load, just use default data
      console.log('Using default contact info data');
      // Default data is already set in state initialization
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);

      const updateData: InsertContactInfo = {
        phone: contactInfo.phone,
        whatsapp: contactInfo.whatsapp,
        email: contactInfo.email,
        website: contactInfo.website,
        address: contactInfo.address,
        mapEmbed: contactInfo.mapEmbed,
        instagram: contactInfo.instagram,
        facebook: contactInfo.facebook,
        tiktok: contactInfo.tiktok
      };

      const response = await fetch(`${API_BASE_URL}/api/contact-info`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('admin_token')}`,
        },
        body: JSON.stringify(updateData),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Save failed: ${response.status} ${response.statusText} - ${errorText}`);
      }

      const savedContactInfo = await response.json();
      setContactInfo(savedContactInfo);
      
      setIsEditing(false);
      toast({
        title: "Success",
        description: "Informasi kontak berhasil disimpan",
      });
    } catch (error) {
      console.error('Error saving contact info:', error);
      toast({
        title: "Error",
        description: `Gagal menyimpan informasi kontak: ${error instanceof Error ? error.message : 'Unknown error'}`,
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleInputChange = (field: keyof InsertContactInfo, value: string) => {
    setContactInfo(prev => ({
      ...prev,
      [field]: value
    }));
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin" />
        <span className="ml-2">Loading...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Contact Information Management</h2>
          <p className="text-sm text-gray-500">
            Kelola informasi kontak dan alamat perusahaan
            {!isEditing && <span className="text-rose-gold font-medium"> • Klik "Edit Mode" untuk mulai mengedit</span>}
          </p>
        </div>
        <div className="flex items-center space-x-3">
          {isEditing ? (
            <>
              <Button 
                variant="outline" 
                onClick={() => {
                  setIsEditing(false);
                  loadContactInfo(); // Reset to original data
                }}
                disabled={isSaving}
              >
                Batal
              </Button>
              <Button 
                onClick={handleSave} 
                disabled={isSaving}
                className="bg-rose-gold hover:bg-rose-gold/90 text-charcoal font-semibold"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Menyimpan...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Simpan Perubahan
                  </>
                )}
              </Button>
            </>
          ) : (
            <Button 
              onClick={() => setIsEditing(true)}
              className="bg-charcoal hover:bg-charcoal/90 text-white"
            >
              <Edit3 className="w-4 h-4 mr-2" />
              Edit Mode
            </Button>
          )}
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
                  value={contactInfo.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  placeholder="+62 812-3456-7890"
                  disabled={!isEditing}
                  className={!isEditing ? "bg-gray-50 cursor-not-allowed" : ""}
                />
              </div>
              <div>
                <Label htmlFor="whatsapp">WhatsApp</Label>
                <Input
                  id="whatsapp"
                  value={contactInfo.whatsapp}
                  onChange={(e) => handleInputChange('whatsapp', e.target.value)}
                  placeholder="+62 812-3456-7890"
                  disabled={!isEditing}
                  className={!isEditing ? "bg-gray-50 cursor-not-allowed" : ""}
                />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={contactInfo.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  placeholder="info@weiscandle.com"
                  disabled={!isEditing}
                  className={!isEditing ? "bg-gray-50 cursor-not-allowed" : ""}
                />
              </div>
              <div>
                <Label htmlFor="website">Website</Label>
                <Input
                  id="website"
                  type="url"
                  value={contactInfo.website}
                  onChange={(e) => handleInputChange('website', e.target.value)}
                  placeholder="https://weiscandle.com"
                  disabled={!isEditing}
                  className={!isEditing ? "bg-gray-50 cursor-not-allowed" : ""}
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
                  value={contactInfo.instagram}
                  onChange={(e) => handleInputChange('instagram', e.target.value)}
                  placeholder="@weiscandle_official"
                  disabled={!isEditing}
                  className={!isEditing ? "bg-gray-50 cursor-not-allowed" : ""}
                />
              </div>
              <div>
                <Label htmlFor="facebook">Facebook</Label>
                <Input
                  id="facebook"
                  value={contactInfo.facebook}
                  onChange={(e) => handleInputChange('facebook', e.target.value)}
                  placeholder="WeisCandle Indonesia"
                  disabled={!isEditing}
                  className={!isEditing ? "bg-gray-50 cursor-not-allowed" : ""}
                />
              </div>
              <div>
                <Label htmlFor="tiktok">TikTok</Label>
                <Input
                  id="tiktok"
                  value={contactInfo.tiktok}
                  onChange={(e) => handleInputChange('tiktok', e.target.value)}
                  placeholder="@weiscandle"
                  disabled={!isEditing}
                  className={!isEditing ? "bg-gray-50 cursor-not-allowed" : ""}
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
                  value={contactInfo.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  placeholder="Jl. Aromaterapi No. 123, Jakarta Selatan..."
                  rows={4}
                  disabled={!isEditing}
                  className={!isEditing ? "bg-gray-50 cursor-not-allowed resize-none" : ""}
                />
              </div>
              <div>
                <Label htmlFor="mapEmbed">Google Maps Embed URL</Label>
                <Textarea
                  id="mapEmbed"
                  value={contactInfo.mapEmbed}
                  onChange={(e) => handleInputChange('mapEmbed', e.target.value)}
                  placeholder="https://www.google.com/maps/embed?pb=..."
                  rows={3}
                  disabled={!isEditing}
                  className={!isEditing ? "bg-gray-50 cursor-not-allowed resize-none" : ""}
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
              {contactInfo.mapEmbed && (contactInfo.mapEmbed.includes('maps/embed') || contactInfo.mapEmbed.includes('google.com/maps')) ? (
                <iframe 
                  src={contactInfo.mapEmbed} 
                  width="100%" 
                  height="300" 
                  style={{ border: 0, borderRadius: '8px' }}
                  allowFullScreen 
                  loading="lazy" 
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Lokasi WeisCandle Workshop"
                  onError={(e) => {
                    console.error('Error loading Google Maps iframe:', e);
                  }}
                />
              ) : (
                <div className="bg-gray-100 rounded-lg h-64 flex items-center justify-center">
                  <div className="text-center">
                    <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-500">Map Preview</p>
                    <p className="text-xs text-gray-400">
                      {contactInfo.mapEmbed ? "URL tidak valid - pastikan menggunakan URL embed dari Google Maps" : "Masukkan Google Maps embed URL"}
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
