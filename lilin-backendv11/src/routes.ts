import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./fileStorage";
import { insertContactSchema, insertBlogPostSchema, insertContactInfoSchema } from "./schema";
import { emailService } from "./emailService";
import { authMiddleware, JWT_SECRET } from "./authMiddleware";
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Hardcoded admin credentials (in production, store in database with hashed password)
  const ADMIN_CREDENTIALS = {
    email: 'admin@weiscandle.com',
    password: await bcrypt.hash('admin123', 10) // Hash the password
  };

  // Admin Login endpoint
  app.post("/api/admin/login", async (req, res) => {
    try {
      const { email, password } = req.body;

      // Validate input
      if (!email || !password) {
        return res.status(400).json({ 
          message: "Email and password are required" 
        });
      }

      // Check credentials
      const isEmailValid = email === ADMIN_CREDENTIALS.email;
      const isPasswordValid = await bcrypt.compare(password, ADMIN_CREDENTIALS.password);

      if (!isEmailValid || !isPasswordValid) {
        return res.status(401).json({ 
          message: "Invalid email or password" 
        });
      }

      // Generate JWT token
      const token = jwt.sign(
        { 
          id: 'admin-1', 
          email: email 
        },
        JWT_SECRET,
        { expiresIn: '24h' }
      );

      res.json({
        message: "Login successful",
        token,
        user: {
          id: 'admin-1',
          email: email
        }
      });

    } catch (error) {
      console.error('Admin login error:', error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Protected admin routes example
  app.get("/api/admin/verify", authMiddleware, (req: any, res: any) => {
    res.json({
      message: "Token is valid",
      user: req.user
    });
  });

  // Blog endpoints
  app.get("/api/blog", async (_req, res) => {
    try {
      const posts = await storage.getBlogPosts();
      res.json(posts);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch blog posts" });
    }
  });

  app.get("/api/blog/:slug", async (req, res) => {
    try {
      const { slug } = req.params;
      const post = await storage.getBlogPostBySlug(slug);
      
      if (!post) {
        return res.status(404).json({ message: "Blog post not found" });
      }
      
      res.json(post);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch blog post" });
    }
  });

  // Blog CRUD endpoints
  app.post("/api/blog", authMiddleware, async (req: any, res) => {
    try {
      const validatedData = insertBlogPostSchema.parse(req.body);
      const blogPost = await storage.createBlogPost(validatedData);
      res.status(201).json(blogPost);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          message: "Data tidak valid",
          errors: error.errors 
        });
      }
      res.status(500).json({ message: "Failed to create blog post" });
    }
  });

  app.put("/api/blog/:id", authMiddleware, async (req: any, res) => {
    try {
      const { id } = req.params;
      const validatedData = insertBlogPostSchema.parse(req.body);
      const blogPost = await storage.updateBlogPost(parseInt(id), validatedData);
      
      if (!blogPost) {
        return res.status(404).json({ message: "Blog post not found" });
      }
      
      res.json(blogPost);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          message: "Data tidak valid",
          errors: error.errors 
        });
      }
      res.status(500).json({ message: "Failed to update blog post" });
    }
  });

  app.delete("/api/blog/:id", authMiddleware, async (req: any, res) => {
    try {
      const { id } = req.params;
      const success = await storage.deleteBlogPost(parseInt(id));
      
      if (!success) {
        return res.status(404).json({ message: "Blog post not found" });
      }
      
      res.json({ message: "Blog post deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete blog post" });
    }
  });

  // Contact endpoint
  app.post("/api/contact", async (req, res) => {
    try {
      const validatedData = insertContactSchema.parse(req.body);
      const contact = await storage.createContact(validatedData);
      
      // Get admin contact info for email notification
      try {
        const adminContactInfo = await storage.getContactInfo();
        
        if (adminContactInfo && adminContactInfo.email) {
          // Send email notification to admin
          const emailSent = await emailService.sendContactNotification(contact, adminContactInfo);
          
          if (emailSent) {
            console.log('Email notification sent to admin:', adminContactInfo.email);
            
            // Send auto-reply to user
            const autoReplySent = await emailService.sendAutoReply(contact);
            if (autoReplySent) {
              console.log('Auto-reply sent to user:', contact.email);
            }
          } else {
            console.warn('Failed to send email notification to admin');
          }
        } else {
          console.warn('Admin email not configured, skipping email notification');
        }
      } catch (emailError) {
        console.error('Error sending emails:', emailError);
        // Don't fail the request if email fails
      }
      
      res.status(201).json({ 
        message: "Pesan berhasil dikirim! Kami akan menghubungi Anda segera.",
        contact: { id: contact.id }
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          message: "Data tidak valid",
          errors: error.errors 
        });
      }
      
      res.status(500).json({ message: "Gagal mengirim pesan" });
    }
  });

  // Analytics endpoint
  app.post("/api/analytics", async (req, res) => {
    try {
      const { propertyId, serviceAccountEmail, privateKey } = req.body;
      
      // Validate required fields
      if (!propertyId || !serviceAccountEmail || !privateKey) {
        return res.status(400).json({ 
          message: "Missing required fields: propertyId, serviceAccountEmail, privateKey" 
        });
      }

      // TODO: For production, integrate with Google Analytics Reporting API
      // 1. Install Google Analytics Data API: npm install @google-analytics/data
      // 2. Setup service account credentials
      // 3. Use the following code structure:
      /*
      import { BetaAnalyticsDataClient } from '@google-analytics/data';
      
      const analyticsDataClient = new BetaAnalyticsDataClient({
        credentials: {
          client_email: serviceAccountEmail,
          private_key: privateKey.replace(/\\n/g, '\n'),
        }
      });

      const [response] = await analyticsDataClient.runReport({
        property: `properties/${propertyId}`,
        dateRanges: [
          {
            startDate: '30daysAgo',
            endDate: 'today',
          },
        ],
        dimensions: [
          {
            name: 'city',
          },
        ],
        metrics: [
          {
            name: 'activeUsers',
          },
        ],
      });
      */

      // For demo purposes, we'll return mock data
      // In production, you would integrate with Google Analytics API
      const mockAnalyticsData = {
        totalVisitors: Math.floor(Math.random() * 10000) + 5000,
        todayVisitors: Math.floor(Math.random() * 500) + 100,
        totalSessions: Math.floor(Math.random() * 15000) + 7000,
        heroButtonClicks: Math.floor(Math.random() * 200) + 50,
        topPages: [
          { page: "/", views: Math.floor(Math.random() * 3000) + 1000 },
          { page: "/workshop", views: Math.floor(Math.random() * 2000) + 800 },
          { page: "/about", views: Math.floor(Math.random() * 1500) + 600 },
          { page: "/contact", views: Math.floor(Math.random() * 1000) + 400 },
          { page: "/blog", views: Math.floor(Math.random() * 800) + 300 }
        ],
        avgEngagementTime: Math.floor(Math.random() * 300) + 120, // seconds
        bounceRate: (Math.random() * 0.4) + 0.3, // 30-70%
        trafficSources: [
          { source: "Direct", visitors: Math.floor(Math.random() * 2000) + 1000 },
          { source: "Google Search", visitors: Math.floor(Math.random() * 1500) + 800 },
          { source: "Social Media", visitors: Math.floor(Math.random() * 800) + 400 },
          { source: "Referral", visitors: Math.floor(Math.random() * 500) + 200 },
          { source: "Email", visitors: Math.floor(Math.random() * 300) + 100 }
        ],
        deviceCategories: [
          { device: "Mobile", sessions: Math.floor(Math.random() * 5000) + 3000 },
          { device: "Desktop", sessions: Math.floor(Math.random() * 4000) + 2000 },
          { device: "Tablet", sessions: Math.floor(Math.random() * 1000) + 500 }
        ],
        newVsReturning: {
          newUsers: Math.floor(Math.random() * 6000) + 3000,
          returningUsers: Math.floor(Math.random() * 4000) + 2000
        }
      };

      console.log('Analytics data requested for property:', propertyId);
      console.log('Service account:', serviceAccountEmail);
      
      res.json(mockAnalyticsData);
    } catch (error) {
      console.error('Error fetching analytics data:', error);
      res.status(500).json({ message: "Failed to fetch analytics data" });
    }
  });

  // Contact Info endpoints
  app.get("/api/contact-info", async (_req, res) => {
    try {
      const contactInfo = await storage.getContactInfo();
      res.json(contactInfo);
    } catch (error) {
      console.error('Error fetching contact info:', error);
      res.status(500).json({ message: "Failed to fetch contact info" });
    }
  });

  app.put("/api/contact-info", authMiddleware, async (req: any, res) => {
    try {
      const validatedData = insertContactInfoSchema.parse(req.body);
      const contactInfo = await storage.updateContactInfo(validatedData);
      res.json(contactInfo);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          message: "Data tidak valid",
          errors: error.errors
        });
      }
      console.error('Error updating contact info:', error);
      res.status(500).json({ message: "Failed to update contact info" });
    }
  });

  // Hero section endpoints
  app.get("/api/hero", async (_req, res) => {
    try {
      const heroData = await storage.getHeroData();
      console.log('Returning hero data:', heroData);
      res.json(heroData);
    } catch (error) {
      console.error('Error fetching hero data:', error);
      res.status(500).json({ message: "Failed to fetch hero data" });
    }
  });

  app.post("/api/hero", authMiddleware, async (req: any, res) => {
    try {
      console.log('Received hero data:', req.body);
      const heroData = req.body;
      
      // Validate required fields
      if (!heroData.title1 || !heroData.title2 || !heroData.description || !heroData.imageAlt) {
        return res.status(400).json({ 
          message: "Missing required fields",
          required: ["title1", "title2", "description", "imageAlt"]
        });
      }
      
      const updatedHero = await storage.updateHeroData(heroData);
      console.log('Successfully updated hero data:', updatedHero);
      res.json(updatedHero);
    } catch (error) {
      console.error('Error updating hero data:', error);
      res.status(500).json({ 
        message: "Failed to update hero data",
        error: error instanceof Error ? error.message : String(error)
      });
    }
  });

  // File upload endpoint
  app.post("/api/upload", authMiddleware, (req: any, res) => {
    const upload = req.app.locals.upload;
    
    upload.single('image')(req, res, (err: any) => {
      if (err) {
        console.error('Upload error:', err);
        return res.status(400).json({ 
          message: "File upload failed",
          error: err.message 
        });
      }
      
      if (!req.file) {
        return res.status(400).json({ 
          message: "No file uploaded" 
        });
      }
      
      // Return the URL where the file can be accessed
      const fileUrl = `/uploads/${req.file.filename}`;
      console.log('File uploaded successfully:', fileUrl);
      
      res.json({ 
        url: fileUrl,
        filename: req.file.filename,
        originalName: req.file.originalname,
        size: req.file.size
      });
    });
  });

  // Workshop endpoints
  app.get("/api/workshop/packages", async (_req, res) => {
    try {
      const packages = await storage.getWorkshopPackages();
      res.json(packages);
    } catch (error) {
      console.error('Error fetching workshop packages:', error);
      res.status(500).json({ message: "Failed to fetch workshop packages" });
    }
  });

  app.post("/api/workshop/packages", authMiddleware, async (req: any, res) => {
    try {
      console.log('Received workshop packages:', req.body);
      const packages = req.body;
      
      if (!Array.isArray(packages)) {
        return res.status(400).json({ 
          message: "Expected an array of packages"
        });
      }
      
      const updatedPackages = await storage.updateWorkshopPackages(packages);
      console.log('Successfully updated workshop packages:', updatedPackages);
      res.json(updatedPackages);
    } catch (error) {
      console.error('Error updating workshop packages:', error);
      res.status(500).json({ 
        message: "Failed to update workshop packages",
        error: error instanceof Error ? error.message : String(error)
      });
    }
  });

  app.get("/api/workshop/curriculum", async (_req, res) => {
    try {
      const curriculum = await storage.getWorkshopCurriculum();
      res.json(curriculum);
    } catch (error) {
      console.error('Error fetching workshop curriculum:', error);
      res.status(500).json({ message: "Failed to fetch workshop curriculum" });
    }
  });

  app.post("/api/workshop/curriculum", authMiddleware, async (req: any, res) => {
    try {
      console.log('Received workshop curriculum:', req.body);
      const curriculum = req.body;
      
      if (!Array.isArray(curriculum)) {
        return res.status(400).json({ 
          message: "Expected an array of curriculum items"
        });
      }
      
      const updatedCurriculum = await storage.updateWorkshopCurriculum(curriculum);
      console.log('Successfully updated workshop curriculum:', updatedCurriculum);
      res.json(updatedCurriculum);
    } catch (error) {
      console.error('Error updating workshop curriculum:', error);
      res.status(500).json({ 
        message: "Failed to update workshop curriculum",
        error: error instanceof Error ? error.message : String(error)
      });
    }
  });

  // Products endpoints
  app.get("/api/products", async (_req, res) => {
    try {
      const products = await storage.getProducts();
      res.json(products);
    } catch (error) {
      console.error('Error fetching products:', error);
      res.status(500).json({ message: "Failed to fetch products" });
    }
  });

  app.post("/api/products", authMiddleware, async (req: any, res) => {
    try {
      console.log('Received products:', req.body);
      const products = req.body;
      
      if (!Array.isArray(products)) {
        return res.status(400).json({ 
          message: "Expected an array of products"
        });
      }
      
      const updatedProducts = await storage.updateProducts(products);
      console.log('Successfully updated products:', updatedProducts);
      res.json(updatedProducts);
    } catch (error) {
      console.error('Error updating products:', error);
      res.status(500).json({ 
        message: "Failed to update products",
        error: error instanceof Error ? error.message : String(error)
      });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
