import { pgTable, text, serial, boolean, timestamp, varchar, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const blogPosts = pgTable("blog_posts", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  excerpt: text("excerpt").notNull(),
  content: text("content").notNull(),
  imageUrl: text("image_url").notNull(),
  publishedAt: timestamp("published_at").notNull().defaultNow(),
  featured: boolean("featured").notNull().default(false),
});

export const contacts = pgTable("contacts", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  phone: text("phone"),
  subject: text("subject").notNull(),
  message: text("message").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const heroData = pgTable("hero_data", {
  id: serial("id").primaryKey(),
  title1: text("title1").notNull(),
  title2: text("title2").notNull(),
  description: text("description").notNull(),
  imageUrl: text("image_url"),
  imageAlt: text("image_alt").notNull(),
  showButtons: boolean("show_buttons").notNull().default(true),
  showStats: boolean("show_stats").notNull().default(true),
  statsNumber: text("stats_number").notNull(),
  statsLabel: text("stats_label").notNull(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const workshopPackages = pgTable("workshop_packages", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  price: text("price").notNull(),
  duration: text("duration").notNull(),
  features: text("features").notNull(), // JSON string
  isPopular: boolean("is_popular").notNull().default(false),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const workshopCurriculum = pgTable("workshop_curriculum", {
  id: serial("id").primaryKey(),
  step: text("step").notNull(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  duration: text("duration").notNull(),
  order: serial("order").notNull(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const products = pgTable("products", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  category: text("category").notNull(),
  price: text("price").notNull(),
  stock: text("stock").notNull(),
  sold: text("sold").notNull(),
  status: text("status").notNull(), // active, out_of_stock, inactive
  imageUrl: text("image_url"),
  description: text("description"),
  moq: text("moq"), // minimum order quantity
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const contactInfo = pgTable("contact_info", {
  id: serial("id").primaryKey(),
  phone: text("phone").notNull(),
  whatsapp: text("whatsapp").notNull(),
  email: text("email").notNull(),
  website: text("website").notNull(),
  address: text("address").notNull(),
  mapEmbed: text("map_embed").notNull(),
  instagram: text("instagram").notNull(),
  facebook: text("facebook").notNull(),
  tiktok: text("tiktok").notNull(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const gallery = pgTable("gallery", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  description: varchar("description", { length: 500 }),
  imageUrl: varchar("image_url", { length: 1000 }).notNull(),
  isHighlighted: boolean("is_highlighted").default(false),
  category: varchar("category", { length: 100 }).default("workshop"),
  order: integer("order").default(0),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});

export const adminCredentials = pgTable("admin_credentials", {
  id: serial("id").primaryKey(),
  email: text("email").notNull(),
  password: text("password").notNull(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertBlogPostSchema = createInsertSchema(blogPosts).omit({
  id: true,
  publishedAt: true,
});

export const insertContactSchema = createInsertSchema(contacts).omit({
  id: true,
  createdAt: true,
});

export const insertHeroDataSchema = createInsertSchema(heroData).omit({
  id: true,
  updatedAt: true,
});

export const insertWorkshopPackageSchema = createInsertSchema(workshopPackages).omit({
  id: true,
  updatedAt: true,
});

export const insertWorkshopCurriculumSchema = createInsertSchema(workshopCurriculum).omit({
  id: true,
  updatedAt: true,
});

export const insertProductSchema = createInsertSchema(products).omit({
  id: true,
  updatedAt: true,
});

export const insertContactInfoSchema = createInsertSchema(contactInfo).omit({
  id: true,
  updatedAt: true,
});

export const insertGallerySchema = createInsertSchema(gallery).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertAdminCredentialsSchema = createInsertSchema(adminCredentials).omit({
  id: true,
  updatedAt: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type BlogPost = typeof blogPosts.$inferSelect;
export type InsertBlogPost = z.infer<typeof insertBlogPostSchema>;
export type Contact = typeof contacts.$inferSelect;
export type InsertContact = z.infer<typeof insertContactSchema>;
export type HeroData = typeof heroData.$inferSelect;
export type InsertHeroData = z.infer<typeof insertHeroDataSchema>;
export type WorkshopPackage = typeof workshopPackages.$inferSelect;
export type InsertWorkshopPackage = z.infer<typeof insertWorkshopPackageSchema>;
export type WorkshopCurriculum = typeof workshopCurriculum.$inferSelect;
export type InsertWorkshopCurriculum = z.infer<typeof insertWorkshopCurriculumSchema>;
export type Product = typeof products.$inferSelect;
export type InsertProduct = z.infer<typeof insertProductSchema>;
export type ContactInfo = typeof contactInfo.$inferSelect;
export type InsertContactInfo = z.infer<typeof insertContactInfoSchema>;
export type Gallery = typeof gallery.$inferSelect;
export type InsertGallery = z.infer<typeof insertGallerySchema>;
export type AdminCredentials = typeof adminCredentials.$inferSelect;
export type InsertAdminCredentials = z.infer<typeof insertAdminCredentialsSchema>;
