import { type User, type InsertUser, type BlogPost, type InsertBlogPost, type Contact, type InsertContact } from "./schema";

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  getBlogPosts(): Promise<BlogPost[]>;
  getBlogPostBySlug(slug: string): Promise<BlogPost | undefined>;
  createBlogPost(post: InsertBlogPost): Promise<BlogPost>;
  
  createContact(contact: InsertContact): Promise<Contact>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private blogPosts: Map<number, BlogPost>;
  private contacts: Map<number, Contact>;
  private currentUserId: number;
  private currentBlogPostId: number;
  private currentContactId: number;

  constructor() {
    this.users = new Map();
    this.blogPosts = new Map();
    this.contacts = new Map();
    this.currentUserId = 1;
    this.currentBlogPostId = 1;
    this.currentContactId = 1;
    
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
}

export const storage = new MemStorage();
