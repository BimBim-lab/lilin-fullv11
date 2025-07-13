import { writeFileSync, readFileSync, existsSync } from 'fs';
import { join } from 'path';
import { type User, type InsertUser, type BlogPost, type InsertBlogPost, type Contact, type InsertContact, type HeroData, type InsertHeroData, type WorkshopPackage, type InsertWorkshopPackage, type WorkshopCurriculum, type InsertWorkshopCurriculum, type Product, type InsertProduct, type ContactInfo, type InsertContactInfo } from "./schema";

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  getBlogPosts(): Promise<BlogPost[]>;
  getBlogPostBySlug(slug: string): Promise<BlogPost | undefined>;
  createBlogPost(post: InsertBlogPost): Promise<BlogPost>;
  updateBlogPost(id: number, post: InsertBlogPost): Promise<BlogPost | undefined>;
  deleteBlogPost(id: number): Promise<boolean>;
  
  createContact(contact: InsertContact): Promise<Contact>;
  
  getContactInfo(): Promise<ContactInfo>;
  updateContactInfo(data: InsertContactInfo): Promise<ContactInfo>;
  
  getHeroData(): Promise<HeroData>;
  updateHeroData(data: Partial<InsertHeroData>): Promise<HeroData>;
  
  getWorkshopPackages(): Promise<WorkshopPackage[]>;
  updateWorkshopPackages(packages: InsertWorkshopPackage[]): Promise<WorkshopPackage[]>;
  
  getWorkshopCurriculum(): Promise<WorkshopCurriculum[]>;
  updateWorkshopCurriculum(curriculum: InsertWorkshopCurriculum[]): Promise<WorkshopCurriculum[]>;
  
  getProducts(): Promise<Product[]>;
  updateProducts(products: InsertProduct[]): Promise<Product[]>;
}

interface StorageData {
  users: Map<number, User>;
  blogPosts: Map<number, BlogPost>;
  contacts: Map<number, Contact>;
  heroData: HeroData;
  contactInfo: ContactInfo;
  workshopPackages: WorkshopPackage[];
  workshopCurriculum: WorkshopCurriculum[];
  products: Product[];
  currentUserId: number;
  currentBlogPostId: number;
  currentContactId: number;
}

export class FileStorage implements IStorage {
  private dataFile: string;
  private data!: StorageData;

  constructor() {
    // Menggunakan path yang persistent di Railway dan lokal
    const dataDir = process.env.RAILWAY_VOLUME_MOUNT_PATH || process.cwd();
    this.dataFile = join(dataDir, 'data.json');
    console.log('Data file path:', this.dataFile);
    this.loadData();
  }

  private loadData() {
    if (existsSync(this.dataFile)) {
      try {
        const fileData = JSON.parse(readFileSync(this.dataFile, 'utf-8'));
        this.data = {
          users: new Map(fileData.users || []),
          blogPosts: new Map(fileData.blogPosts || []),
          contacts: new Map(fileData.contacts || []),
          heroData: fileData.heroData || this.getDefaultHeroData(),
          contactInfo: fileData.contactInfo || this.getDefaultContactInfo(),
          workshopPackages: fileData.workshopPackages || this.getDefaultWorkshopPackages(),
          workshopCurriculum: fileData.workshopCurriculum || this.getDefaultWorkshopCurriculum(),
          products: fileData.products || this.getDefaultProducts(),
          currentUserId: fileData.currentUserId || 1,
          currentBlogPostId: fileData.currentBlogPostId || 1,
          currentContactId: fileData.currentContactId || 1,
        };
        console.log('Data loaded from file');
      } catch (error) {
        console.error('Error loading data file, using defaults:', error);
        this.initializeDefaults();
      }
    } else {
      console.log('No data file found, initializing with defaults');
      this.initializeDefaults();
    }
  }

  private saveData() {
    try {
      const dataToSave = {
        users: Array.from(this.data.users.entries()),
        blogPosts: Array.from(this.data.blogPosts.entries()),
        contacts: Array.from(this.data.contacts.entries()),
        heroData: this.data.heroData,
        contactInfo: this.data.contactInfo,
        workshopPackages: this.data.workshopPackages,
        workshopCurriculum: this.data.workshopCurriculum,
        products: this.data.products,
        currentUserId: this.data.currentUserId,
        currentBlogPostId: this.data.currentBlogPostId,
        currentContactId: this.data.currentContactId,
      };
      writeFileSync(this.dataFile, JSON.stringify(dataToSave, null, 2));
      console.log('Data saved to file');
    } catch (error) {
      console.error('Error saving data file:', error);
    }
  }

  private initializeDefaults() {
    this.data = {
      users: new Map(),
      blogPosts: new Map(),
      contacts: new Map(),
      currentUserId: 1,
      currentBlogPostId: 1,
      currentContactId: 1,
      heroData: this.getDefaultHeroData(),
      contactInfo: this.getDefaultContactInfo(),
      workshopPackages: this.getDefaultWorkshopPackages(),
      workshopCurriculum: this.getDefaultWorkshopCurriculum(),
      products: this.getDefaultProducts(),
    };
    this.initializeBlogPosts();
    this.saveData();
  }

  private getDefaultHeroData(): HeroData {
    return {
      id: 1,
      title1: "Workshop Lilin Aromaterapi oleh",
      title2: "WeisCandle",
      description: "Pelajari seni membuat lilin aromaterapi yang menenangkan dengan teknik profesional dan bahan berkualitas tinggi.",
      imageUrl: "/images/hero-default.jpg",
      imageAlt: "Aromatherapy candle making workshop setup",
      showButtons: true,
      showStats: true,
      statsNumber: "500+",
      statsLabel: "Peserta Puas",
      updatedAt: new Date()
    };
  }

  private getDefaultContactInfo(): ContactInfo {
    return {
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
      updatedAt: new Date()
    };
  }

  private getDefaultWorkshopPackages(): WorkshopPackage[] {
    return [
      {
        id: 1,
        name: "Workshop Basic",
        description: "Untuk pemula yang ingin belajar dasar",
        price: "Rp 350.000",
        duration: "Durasi 3 jam",
        features: JSON.stringify([
          "Membuat 2 lilin aromaterapi",
          "Materi & tools disediakan",
          "Sertifikat keikutsertaan"
        ]),
        isPopular: false,
        updatedAt: new Date()
      },
      {
        id: 2,
        name: "Workshop Premium",
        description: "Untuk yang ingin belajar lebih mendalam",
        price: "Rp 550.000",
        duration: "Durasi 5 jam",
        features: JSON.stringify([
          "Membuat 4 lilin aromaterapi",
          "Teknik advanced blending",
          "Starter kit take home",
          "Konsultasi 1 bulan"
        ]),
        isPopular: true,
        updatedAt: new Date()
      },
      {
        id: 3,
        name: "Workshop Pro",
        description: "Untuk calon entrepreneur",
        price: "Rp 750.000",
        duration: "Durasi 8 jam (2 hari)",
        features: JSON.stringify([
          "Membuat 6 lilin aromaterapi",
          "Business planning session",
          "Complete starter kit",
          "Mentoring 3 bulan"
        ]),
        isPopular: false,
        updatedAt: new Date()
      }
    ];
  }

  private getDefaultWorkshopCurriculum(): WorkshopCurriculum[] {
    return [
      {
        id: 1,
        step: "1",
        title: "Pengenalan Aromaterapi",
        description: "Memahami sejarah aromaterapi, manfaat kesehatan, jenis-jenis essential oil, dan properti terapeutiknya.",
        duration: "45 menit",
        order: 1,
        updatedAt: new Date()
      },
      {
        id: 2,
        step: "2",
        title: "Pemilihan Bahan & Alat",
        description: "Mengenal berbagai jenis wax (soy, beeswax, coconut), memilih wick yang tepat, dan essential oil berkualitas.",
        duration: "30 menit",
        order: 2,
        updatedAt: new Date()
      },
      {
        id: 3,
        step: "3",
        title: "Teknik Blending",
        description: "Mempelajari cara mencampur essential oil, menghitung persentase, dan menciptakan signature scent.",
        duration: "60 menit",
        order: 3,
        updatedAt: new Date()
      },
      {
        id: 4,
        step: "4",
        title: "Proses Pembuatan",
        description: "Praktik langsung melting wax, mixing essential oil, pouring, dan finishing dengan teknik profesional.",
        duration: "90 menit",
        order: 4,
        updatedAt: new Date()
      },
      {
        id: 5,
        step: "5",
        title: "Quality Control",
        description: "Memahami standar kualitas, troubleshooting masalah umum, dan tips untuk hasil optimal.",
        duration: "30 menit",
        order: 5,
        updatedAt: new Date()
      },
      {
        id: 6,
        step: "6",
        title: "Packaging & Branding",
        description: "Teknik packaging yang menarik, labeling produk, dan strategi branding untuk penjualan.",
        duration: "45 menit",
        order: 6,
        updatedAt: new Date()
      }
    ];
  }

  private getDefaultProducts(): Product[] {
    return [
      {
        id: 1,
        name: "Lilin Aromaterapi Lavender",
        category: "Aromaterapi",
        price: "Rp 45.000",
        stock: "24",
        sold: "156",
        status: "active",
        imageUrl: "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300",
        description: "Lilin aromaterapi dengan essential oil lavender murni untuk relaksasi dan tidur yang nyenyak",
        moq: "50 pcs",
        updatedAt: new Date()
      },
      {
        id: 2,
        name: "Lilin Aromaterapi Eucalyptus",
        category: "Aromaterapi",
        price: "Rp 48.000",
        stock: "18",
        sold: "132",
        status: "active",
        imageUrl: "https://images.unsplash.com/photo-1574361034536-9e0a5b05b6b2?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300",
        description: "Lilin aromaterapi eucalyptus untuk membantu pernapasan dan melegakan hidung tersumbat",
        moq: "50 pcs",
        updatedAt: new Date()
      },
      {
        id: 3,
        name: "Lilin Aromaterapi Rose",
        category: "Aromaterapi",
        price: "Rp 52.000",
        stock: "0",
        sold: "89",
        status: "out_of_stock",
        imageUrl: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300",
        description: "Lilin aromaterapi dengan aroma rose yang romantis dan menenangkan",
        moq: "50 pcs",
        updatedAt: new Date()
      },
      {
        id: 4,
        name: "Starter Kit Lilin DIY",
        category: "DIY Kit",
        price: "Rp 125.000",
        stock: "15",
        sold: "67",
        status: "active",
        imageUrl: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300",
        description: "Paket lengkap untuk membuat lilin aromaterapi sendiri di rumah",
        moq: "20 sets",
        updatedAt: new Date()
      }
    ];
  }

  private initializeBlogPosts() {
    const samplePosts: InsertBlogPost[] = [
      {
        title: "Manfaat Aromaterapi untuk Kesehatan Mental",
        slug: "manfaat-aromaterapi-kesehatan-mental",
        content: "Aromaterapi telah terbukti memiliki berbagai manfaat untuk kesehatan mental. Essential oil seperti lavender dapat membantu mengurangi stres dan anxiety...",
        excerpt: "Pelajari bagaimana aromaterapi dapat membantu meningkatkan kesehatan mental dan mengurangi stres dalam kehidupan sehari-hari.",
        imageUrl: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400",
        featured: false
      },
      {
        title: "Cara Memilih Essential Oil yang Tepat",
        slug: "cara-memilih-essential-oil-tepat",
        content: "Memilih essential oil yang tepat sangat penting untuk mendapatkan manfaat maksimal dari aromaterapi. Berikut panduan lengkapnya...",
        excerpt: "Panduan lengkap untuk memilih essential oil berkualitas tinggi sesuai dengan kebutuhan aromaterapi Anda.",
        imageUrl: "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400",
        featured: true
      },
      {
        title: "Sejarah dan Tradisi Pembuatan Lilin",
        slug: "sejarah-tradisi-pembuatan-lilin",
        content: "Pembuatan lilin memiliki sejarah panjang yang dimulai dari peradaban kuno. Mari kita telusuri perjalanan evolusi lilin dari masa ke masa...",
        excerpt: "Jelajahi sejarah menarik pembuatan lilin dari zaman kuno hingga teknik modern yang digunakan saat ini.",
        imageUrl: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400",
        featured: false
      }
    ];

    samplePosts.forEach(post => {
      const blogPost: BlogPost = {
        id: this.data.currentBlogPostId++,
        ...post,
        featured: post.featured ?? false,
        publishedAt: new Date()
      };
      this.data.blogPosts.set(blogPost.id, blogPost);
    });
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.data.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    for (const user of this.data.users.values()) {
      if (user.username === username) {
        return user;
      }
    }
    return undefined;
  }

  async createUser(user: InsertUser): Promise<User> {
    const newUser: User = {
      id: this.data.currentUserId++,
      ...user
    };
    this.data.users.set(newUser.id, newUser);
    this.saveData();
    return newUser;
  }

  // Blog methods
  async getBlogPosts(): Promise<BlogPost[]> {
    return Array.from(this.data.blogPosts.values()).sort((a, b) => 
      new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
    );
  }

  async getBlogPostBySlug(slug: string): Promise<BlogPost | undefined> {
    for (const post of this.data.blogPosts.values()) {
      if (post.slug === slug) {
        return post;
      }
    }
    return undefined;
  }

  async createBlogPost(post: InsertBlogPost): Promise<BlogPost> {
    const newPost: BlogPost = {
      id: this.data.currentBlogPostId++,
      ...post,
      featured: post.featured ?? false,
      publishedAt: new Date()
    };
    this.data.blogPosts.set(newPost.id, newPost);
    this.saveData();
    return newPost;
  }

  async updateBlogPost(id: number, post: InsertBlogPost): Promise<BlogPost | undefined> {
    const existingPost = this.data.blogPosts.get(id);
    if (!existingPost) {
      return undefined;
    }

    const updatedPost: BlogPost = {
      ...existingPost,
      ...post
    };
    this.data.blogPosts.set(id, updatedPost);
    this.saveData();
    return updatedPost;
  }

  async deleteBlogPost(id: number): Promise<boolean> {
    const deleted = this.data.blogPosts.delete(id);
    if (deleted) {
      this.saveData();
    }
    return deleted;
  }

  // Contact methods
  async createContact(contact: InsertContact): Promise<Contact> {
    const newContact: Contact = {
      id: this.data.currentContactId++,
      ...contact,
      phone: contact.phone ?? null,
      createdAt: new Date()
    };
    this.data.contacts.set(newContact.id, newContact);
    this.saveData();
    return newContact;
  }

  async getContactInfo(): Promise<ContactInfo> {
    return this.data.contactInfo;
  }

  async updateContactInfo(data: InsertContactInfo): Promise<ContactInfo> {
    this.data.contactInfo = {
      ...this.data.contactInfo,
      ...data,
      updatedAt: new Date()
    };
    this.saveData();
    console.log('Contact info updated:', this.data.contactInfo);
    return this.data.contactInfo;
  }

  // Hero methods
  async getHeroData(): Promise<HeroData> {
    return this.data.heroData;
  }

  async updateHeroData(data: Partial<InsertHeroData>): Promise<HeroData> {
    this.data.heroData = {
      ...this.data.heroData,
      ...data,
      updatedAt: new Date()
    };
    this.saveData();
    console.log('Hero data updated:', this.data.heroData);
    return this.data.heroData;
  }

  // Workshop methods
  async getWorkshopPackages(): Promise<WorkshopPackage[]> {
    return this.data.workshopPackages;
  }

  async updateWorkshopPackages(packages: InsertWorkshopPackage[]): Promise<WorkshopPackage[]> {
    this.data.workshopPackages = packages.map((pkg, index) => ({
      ...pkg,
      id: index + 1,
      isPopular: pkg.isPopular ?? false,
      updatedAt: new Date()
    }));
    this.saveData();
    console.log('Workshop packages updated:', this.data.workshopPackages);
    return this.data.workshopPackages;
  }

  async getWorkshopCurriculum(): Promise<WorkshopCurriculum[]> {
    return this.data.workshopCurriculum;
  }

  async updateWorkshopCurriculum(curriculum: InsertWorkshopCurriculum[]): Promise<WorkshopCurriculum[]> {
    this.data.workshopCurriculum = curriculum.map((item, index) => ({
      ...item,
      id: index + 1,
      order: item.order ?? index + 1,
      updatedAt: new Date()
    }));
    this.saveData();
    console.log('Workshop curriculum updated:', this.data.workshopCurriculum);
    return this.data.workshopCurriculum;
  }

  // Product methods
  async getProducts(): Promise<Product[]> {
    return this.data.products;
  }

  async updateProducts(products: InsertProduct[]): Promise<Product[]> {
    // Update existing products and add new ones
    this.data.products = products.map((product, index) => ({
      ...product,
      id: index + 1,
      description: product.description ?? null,
      imageUrl: product.imageUrl ?? null,
      moq: product.moq ?? null,
      updatedAt: new Date()
    }));
    this.saveData();
    console.log('Products updated and saved to file:', this.data.products);
    return this.data.products;
  }
}

export const storage = new FileStorage();
