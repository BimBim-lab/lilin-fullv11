# WeisCandle - Workshop Lilin Aromaterapi Frontend

Website frontend untuk WeisCandle, platform pembelajaran aromaterapi dengan workshop lilin berkualitas tinggi.

## 🕯️ Tentang Project

WeisCandle adalah platform pembelajaran aromaterapi yang menyediakan workshop pembuatan lilin dengan teknik profesional dan bahan berkualitas tinggi. Frontend ini dibangun dengan teknologi modern untuk memberikan pengalaman user yang optimal.

## 🚀 Teknologi yang Digunakan

- **React 18** - UI Library
- **TypeScript** - Type Safety
- **Vite** - Build Tool & Development Server
- **Tailwind CSS** - Utility-First CSS Framework
- **Wouter** - Lightweight Router
- **Framer Motion** - Animation Library
- **Radix UI** - Headless UI Components
- **React Query** - Data Fetching & State Management
- **React Hook Form** - Form Management
- **Zod** - Schema Validation

## 📁 Struktur Project

```
lilin-frontendv11/
├── src/
│   ├── components/          # Reusable components
│   │   ├── ui/             # UI components (Radix UI based)
│   │   ├── Layout.tsx      # Main layout component
│   │   ├── Navigation.tsx  # Navigation component
│   │   └── Footer.tsx      # Footer component
│   ├── pages/              # Page components
│   │   ├── Home.tsx        # Homepage
│   │   ├── About.tsx       # About page
│   │   ├── Workshop.tsx    # Workshop page
│   │   ├── Blog.tsx        # Blog page
│   │   └── Contact.tsx     # Contact page
│   ├── hooks/              # Custom hooks
│   ├── lib/                # Utility functions
│   ├── shared/             # Shared types and schemas
│   ├── App.tsx             # Main app component
│   ├── main.tsx            # Entry point
│   └── index.css           # Global styles
├── public/                 # Static assets
├── index.html              # HTML template
├── package.json            # Dependencies
├── tailwind.config.ts      # Tailwind configuration
├── tsconfig.json           # TypeScript configuration
├── vite.config.ts          # Vite configuration
└── README.md               # Project documentation
```

## 🛠️ Setup dan Instalasi

### Prerequisites
- Node.js (v18 atau lebih tinggi)
- npm atau yarn

### Instalasi

1. **Clone repository**
   ```bash
   git clone <repository-url>
   cd lilin-frontendv11
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Jalankan development server**
   ```bash
   npm run dev
   ```

4. **Buka browser**
   ```
   http://localhost:3000
   ```

## 📜 Scripts

- `npm run dev` - Menjalankan development server
- `npm run build` - Build project untuk production
- `npm run preview` - Preview build hasil production
- `npm run lint` - Menjalankan ESLint untuk code quality
- `npm run type-check` - Menjalankan TypeScript type checking

## 🎨 Fitur Utama

### 🏠 Homepage
- Hero section dengan call-to-action
- Workshop benefits showcase
- Testimonial carousel
- Schedule & pricing information

### 📚 Workshop
- Detailed workshop information
- Multiple workshop tiers (Basic, Premium, Pro)
- Registration forms
- Workshop schedule

### 📝 Blog
- Article listing
- Individual blog post pages
- SEO optimized content

### 📞 Contact
- Contact form dengan validation
- Location information
- Social media links
- WhatsApp integration

## 🎯 Fitur Teknis

### 🔧 Development
- Hot Module Replacement (HMR)
- TypeScript support
- ESLint integration
- Tailwind CSS dengan custom design system

### 📱 Responsive Design
- Mobile-first approach
- Tablet & desktop optimized
- Touch-friendly interactions

### 🌐 SEO & Performance
- Meta tags optimization
- Open Graph support
- Twitter Card support
- Image optimization
- Lazy loading

### 🎨 Design System
- Custom color palette (Soft Pink, Rose Gold, Charcoal, Cream)
- Typography system (Inter + Playfair Display)
- Consistent spacing and sizing
- Reusable UI components

## 🔧 Konfigurasi

### Tailwind CSS
Custom theme dengan brand colors:
- `soft-pink`: #e5b3b3
- `rose-gold`: #d4a5a5
- `charcoal`: #333333
- `cream`: #fafafa

### API Integration
- Backend API endpoint: `http://localhost:5000/api`
- React Query untuk data fetching
- Error handling dan loading states

## 🚀 Deployment

### Build Production
```bash
npm run build
```

### Preview Production Build
```bash
npm run preview
```

### Deploy ke Hosting
1. Build project: `npm run build`
2. Upload folder `dist/` ke hosting
3. Configure server untuk SPA routing

## 📋 Todo / Roadmap

- [ ] Implementasi sistem autentikasi
- [ ] Dashboard admin untuk workshop management
- [ ] Payment integration
- [ ] Workshop booking system
- [ ] Certificate generation
- [ ] Live chat support
- [ ] Newsletter subscription
- [ ] PWA support

## 🤝 Contributing

1. Fork repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Tim Pengembang

- **Frontend Developer** - UI/UX Implementation
- **Backend Developer** - API Development
- **Designer** - UI/UX Design

## 📞 Kontak

- **Email**: info@weiscandle.com
- **WhatsApp**: +62 812-3456-7890
- **Website**: https://weiscandle.com

---

Made with ❤️ by WeisCandle Team
