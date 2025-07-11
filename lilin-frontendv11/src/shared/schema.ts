import { z } from "zod";

// Frontend-only schema definitions (no database-specific imports)
export const insertContactSchema = z.object({
  name: z.string().min(1, "Nama wajib diisi"),
  email: z.string().email("Email tidak valid"),
  phone: z.string().optional(),
  subject: z.string().min(1, "Subject wajib diisi"),
  message: z.string().min(1, "Pesan wajib diisi"),
});

export const insertUserSchema = z.object({
  username: z.string().min(1, "Username wajib diisi"),
  password: z.string().min(6, "Password minimal 6 karakter"),
});

export const insertBlogPostSchema = z.object({
  title: z.string().min(1, "Judul wajib diisi"),
  slug: z.string().min(1, "Slug wajib diisi"),
  excerpt: z.string().min(1, "Excerpt wajib diisi"),
  content: z.string().min(1, "Konten wajib diisi"),
  imageUrl: z.string().url("URL gambar tidak valid"),
  featured: z.boolean().default(false),
});

export const insertProductSchema = z.object({
  name: z.string().min(1, "Nama produk wajib diisi"),
  category: z.string().min(1, "Kategori wajib diisi"),
  price: z.string().min(1, "Harga wajib diisi"),
  stock: z.string().min(1, "Stok wajib diisi"),
  sold: z.string().min(1, "Terjual wajib diisi"),
  status: z.string().min(1, "Status wajib diisi"),
  imageUrl: z.string().url().optional(),
  description: z.string().optional(),
  moq: z.string().optional(),
});

export const insertContactInfoSchema = z.object({
  phone: z.string().min(1, "Nomor telepon wajib diisi"),
  whatsapp: z.string().min(1, "WhatsApp wajib diisi"),
  email: z.string().email("Email tidak valid"),
  website: z.string().url("URL website tidak valid"),
  address: z.string().min(1, "Alamat wajib diisi"),
  mapEmbed: z.string().url("URL Google Maps tidak valid"),
  instagram: z.string().min(1, "Instagram wajib diisi"),
  facebook: z.string().min(1, "Facebook wajib diisi"),
  tiktok: z.string().min(1, "TikTok wajib diisi"),
});

// Type definitions
export type InsertUser = z.infer<typeof insertUserSchema>;
export type InsertBlogPost = z.infer<typeof insertBlogPostSchema>;
export type InsertContact = z.infer<typeof insertContactSchema>;
export type InsertProduct = z.infer<typeof insertProductSchema>;
export type InsertContactInfo = z.infer<typeof insertContactInfoSchema>;

export type User = {
  id: number;
  username: string;
  password: string;
};

export type BlogPost = {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  imageUrl: string;
  publishedAt: string;
  featured: boolean;
};

export type Contact = {
  id: number;
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  createdAt: string;
};

export type Product = {
  id: number;
  name: string;
  category: string;
  price: string;
  stock: string;
  sold: string;
  status: string;
  imageUrl?: string;
  description?: string;
  moq?: string;
  updatedAt: string;
};

export type ContactInfo = {
  id: number;
  phone: string;
  whatsapp: string;
  email: string;
  website: string;
  address: string;
  mapEmbed: string;
  instagram: string;
  facebook: string;
  tiktok: string;
  updatedAt: string;
};
