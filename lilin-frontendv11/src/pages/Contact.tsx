import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { insertContactSchema, type InsertContact } from "@shared/schema";

interface ContactInfo {
  address: string;
  phone: string;
  email: string;
  whatsapp: string;
  mapEmbed: string;
}

interface ContactProps {
  contactInfo?: ContactInfo;
}

export default function Contact({ contactInfo }: ContactProps) {
  // Default contact info if none provided
  const defaultContactInfo: ContactInfo = {
    address: "Jl. Raya No. 123, Kemang\nJakarta Selatan 12345\nIndonesia",
    phone: "+62 812-3456-7890",
    email: "info@weiscandle.com",
    whatsapp: "+62 812-3456-7890",
    mapEmbed: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3966.521260322283!2d106.8195613!3d-6.2!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e69f5d2e764b12d%3A0x3d2ad6e1e0e9bcc8!2sJakarta%2C%20Indonesia!5e0!3m2!1sen!2sid!4v1234567890123!5m2!1sen!2sid"
  };

  const contact = contactInfo || defaultContactInfo;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    document.title = "Hubungi Kami - WeisCandle Workshop Aromaterapi";
  }, []);

  const form = useForm<InsertContact>({
    resolver: zodResolver(insertContactSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      subject: "",
      message: "",
    },
  });

  const contactMutation = useMutation({
    mutationFn: async (data: InsertContact) => {
      const response = await apiRequest("POST", "/api/contact", data);
      return response.json();
    },
    onSuccess: (data) => {
      toast({
        title: "Pesan Terkirim!",
        description: data.message || "Terima kasih! Kami akan menghubungi Anda segera.",
      });
      form.reset();
      setIsSubmitting(false);
    },
    onError: (error: any) => {
      toast({
        title: "Gagal Mengirim Pesan",
        description: error.message || "Terjadi kesalahan. Silakan coba lagi atau hubungi kami via WhatsApp.",
        variant: "destructive",
      });
      setIsSubmitting(false);
    },
  });

  const onSubmit = (data: InsertContact) => {
    setIsSubmitting(true);
    contactMutation.mutate(data);
  };

  return (
    <div className="min-h-screen py-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-display font-bold text-charcoal mb-6">
            Hubungi Kami
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Ada pertanyaan tentang workshop atau ingin konsultasi? 
            Jangan ragu untuk menghubungi kami. Tim WeisCandle siap membantu Anda!
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div>
            <Card className="shadow-lg">
              <CardContent className="p-8">
                <h2 className="text-2xl font-display font-bold text-charcoal mb-6">
                  Kirim Pesan
                </h2>
                
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-charcoal font-medium">Nama Lengkap *</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="Masukkan nama lengkap Anda"
                              className="border-gray-300 focus:ring-rose-gold focus:border-rose-gold"
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-charcoal font-medium">Email *</FormLabel>
                          <FormControl>
                            <Input 
                              type="email"
                              placeholder="nama@email.com"
                              className="border-gray-300 focus:ring-rose-gold focus:border-rose-gold"
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-charcoal font-medium">Nomor Telepon</FormLabel>
                          <FormControl>
                            <Input 
                              type="tel"
                              placeholder="081234567890"
                              className="border-gray-300 focus:ring-rose-gold focus:border-rose-gold"
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="subject"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-charcoal font-medium">Subjek *</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger className="border-gray-300 focus:ring-rose-gold focus:border-rose-gold">
                                <SelectValue placeholder="Pilih subjek pesan" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="Pendaftaran Workshop">Pendaftaran Workshop</SelectItem>
                              <SelectItem value="Konsultasi Bisnis">Konsultasi Bisnis</SelectItem>
                              <SelectItem value="Pertanyaan Umum">Pertanyaan Umum</SelectItem>
                              <SelectItem value="Kerjasama">Kerjasama</SelectItem>
                              <SelectItem value="Keluhan">Keluhan</SelectItem>
                              <SelectItem value="Lainnya">Lainnya</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="message"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-charcoal font-medium">Pesan *</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Tulis pesan Anda di sini..."
                              className="border-gray-300 focus:ring-rose-gold focus:border-rose-gold min-h-[120px]"
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <Button 
                      type="submit" 
                      disabled={isSubmitting}
                      className="w-full bg-rose-gold text-white py-3 text-lg font-semibold hover:bg-charcoal transition-all duration-300"
                    >
                      {isSubmitting ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Mengirim...
                        </>
                      ) : (
                        <>
                          <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                          </svg>
                          Kirim Pesan
                        </>
                      )}
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </div>

          {/* Contact Info & Map */}
          <div className="space-y-8">
            {/* Contact Information */}
            <Card className="bg-soft-pink bg-opacity-30 shadow-lg">
              <CardContent className="p-8">
                <h3 className="text-2xl font-display font-bold text-charcoal mb-6">
                  Informasi Kontak
                </h3>
                <div className="space-y-6">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-rose-gold rounded-full flex items-center justify-center flex-shrink-0">
                      <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-semibold text-charcoal mb-1">Alamat Studio</h4>
                      <p className="text-gray-600 whitespace-pre-line">
                        {contact.address}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-rose-gold rounded-full flex items-center justify-center flex-shrink-0">
                      <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-semibold text-charcoal mb-1">Telepon</h4>
                      <p className="text-gray-600">
                        <a href={`tel:${contact.phone.replace(/\s/g, '')}`} className="hover:text-rose-gold transition-colors duration-300">
                          {contact.phone}
                        </a>
                      </p>
                      <p className="text-sm text-gray-500 mt-1">Senin - Sabtu: 09:00 - 18:00</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-rose-gold rounded-full flex items-center justify-center flex-shrink-0">
                      <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                        <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-semibold text-charcoal mb-1">Email</h4>
                      <p className="text-gray-600">
                        <a href={`mailto:${contact.email}`} className="hover:text-rose-gold transition-colors duration-300">
                          {contact.email}
                        </a>
                      </p>
                      <p className="text-sm text-gray-500 mt-1">Respon dalam 24 jam</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-rose-gold rounded-full flex items-center justify-center flex-shrink-0">
                      <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.690"/>
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-semibold text-charcoal mb-1">WhatsApp</h4>
                      <p className="text-gray-600">
                        <a 
                          href={`https://wa.me/${contact.whatsapp.replace(/\s/g, '').replace('+', '')}?text=Halo%20WeisCandle%2C%20saya%20tertarik%20dengan%20workshop%20lilin%20aromaterapi`} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="hover:text-rose-gold transition-colors duration-300"
                        >
                          {contact.whatsapp}
                        </a>
                      </p>
                      <p className="text-sm text-gray-500 mt-1">Chat langsung dengan kami</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Google Maps */}
            <Card className="overflow-hidden shadow-lg">
              <CardContent className="p-0">
                <div className="relative">
                  <iframe 
                    src={contact.mapEmbed} 
                    width="100%" 
                    height="300" 
                    style={{ border: 0 }}
                    allowFullScreen 
                    loading="lazy" 
                    referrerPolicy="no-referrer-when-downgrade"
                    title="Lokasi WeisCandle Workshop"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
                </div>
                <div className="p-4 bg-white">
                  <h4 className="font-semibold text-charcoal mb-2">Lokasi Workshop</h4>
                  <p className="text-sm text-gray-600">
                    Studio WeisCandle berlokasi strategis di Jakarta Selatan dengan akses mudah 
                    transportasi umum dan area parkir yang luas.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <div className="grid grid-cols-2 gap-4">
              <Button 
                onClick={() => window.open(`https://wa.me/${contact.whatsapp.replace(/\s/g, '').replace('+', '')}?text=Halo%20WeisCandle%2C%20saya%20ingin%20konsultasi%20gratis`, '_blank')}
                className="bg-green-500 text-white hover:bg-green-600 py-6"
              >
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.690"/>
                </svg>
                Chat WA
              </Button>
              <Button 
                onClick={() => window.location.href = `tel:${contact.phone.replace(/\s/g, '')}`}
                className="bg-blue-500 text-white hover:bg-blue-600 py-6"
              >
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                </svg>
                Telepon
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
