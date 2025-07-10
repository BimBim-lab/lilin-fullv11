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

// Type definitions
export type InsertUser = z.infer<typeof insertUserSchema>;
export type InsertBlogPost = z.infer<typeof insertBlogPostSchema>;
export type InsertContact = z.infer<typeof insertContactSchema>;

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
