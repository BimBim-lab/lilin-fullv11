import { type User, type InsertUser, type BlogPost, type InsertBlogPost, type Contact, type InsertContact, type HeroData, type InsertHeroData, type WorkshopPackage, type InsertWorkshopPackage, type WorkshopCurriculum, type InsertWorkshopCurriculum, type Product, type InsertProduct, type ContactInfo, type InsertContactInfo, type Gallery, type InsertGallery } from "./schema";

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
  
  getGallery(): Promise<Gallery[]>;
  getGalleryById(id: number): Promise<Gallery | undefined>;
  createGallery(gallery: InsertGallery): Promise<Gallery>;
  updateGallery(id: number, gallery: Partial<InsertGallery>): Promise<Gallery | undefined>;
  deleteGallery(id: number): Promise<boolean>;
  getHighlightedGallery(): Promise<Gallery[]>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private blogPosts: Map<number, BlogPost>;
  private contacts: Map<number, Contact>;
  private heroData: HeroData;
  private contactInfo: ContactInfo;
  private workshopPackages: WorkshopPackage[];
  private workshopCurriculum: WorkshopCurriculum[];
  private products: Product[];
  private gallery: Gallery[];
  private currentUserId: number;
  private currentBlogPostId: number;
  private currentContactId: number;
  private currentGalleryId: number;

  constructor() {
    this.users = new Map();
    this.blogPosts = new Map();
    this.contacts = new Map();
    this.currentUserId = 1;
    this.currentBlogPostId = 1;
    this.currentContactId = 1;
    this.currentGalleryId = 1;
    
    // Initialize hero data with default values
    this.heroData = {
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

    // Initialize workshop packages
    this.workshopPackages = [
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

    // Initialize workshop curriculum
    this.workshopCurriculum = [
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
    
    // Initialize products
    this.products = [
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
    
    // Initialize contact info with default values
    this.contactInfo = {
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
    
    // Initialize gallery with default values
    this.gallery = [
      {
        id: 1,
        title: "Workshop Candle Making",
        description: "Peserta sedang belajar teknik dasar pembuatan lilin aromaterapi",
        imageUrl: "https://images.unsplash.com/photo-1571781926291-c477ebfd024b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
        isHighlighted: true,
        category: "workshop",
        order: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 2,
        title: "Essential Oil Blending",
        description: "Proses pencampuran essential oil untuk menciptakan aroma signature",
        imageUrl: "https://images.unsplash.com/photo-1585652757173-57de8b1b744b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
        isHighlighted: true,
        category: "workshop",
        order: 2,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 3,
        title: "Finished Products",
        description: "Hasil karya peserta workshop yang siap untuk dibawa pulang",
        imageUrl: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
        isHighlighted: true,
        category: "products",
        order: 3,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 4,
        title: "Studio Workshop",
        description: "Suasana studio workshop yang nyaman dan modern",
        imageUrl: "https://images.unsplash.com/photo-1515377905703-c4788e51af15?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
        isHighlighted: false,
        category: "studio",
        order: 4,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 5,
        title: "Group Workshop",
        description: "Kegiatan workshop dalam grup kecil untuk pembelajaran optimal",
        imageUrl: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
        isHighlighted: false,
        category: "workshop",
        order: 5,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];
    
    // Initialize with sample blog posts
    this.initializeBlogPosts();
  }

  private initializeBlogPosts() {
    const samplePosts: InsertBlogPost[] = [
      {
        title: "5 Essential Oil Terbaik untuk Relaksasi",
        slug: "5-essential-oil-terbaik-untuk-relaksasi",
        excerpt: "Pelajari jenis-jenis essential oil yang paling efektif untuk menciptakan suasana relaksasi dan menenangkan pikiran.",
        content: `
          <p>Aromaterapi telah lama dikenal sebagai salah satu cara alami untuk menciptakan suasana relaksasi. Berikut adalah 5 essential oil terbaik yang dapat membantu Anda mencapai ketenangan pikiran:</p>
          
          <h2>1. Lavender</h2>
          <p>Lavender adalah raja dari essential oil untuk relaksasi. Aroma yang lembut dan menenangkan membuatnya sempurna untuk mengurangi stres dan membantu tidur yang lebih nyenyak.</p>
          
          <h2>2. Chamomile</h2>
          <p>Chamomile memiliki sifat anti-inflammatory dan calming yang luar biasa. Essential oil ini sangat efektif untuk mengurangi kecemasan dan ketegangan.</p>
          
          <h2>3. Bergamot</h2>
          <p>Bergamot memiliki aroma citrus yang segar namun menenangkan. Oil ini membantu meningkatkan mood dan mengurangi perasaan depresi ringan.</p>
          
          <h2>4. Ylang Ylang</h2>
          <p>Ylang ylang dikenal dapat menurunkan tekanan darah dan detak jantung, menciptakan efek relaksasi yang mendalam pada tubuh dan pikiran.</p>
          
          <h2>5. Sandalwood</h2>
          <p>Sandalwood memiliki aroma woody yang hangat dan menenangkan. Oil ini sangat baik untuk meditasi dan menciptakan suasana spiritual yang damai.</p>
          
          <p>Dalam workshop WeisCandle, Anda akan belajar cara memadukan essential oil ini untuk menciptakan lilin aromaterapi yang sempurna sesuai kebutuhan Anda.</p>
        `,
        imageUrl: "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
        featured: true,
      },
      {
        title: "Tips Memilih Wax Berkualitas untuk Lilin",
        slug: "tips-memilih-wax-berkualitas-untuk-lilin",
        excerpt: "Panduan lengkap memilih jenis wax yang tepat untuk menciptakan lilin aromaterapi dengan hasil optimal dan tahan lama.",
        content: `
          <p>Kualitas wax adalah faktor utama yang menentukan hasil akhir lilin aromaterapi Anda. Berikut panduan memilih wax yang tepat:</p>
          
          <h2>Jenis-jenis Wax</h2>
          
          <h3>Soy Wax</h3>
          <p>Wax yang terbuat dari kedelai ini adalah pilihan terbaik untuk pemula. Soy wax mudah digunakan, ramah lingkungan, dan memberikan hasil pembakaran yang bersih.</p>
          
          <h3>Beeswax</h3>
          <p>Lilin lebah alami yang memberikan aroma natural dan waktu bakar yang lama. Cocok untuk mereka yang menginginkan produk 100% natural.</p>
          
          <h3>Coconut Wax</h3>
          <p>Wax premium yang memberikan throw scent yang excellent dan pembakaran yang sangat bersih. Harganya lebih mahal tapi kualitasnya superior.</p>
          
          <h2>Kriteria Wax Berkualitas</h2>
          <ul>
            <li>Tidak menghasilkan asap berlebihan saat dibakar</li>
            <li>Memiliki titik leleh yang konsisten</li>
            <li>Mudah dibersihkan dan tidak meninggalkan residu</li>
            <li>Compatible dengan berbagai jenis essential oil</li>
          </ul>
          
          <p>Di workshop WeisCandle, kami hanya menggunakan wax berkualitas premium untuk memastikan hasil yang optimal.</p>
        `,
        imageUrl: "https://images.unsplash.com/photo-1574361034536-9e0a5b05b6b2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
        featured: false,
      },
      {
        title: "Cara Memulai Bisnis Lilin Aromaterapi",
        slug: "cara-memulai-bisnis-lilin-aromaterapi",
        excerpt: "Strategi dan tips praktis untuk memulai bisnis lilin aromaterapi dari nol hingga sukses mendapatkan pelanggan.",
        content: `
          <p>Bisnis lilin aromaterapi memiliki potensi yang sangat besar di Indonesia. Berikut langkah-langkah untuk memulai bisnis yang menguntungkan:</p>
          
          <h2>1. Riset Pasar</h2>
          <p>Pelajari target market Anda. Lilin aromaterapi diminati oleh berbagai kalangan, mulai dari ibu rumah tangga hingga profesional muda yang mencari relaksasi.</p>
          
          <h2>2. Tentukan Niche</h2>
          <p>Spesialisasi pada kategori tertentu seperti:</p>
          <ul>
            <li>Lilin untuk meditation dan yoga</li>
            <li>Lilin aromaterapi untuk bayi dan anak</li>
            <li>Lilin luxury dengan packaging premium</li>
            <li>Lilin custom untuk gift dan souvenir</li>
          </ul>
          
          <h2>3. Investasi Awal</h2>
          <p>Modal awal yang dibutuhkan berkisar Rp 5-15 juta untuk:</p>
          <ul>
            <li>Peralatan dasar (double boiler, termometer, cetakan)</li>
            <li>Bahan baku (wax, essential oil, wick, container)</li>
            <li>Packaging dan labeling</li>
            <li>Marketing awal</li>
          </ul>
          
          <h2>4. Strategi Marketing</h2>
          <ul>
            <li>Manfaatkan social media Instagram dan TikTok</li>
            <li>Jual melalui marketplace online</li>
            <li>Kerjasama dengan spa dan wellness center</li>
            <li>Ikut bazaar dan craft fair</li>
          </ul>
          
          <h2>5. Pricing Strategy</h2>
          <p>Hitungan dasar: Cost of goods (40%) + Profit margin (60%) = Selling price</p>
          
          <p>Workshop Professional WeisCandle memberikan panduan lengkap business planning untuk memastikan kesuksesan bisnis Anda.</p>
        `,
        imageUrl: "https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
        featured: true,
      }
    ];

    samplePosts.forEach(post => this.createBlogPost(post));
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async getBlogPosts(): Promise<BlogPost[]> {
    return Array.from(this.blogPosts.values()).sort(
      (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
    );
  }

  async getBlogPostBySlug(slug: string): Promise<BlogPost | undefined> {
    return Array.from(this.blogPosts.values()).find(
      (post) => post.slug === slug
    );
  }

  async createBlogPost(insertPost: InsertBlogPost): Promise<BlogPost> {
    const id = this.currentBlogPostId++;
    const post: BlogPost = {
      ...insertPost,
      id,
      publishedAt: new Date(),
      featured: insertPost.featured ?? false,
    };
    this.blogPosts.set(id, post);
    return post;
  }

  async updateBlogPost(id: number, insertPost: InsertBlogPost): Promise<BlogPost | undefined> {
    const existingPost = this.blogPosts.get(id);
    if (!existingPost) {
      return undefined;
    }
    
    const updatedPost: BlogPost = {
      ...existingPost,
      ...insertPost,
      id,
      publishedAt: existingPost.publishedAt, // Keep original publish date
      featured: insertPost.featured ?? false,
    };
    
    this.blogPosts.set(id, updatedPost);
    return updatedPost;
  }

  async deleteBlogPost(id: number): Promise<boolean> {
    return this.blogPosts.delete(id);
  }

  async createContact(insertContact: InsertContact): Promise<Contact> {
    const id = this.currentContactId++;
    const contact: Contact = {
      ...insertContact,
      id,
      createdAt: new Date(),
      phone: insertContact.phone ?? null,
    };
    this.contacts.set(id, contact);
    console.log('New contact received:', contact);
    return contact;
  }

  async getHeroData(): Promise<HeroData> {
    return this.heroData;
  }

  async updateHeroData(data: Partial<InsertHeroData>): Promise<HeroData> {
    this.heroData = {
      ...this.heroData,
      ...data,
      updatedAt: new Date()
    };
    console.log('Hero data updated:', this.heroData);
    return this.heroData;
  }

  async getWorkshopPackages(): Promise<WorkshopPackage[]> {
    return this.workshopPackages;
  }

  async updateWorkshopPackages(packages: InsertWorkshopPackage[]): Promise<WorkshopPackage[]> {
    // Update existing packages and add new ones
    this.workshopPackages = packages.map((pkg, index) => ({
      ...pkg,
      id: index + 1,
      isPopular: pkg.isPopular ?? false,
      updatedAt: new Date()
    }));
    console.log('Workshop packages updated:', this.workshopPackages);
    return this.workshopPackages;
  }

  async getWorkshopCurriculum(): Promise<WorkshopCurriculum[]> {
    return this.workshopCurriculum.sort((a, b) => a.order - b.order);
  }

  async updateWorkshopCurriculum(curriculum: InsertWorkshopCurriculum[]): Promise<WorkshopCurriculum[]> {
    // Update existing curriculum and add new ones
    this.workshopCurriculum = curriculum.map((curr, index) => ({
      ...curr,
      id: index + 1,
      order: curr.order ?? index + 1,
      updatedAt: new Date()
    }));
    console.log('Workshop curriculum updated:', this.workshopCurriculum);
    return this.workshopCurriculum;
  }

  async getProducts(): Promise<Product[]> {
    return this.products;
  }

  async updateProducts(products: InsertProduct[]): Promise<Product[]> {
    // Update existing products and add new ones
    this.products = products.map((product, index) => ({
      ...product,
      id: index + 1,
      description: product.description ?? null,
      imageUrl: product.imageUrl ?? null,
      moq: product.moq ?? null,
      updatedAt: new Date()
    }));
    console.log('Products updated:', this.products);
    return this.products;
  }

  async getContactInfo(): Promise<ContactInfo> {
    return this.contactInfo;
  }

  async updateContactInfo(data: InsertContactInfo): Promise<ContactInfo> {
    this.contactInfo = {
      ...this.contactInfo,
      ...data,
      updatedAt: new Date()
    };
    console.log('Contact info updated:', this.contactInfo);
    return this.contactInfo;
  }

  async getGallery(): Promise<Gallery[]> {
    return this.gallery.sort((a, b) => (a.order || 0) - (b.order || 0));
  }

  async getGalleryById(id: number): Promise<Gallery | undefined> {
    return this.gallery.find(item => item.id === id);
  }

  async createGallery(galleryData: InsertGallery): Promise<Gallery> {
    const newGallery: Gallery = {
      id: this.currentGalleryId++,
      title: galleryData.title,
      description: galleryData.description ?? null,
      imageUrl: galleryData.imageUrl,
      isHighlighted: galleryData.isHighlighted ?? null,
      category: galleryData.category ?? null,
      order: galleryData.order ?? null,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    this.gallery.push(newGallery);
    console.log('Gallery item created:', newGallery);
    return newGallery;
  }

  async updateGallery(id: number, galleryData: Partial<InsertGallery>): Promise<Gallery | undefined> {
    const index = this.gallery.findIndex(item => item.id === id);
    if (index === -1) return undefined;

    this.gallery[index] = {
      ...this.gallery[index],
      ...galleryData,
      updatedAt: new Date()
    };
    
    console.log('Gallery item updated:', this.gallery[index]);
    return this.gallery[index];
  }

  async deleteGallery(id: number): Promise<boolean> {
    const initialLength = this.gallery.length;
    this.gallery = this.gallery.filter(item => item.id !== id);
    
    if (this.gallery.length < initialLength) {
      console.log('Gallery item deleted:', id);
      return true;
    }
    return false;
  }

  async getHighlightedGallery(): Promise<Gallery[]> {
    return this.gallery
      .filter(item => item.isHighlighted)
      .sort((a, b) => (a.order || 0) - (b.order || 0))
      .slice(0, 3);
  }
}

export const storage = new MemStorage();
