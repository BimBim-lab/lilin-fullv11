import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';
import { 
  contacts, 
  blogPosts, 
  workshopPackages, 
  products, 
  gallery, 
  contactInfo,
  heroData
} from "./schema";
import { eq, desc } from 'drizzle-orm';
import type { 
  InsertContact, 
  InsertBlogPost, 
  InsertWorkshopPackage, 
  InsertProduct, 
  InsertGallery, 
  InsertContactInfo,
  ContactInfo,
  BlogPost,
  WorkshopPackage,
  Product,
  Gallery,
  Contact
} from "./schema";

// Database connection
const sql = neon(process.env.DATABASE_URL!);
const db = drizzle(sql);

interface HeroData {
  title1: string;
  title2: string;
  description: string;
  imageUrl?: string | null;
  imageAlt: string;
  showButtons: boolean;
  showStats: boolean;
  statsNumber: string;
  statsLabel: string;
}

export interface IStorage {
  // Contact methods
  getContacts(): Promise<Contact[]>;
  addContact(contact: InsertContact): Promise<Contact>;
  
  // Blog methods
  getBlogPosts(): Promise<BlogPost[]>;
  getBlogPost(slug: string): Promise<BlogPost | null>;
  addBlogPost(post: InsertBlogPost): Promise<BlogPost>;
  updateBlogPost(id: number, post: Partial<InsertBlogPost>): Promise<BlogPost>;
  deleteBlogPost(id: number): Promise<void>;
  
  // Workshop methods
  getWorkshopPackages(): Promise<WorkshopPackage[]>;
  addWorkshopPackage(pkg: InsertWorkshopPackage): Promise<WorkshopPackage>;
  updateWorkshopPackage(id: number, pkg: Partial<InsertWorkshopPackage>): Promise<WorkshopPackage>;
  deleteWorkshopPackage(id: number): Promise<void>;
  
  // Product methods
  getProducts(): Promise<Product[]>;
  addProduct(product: InsertProduct): Promise<Product>;
  updateProduct(id: number, product: Partial<InsertProduct>): Promise<Product>;
  deleteProduct(id: number): Promise<void>;
  
  // Gallery methods
  getGallery(): Promise<Gallery[]>;
  getHighlightedGallery(): Promise<Gallery[]>;
  addGalleryItem(item: InsertGallery): Promise<Gallery>;
  updateGalleryItem(id: number, item: Partial<InsertGallery>): Promise<Gallery>;
  deleteGalleryItem(id: number): Promise<void>;
  
  // Contact Info methods
  getContactInfo(): Promise<ContactInfo>;
  updateContactInfo(info: InsertContactInfo): Promise<ContactInfo>;
  
  // Hero Data methods
  getHeroData(): Promise<HeroData>;
  updateHeroData(data: Partial<HeroData>): Promise<HeroData>;
}

export class DatabaseStorage implements IStorage {
  async getContacts(): Promise<Contact[]> {
    return await db.select().from(contacts).orderBy(desc(contacts.createdAt));
  }

  async addContact(contact: InsertContact): Promise<Contact> {
    const [newContact] = await db.insert(contacts).values(contact).returning();
    return newContact;
  }

  async getBlogPosts(): Promise<BlogPost[]> {
    return await db.select().from(blogPosts).orderBy(desc(blogPosts.publishedAt));
  }

  async getBlogPost(slug: string): Promise<BlogPost | null> {
    const [post] = await db.select().from(blogPosts).where(eq(blogPosts.slug, slug));
    return post || null;
  }

  async addBlogPost(post: InsertBlogPost): Promise<BlogPost> {
    const [newPost] = await db.insert(blogPosts).values(post).returning();
    return newPost;
  }

  async updateBlogPost(id: number, post: Partial<InsertBlogPost>): Promise<BlogPost> {
    const [updatedPost] = await db.update(blogPosts)
      .set(post)
      .where(eq(blogPosts.id, id))
      .returning();
    return updatedPost;
  }

  async deleteBlogPost(id: number): Promise<void> {
    await db.delete(blogPosts).where(eq(blogPosts.id, id));
  }

  async getWorkshopPackages(): Promise<WorkshopPackage[]> {
    return await db.select().from(workshopPackages);
  }

  async addWorkshopPackage(pkg: InsertWorkshopPackage): Promise<WorkshopPackage> {
    const [newPackage] = await db.insert(workshopPackages).values(pkg).returning();
    return newPackage;
  }

  async updateWorkshopPackage(id: number, pkg: Partial<InsertWorkshopPackage>): Promise<WorkshopPackage> {
    const [updatedPackage] = await db.update(workshopPackages)
      .set(pkg)
      .where(eq(workshopPackages.id, id))
      .returning();
    return updatedPackage;
  }

  async deleteWorkshopPackage(id: number): Promise<void> {
    await db.delete(workshopPackages).where(eq(workshopPackages.id, id));
  }

  async getProducts(): Promise<Product[]> {
    return await db.select().from(products);
  }

  async addProduct(product: InsertProduct): Promise<Product> {
    const [newProduct] = await db.insert(products).values(product).returning();
    return newProduct;
  }

  async updateProduct(id: number, product: Partial<InsertProduct>): Promise<Product> {
    const [updatedProduct] = await db.update(products)
      .set(product)
      .where(eq(products.id, id))
      .returning();
    return updatedProduct;
  }

  async deleteProduct(id: number): Promise<void> {
    await db.delete(products).where(eq(products.id, id));
  }

  async getGallery(): Promise<Gallery[]> {
    return await db.select().from(gallery).orderBy(desc(gallery.createdAt));
  }

  async getHighlightedGallery(): Promise<Gallery[]> {
    return await db.select().from(gallery)
      .where(eq(gallery.isHighlighted, true))
      .orderBy(desc(gallery.createdAt));
  }

  async addGalleryItem(item: InsertGallery): Promise<Gallery> {
    const [newItem] = await db.insert(gallery).values(item).returning();
    return newItem;
  }

  async updateGalleryItem(id: number, item: Partial<InsertGallery>): Promise<Gallery> {
    const [updatedItem] = await db.update(gallery)
      .set(item)
      .where(eq(gallery.id, id))
      .returning();
    return updatedItem;
  }

  async deleteGalleryItem(id: number): Promise<void> {
    await db.delete(gallery).where(eq(gallery.id, id));
  }

  async getContactInfo(): Promise<ContactInfo> {
    const [info] = await db.select().from(contactInfo).limit(1);
    
    if (!info) {
      // Return default contact info if none exists
      const defaultInfo: InsertContactInfo = {
        phone: "+62 812-3456-7890",
        whatsapp: "+62 812-3456-7890",
        email: "info@weiscandle.com",
        website: "https://weiscandle.com",
        address: "Jl. Aromaterapi No. 123, Jakarta Selatan 12345",
        mapEmbed: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3965.7461",
        instagram: "https://instagram.com/weiscandle",
        facebook: "https://facebook.com/weiscandle",
        tiktok: "https://tiktok.com/@weiscandle"
      };
      
      const [newInfo] = await db.insert(contactInfo).values(defaultInfo).returning();
      return newInfo;
    }
    
    return info;
  }

  async updateContactInfo(info: InsertContactInfo): Promise<ContactInfo> {
    // First, try to update existing record
    const existing = await db.select().from(contactInfo).limit(1);
    
    if (existing.length > 0) {
      const [updatedInfo] = await db.update(contactInfo)
        .set(info)
        .where(eq(contactInfo.id, existing[0].id))
        .returning();
      return updatedInfo;
    } else {
      // Insert new record if none exists
      const [newInfo] = await db.insert(contactInfo)
        .values(info)
        .returning();
      return newInfo;
    }
  }

  async getHeroData(): Promise<HeroData> {
    const [data] = await db.select().from(heroData).limit(1);
    
    if (!data) {
      // Return default hero data if none exists
      const defaultHero = {
        title1: "Workshop Lilin Aromaterapi oleh",
        title2: "WeisCandle",
        description: "Pelajari seni membuat lilin aromaterapi yang menenangkan dengan teknik profesional dan bahan berkualitas tinggi.",
        imageUrl: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=600",
        imageAlt: "Aromatherapy candle making workshop setup",
        showButtons: true,
        showStats: true,
        statsNumber: "500+",
        statsLabel: "Peserta Puas"
      };
      
      const [newData] = await db.insert(heroData).values(defaultHero).returning();
      return {
        title1: newData.title1,
        title2: newData.title2,
        description: newData.description,
        imageUrl: newData.imageUrl || undefined,
        imageAlt: newData.imageAlt,
        showButtons: newData.showButtons,
        showStats: newData.showStats,
        statsNumber: newData.statsNumber,
        statsLabel: newData.statsLabel
      };
    }
    
    return {
      title1: data.title1,
      title2: data.title2,
      description: data.description,
      imageUrl: data.imageUrl || undefined,
      imageAlt: data.imageAlt,
      showButtons: data.showButtons,
      showStats: data.showStats,
      statsNumber: data.statsNumber,
      statsLabel: data.statsLabel
    };
  }

  async updateHeroData(data: Partial<HeroData>): Promise<HeroData> {
    // First, try to update existing record
    const existing = await db.select().from(heroData).limit(1);
    
    if (existing.length > 0) {
      const [updatedData] = await db.update(heroData)
        .set(data)
        .where(eq(heroData.id, existing[0].id))
        .returning();
      return {
        title1: updatedData.title1,
        title2: updatedData.title2,
        description: updatedData.description,
        imageUrl: updatedData.imageUrl || undefined,
        imageAlt: updatedData.imageAlt,
        showButtons: updatedData.showButtons,
        showStats: updatedData.showStats,
        statsNumber: updatedData.statsNumber,
        statsLabel: updatedData.statsLabel
      };
    } else {
      // Insert new record if none exists
      const defaultData = {
        title1: "Workshop Lilin Aromaterapi oleh",
        title2: "WeisCandle",
        description: "Pelajari seni membuat lilin aromaterapi yang menenangkan dengan teknik profesional dan bahan berkualitas tinggi.",
        imageUrl: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=600",
        imageAlt: "Aromatherapy candle making workshop setup",
        showButtons: true,
        showStats: true,
        statsNumber: "500+",
        statsLabel: "Peserta Puas",
        ...data
      };
      
      const [newData] = await db.insert(heroData).values(defaultData).returning();
      return {
        title1: newData.title1,
        title2: newData.title2,
        description: newData.description,
        imageUrl: newData.imageUrl || undefined,
        imageAlt: newData.imageAlt,
        showButtons: newData.showButtons,
        showStats: newData.showStats,
        statsNumber: newData.statsNumber,
        statsLabel: newData.statsLabel
      };
    }
  }
}

// Export singleton instance
export const storage = new DatabaseStorage();
