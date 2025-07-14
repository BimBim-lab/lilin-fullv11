import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Home from "@/pages/Home";
import About from "@/pages/About";
import Workshop from "@/pages/Workshop";
import Gallery from "@/pages/Gallery";
import Blog from "@/pages/Blog";
import BlogPost from "@/pages/BlogPost";
import Contact from "@/pages/Contact";
import Export from "@/pages/Export";
import NotFound from "@/pages/not-found";
import Layout from "@/components/Layout";
import DashboardLayout from "@/pages/admin/DashboardLayout";
import HeroDashboard from "@/pages/admin/HeroDashboard";
import WorkshopDashboard from "@/pages/admin/WorkshopDashboard";
import ProductExportDashboard from "@/pages/admin/ProductExportDashboard";
import GalleryDashboard from "@/pages/admin/GalleryDashboard";
import BlogDashboard from "@/pages/admin/BlogDashboard";
import ContactDashboard from "@/pages/admin/ContactDashboard";
import AdminSettingsDashboard from "@/pages/admin/AdminSettingsDashboard";
import AdminLogin from "@/pages/admin/AdminLogin";
import ProtectedRoute from "@/components/ProtectedRoute";

function Router() {
  return (
    <Switch>
      {/* Public Routes */}
      <Route path="/" component={() => (
        <Layout>
          <Home />
        </Layout>
      )} />
      <Route path="/about" component={() => (
        <Layout>
          <About />
        </Layout>
      )} />
      <Route path="/workshop" component={() => (
        <Layout>
          <Workshop />
        </Layout>
      )} />
      <Route path="/gallery" component={() => (
        <Layout>
          <Gallery />
        </Layout>
      )} />
      <Route path="/blog" component={() => (
        <Layout>
          <Blog />
        </Layout>
      )} />
      <Route path="/blog/:slug" component={() => (
        <Layout>
          <BlogPost />
        </Layout>
      )} />
      <Route path="/contact" component={() => (
        <Layout>
          <Contact />
        </Layout>
      )} />
      <Route path="/export" component={() => (
        <Layout>
          <Export />
        </Layout>
      )} />

      {/* Admin Login Route */}
      <Route path="/admin/login" component={AdminLogin} />

      {/* Protected Admin Routes */}
      <Route path="/admin" component={() => (
        <ProtectedRoute>
          <DashboardLayout>
            <div className="text-center py-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Selamat Datang di Admin Dashboard</h2>
              <p className="text-gray-600">Pilih menu di sidebar untuk mengelola konten website</p>
            </div>
          </DashboardLayout>
        </ProtectedRoute>
      )} />
      <Route path="/admin/hero" component={() => (
        <ProtectedRoute>
          <DashboardLayout>
            <HeroDashboard />
          </DashboardLayout>
        </ProtectedRoute>
      )} />
      <Route path="/admin/workshop" component={() => (
        <ProtectedRoute>
          <DashboardLayout>
            <WorkshopDashboard />
          </DashboardLayout>
        </ProtectedRoute>
      )} />
      <Route path="/admin/productexport" component={() => (
        <ProtectedRoute>
          <DashboardLayout>
            <ProductExportDashboard />
          </DashboardLayout>
        </ProtectedRoute>
      )} />
      <Route path="/admin/gallery" component={() => (
        <ProtectedRoute>
          <DashboardLayout>
            <GalleryDashboard />
          </DashboardLayout>
        </ProtectedRoute>
      )} />
      <Route path="/admin/blog" component={() => (
        <ProtectedRoute>
          <DashboardLayout>
            <BlogDashboard />
          </DashboardLayout>
        </ProtectedRoute>
      )} />
      <Route path="/admin/contact" component={() => (
        <ProtectedRoute>
          <DashboardLayout>
            <ContactDashboard />
          </DashboardLayout>
        </ProtectedRoute>
      )} />
      <Route path="/admin/settings" component={() => (
        <ProtectedRoute>
          <DashboardLayout>
            <AdminSettingsDashboard />
          </DashboardLayout>
        </ProtectedRoute>
      )} />

      {/* 404 Route */}
      <Route component={() => (
        <Layout>
          <NotFound />
        </Layout>
      )} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
