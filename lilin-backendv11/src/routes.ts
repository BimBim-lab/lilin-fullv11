import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertContactSchema, insertBlogPostSchema, insertContactInfoSchema } from "./schema";
import { emailService } from "./emailService";
import { authMiddleware, JWT_SECRET } from "./authMiddleware";
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
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

      // Get admin credentials from storage
      const adminCredentials = await storage.getAdminCredentials();

      // Check credentials
      const isEmailValid = email === adminCredentials.email;
      const isPasswordValid = await bcrypt.compare(password, adminCredentials.password);

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

  // Get admin credentials (protected)
  app.get("/api/admin/credentials", authMiddleware, async (_req, res) => {
    try {
      const credentials = await storage.getAdminCredentials();
      // Don't send the password in response
      res.json({
        id: credentials.id,
        email: credentials.email,
        updatedAt: credentials.updatedAt
      });
    } catch (error) {
      console.error('Get admin credentials error:', error);
      res.status(500).json({ message: "Failed to get admin credentials" });
    }
  });

  // Update admin credentials (protected)
  app.put("/api/admin/credentials", authMiddleware, async (req, res) => {
    try {
      const { email, password } = req.body;

      // Validate input
      if (!email || !password) {
        return res.status(400).json({ 
          message: "Email and password are required" 
        });
      }

      // Hash the new password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Update credentials
      const updatedCredentials = await storage.updateAdminCredentials({
        email,
        password: hashedPassword
      });

      // Don't send the password in response
      res.json({
        id: updatedCredentials.id,
        email: updatedCredentials.email,
        updatedAt: updatedCredentials.updatedAt,
        message: "Admin credentials updated successfully"
      });

    } catch (error) {
      console.error('Update admin credentials error:', error);
      res.status(500).json({ message: "Failed to update admin credentials" });
    }
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

  // Test email endpoint
  app.post("/api/test-email", authMiddleware, async (req, res) => {
    try {
      const { email } = req.body;
      
      if (!email) {
        return res.status(400).json({ message: "Email address is required" });
      }

      // Create test contact
      const testContact = {
        id: 999,
        name: "Test User",
        email: email,
        phone: "+62 812-3456-7890",
        subject: "Test Email Configuration",
        message: "This is a test email to verify email configuration is working properly.",
        createdAt: new Date()
      };

      // Get admin contact info
      const adminContactInfo = await storage.getContactInfo();
      
      // Send test email
      const emailSent = await emailService.sendContactNotification(testContact, adminContactInfo);
      
      if (emailSent) {
        res.json({ 
          message: "Test email sent successfully! Check your inbox.",
          details: "Email notification sent to admin email address"
        });
      } else {
        res.status(500).json({ 
          message: "Failed to send test email",
          details: "Check email configuration in .env file"
        });
      }
    } catch (error) {
      console.error('Test email error:', error);
      res.status(500).json({ 
        message: "Test email failed",
        error: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  // Data backup and restore endpoints
  app.get("/api/admin/backup", authMiddleware, async (_req, res) => {
    try {
      // Return current data as JSON for backup
      const data = {
        heroData: await storage.getHeroData(),
        contactInfo: await storage.getContactInfo(),
        workshopPackages: await storage.getWorkshopPackages(),
        workshopCurriculum: await storage.getWorkshopCurriculum(),
        products: await storage.getProducts(),
        gallery: await storage.getGallery(),
        blogPosts: await storage.getBlogPosts(),
        backupDate: new Date().toISOString()
      };

      res.setHeader('Content-Disposition', 'attachment; filename=weiscandle-backup.json');
      res.json(data);
    } catch (error) {
      console.error('Backup error:', error);
      res.status(500).json({ 
        message: "Failed to create backup",
        error: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  app.post("/api/admin/restore", authMiddleware, async (req, res) => {
    try {
      const backupData = req.body;
      
      if (!backupData) {
        return res.status(400).json({ message: "No backup data provided" });
      }

      // Restore data (optional - only restore what's provided)
      if (backupData.heroData) {
        await storage.updateHeroData(backupData.heroData);
      }
      if (backupData.contactInfo) {
        await storage.updateContactInfo(backupData.contactInfo);
      }
      if (backupData.workshopPackages) {
        await storage.updateWorkshopPackages(backupData.workshopPackages);
      }
      if (backupData.workshopCurriculum) {
        await storage.updateWorkshopCurriculum(backupData.workshopCurriculum);
      }
      if (backupData.products) {
        await storage.updateProducts(backupData.products);
      }

      res.json({ 
        message: "Data restored successfully",
        restoredDate: new Date().toISOString()
      });
    } catch (error) {
      console.error('Restore error:', error);
      res.status(500).json({ 
        message: "Failed to restore data",
        error: error instanceof Error ? error.message : "Unknown error"
      });
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

  // File upload endpoint with cloud storage support
  app.post("/api/upload", authMiddleware, (req: any, res) => {
    const upload = req.app.locals.upload;
    
    upload.single('image')(req, res, async (err: any) => {
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
      
      try {
        // Check if we're in production and have cloud storage configured
        const isProduction = process.env.NODE_ENV === 'production';
        const hasCloudinary = process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET;
        
        let fileUrl: string;
        
        if (isProduction && hasCloudinary) {
          // Use Cloudinary in production
          const cloudinary = require('cloudinary').v2;
          
          cloudinary.config({
            cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
            api_key: process.env.CLOUDINARY_API_KEY,
            api_secret: process.env.CLOUDINARY_API_SECRET,
          });
          
          // Upload to Cloudinary
          const result = await cloudinary.uploader.upload(req.file.path, {
            folder: 'weiscandle',
            resource_type: 'auto',
            quality: 'auto:good',
            format: 'auto'
          });
          
          fileUrl = result.secure_url;
          console.log('File uploaded to Cloudinary:', fileUrl);
          
          // Clean up local file
          const fs = require('fs');
          fs.unlinkSync(req.file.path);
        } else {
          // Use local storage for development or when cloud storage is not configured
          const protocol = req.headers['x-forwarded-proto'] || req.protocol || 'http';
          const host = req.headers['x-forwarded-host'] || req.headers.host || 'localhost:5000';
          const baseUrl = `${protocol}://${host}`;
          
          fileUrl = `${baseUrl}/uploads/${req.file.filename}`;
          console.log('File uploaded locally:', fileUrl);
        }
        
        console.log('Protocol:', req.headers['x-forwarded-proto'] || req.protocol);
        console.log('Host:', req.headers['x-forwarded-host'] || req.headers.host);
        console.log('Final URL:', fileUrl);
        
        res.json({ 
          url: fileUrl,
          filename: req.file.filename,
          originalName: req.file.originalname,
          size: req.file.size
        });
      } catch (cloudError) {
        console.error('Cloud upload error:', cloudError);
        
        // Fallback to local storage if cloud upload fails
        const protocol = req.headers['x-forwarded-proto'] || req.protocol || 'http';
        const host = req.headers['x-forwarded-host'] || req.headers.host || 'localhost:5000';
        const baseUrl = `${protocol}://${host}`;
        
        const fileUrl = `${baseUrl}/uploads/${req.file.filename}`;
        console.log('Cloud upload failed, using local storage:', fileUrl);
        
        res.json({ 
          url: fileUrl,
          filename: req.file.filename,
          originalName: req.file.originalname,
          size: req.file.size
        });
      }
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

  // Gallery endpoints
  app.get("/api/gallery", async (_req, res) => {
    try {
      const gallery = await storage.getGallery();
      res.json(gallery);
    } catch (error) {
      console.error('Error fetching gallery:', error);
      res.status(500).json({ message: "Failed to fetch gallery" });
    }
  });

  app.get("/api/gallery/highlighted", async (_req, res) => {
    try {
      const highlightedGallery = await storage.getHighlightedGallery();
      res.json(highlightedGallery);
    } catch (error) {
      console.error('Error fetching highlighted gallery:', error);
      res.status(500).json({ message: "Failed to fetch highlighted gallery" });
    }
  });

  app.get("/api/gallery/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const galleryItem = await storage.getGalleryById(id);
      
      if (!galleryItem) {
        return res.status(404).json({ message: "Gallery item not found" });
      }
      
      res.json(galleryItem);
    } catch (error) {
      console.error('Error fetching gallery item:', error);
      res.status(500).json({ message: "Failed to fetch gallery item" });
    }
  });

  app.post("/api/gallery", authMiddleware, async (req: any, res) => {
    try {
      const galleryData = req.body;
      const newGallery = await storage.createGallery(galleryData);
      res.status(201).json(newGallery);
    } catch (error) {
      console.error('Error creating gallery item:', error);
      res.status(500).json({ message: "Failed to create gallery item" });
    }
  });

  app.put("/api/gallery/:id", authMiddleware, async (req: any, res) => {
    try {
      const id = parseInt(req.params.id);
      const galleryData = req.body;
      const updatedGallery = await storage.updateGallery(id, galleryData);
      
      if (!updatedGallery) {
        return res.status(404).json({ message: "Gallery item not found" });
      }
      
      res.json(updatedGallery);
    } catch (error) {
      console.error('Error updating gallery item:', error);
      res.status(500).json({ message: "Failed to update gallery item" });
    }
  });

  app.delete("/api/gallery/:id", authMiddleware, async (req: any, res) => {
    try {
      const id = parseInt(req.params.id);
      const deleted = await storage.deleteGallery(id);
      
      if (!deleted) {
        return res.status(404).json({ message: "Gallery item not found" });
      }
      
      res.json({ message: "Gallery item deleted successfully" });
    } catch (error) {
      console.error('Error deleting gallery item:', error);
      res.status(500).json({ message: "Failed to delete gallery item" });
    }
  });

  // Gallery endpoints
  app.get("/api/gallery", async (_req, res) => {
    try {
      const gallery = await storage.getGallery();
      res.json(gallery);
    } catch (error) {
      console.error('Error fetching gallery:', error);
      res.status(500).json({ message: "Failed to fetch gallery" });
    }
  });

  app.get("/api/gallery/highlighted", async (_req, res) => {
    try {
      const highlightedGallery = await storage.getHighlightedGallery();
      res.json(highlightedGallery);
    } catch (error) {
      console.error('Error fetching highlighted gallery:', error);
      res.status(500).json({ message: "Failed to fetch highlighted gallery" });
    }
  });

  app.get("/api/gallery/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const galleryItem = await storage.getGalleryById(id);
      
      if (!galleryItem) {
        return res.status(404).json({ message: "Gallery item not found" });
      }
      
      res.json(galleryItem);
    } catch (error) {
      console.error('Error fetching gallery item:', error);
      res.status(500).json({ message: "Failed to fetch gallery item" });
    }
  });

  app.post("/api/gallery", authMiddleware, async (req: any, res) => {
    try {
      const galleryData = req.body;
      const newGallery = await storage.createGallery(galleryData);
      res.status(201).json(newGallery);
    } catch (error) {
      console.error('Error creating gallery item:', error);
      res.status(500).json({ message: "Failed to create gallery item" });
    }
  });

  app.put("/api/gallery/:id", authMiddleware, async (req: any, res) => {
    try {
      const id = parseInt(req.params.id);
      const galleryData = req.body;
      const updatedGallery = await storage.updateGallery(id, galleryData);
      
      if (!updatedGallery) {
        return res.status(404).json({ message: "Gallery item not found" });
      }
      
      res.json(updatedGallery);
    } catch (error) {
      console.error('Error updating gallery item:', error);
      res.status(500).json({ message: "Failed to update gallery item" });
    }
  });

  app.delete("/api/gallery/:id", authMiddleware, async (req: any, res) => {
    try {
      const id = parseInt(req.params.id);
      const deleted = await storage.deleteGallery(id);
      
      if (!deleted) {
        return res.status(404).json({ message: "Gallery item not found" });
      }
      
      res.json({ message: "Gallery item deleted successfully" });
    } catch (error) {
      console.error('Error deleting gallery item:', error);
      res.status(500).json({ message: "Failed to delete gallery item" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
