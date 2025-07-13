import { Link, useLocation } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Home, 
  Calendar, 
  Package, 
  FileText, 
  MessageSquare, 
  LogOut,
  User,
  TrendingUp,
  Camera
} from "lucide-react";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const [location, setLocation] = useLocation();

  const handleLogout = () => {
    localStorage.removeItem("admin_token");
    localStorage.removeItem("admin_user");
    setLocation("/admin/login");
  };

  const navigationItems = [
    { 
      id: "hero", 
      label: "Hero Section", 
      icon: Home, 
      path: "/admin/hero",
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      description: "Kelola konten hero section"
    },
    { 
      id: "workshop", 
      label: "Workshop", 
      icon: Calendar, 
      path: "/admin/workshop",
      color: "text-green-600",
      bgColor: "bg-green-50",
      description: "Kelola data workshop"
    },
    { 
      id: "productexport", 
      label: "Product Export", 
      icon: Package, 
      path: "/admin/productexport",
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      description: "Kelola produk export"
    },
    { 
      id: "gallery", 
      label: "Gallery", 
      icon: Camera, 
      path: "/admin/gallery",
      color: "text-cyan-600",
      bgColor: "bg-cyan-50",
      description: "Kelola foto gallery"
    },
    { 
      id: "blog", 
      label: "Blog", 
      icon: FileText, 
      path: "/admin/blog",
      color: "text-orange-600",
      bgColor: "bg-orange-50",
      description: "Kelola artikel blog"
    },
    { 
      id: "contact", 
      label: "Contact", 
      icon: MessageSquare, 
      path: "/admin/contact",
      color: "text-pink-600",
      bgColor: "bg-pink-50",
      description: "Kelola kontak masuk"
    },
    { 
      id: "admin", 
      label: "Admin Settings", 
      icon: User, 
      path: "/admin/settings",
      color: "text-gray-600",
      bgColor: "bg-gray-50",
      description: "Kelola akun admin"
    },
    { 
      id: "analytics", 
      label: "Analytics", 
      icon: TrendingUp, 
      path: "/admin/analytics",
      color: "text-indigo-600",
      bgColor: "bg-indigo-50",
      description: "Monitor website analytics"
    }
  ];

  const stats = [
    { 
      title: "Artikel Blog", 
      value: "24", 
      change: "+3", 
      changeType: "increase",
      icon: FileText,
      color: "text-orange-600",
      bgColor: "bg-orange-50"
    },
    { 
      title: "Pesan Masuk", 
      value: "12", 
      change: "+2", 
      changeType: "increase",
      icon: MessageSquare,
      color: "text-pink-600",
      bgColor: "bg-pink-50"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-30">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <div className="text-center">
                <h1 className="text-xl font-display font-bold text-gray-900">WeisCandle</h1>
                <p className="text-xs text-gray-500">Admin Dashboard</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="w-8 h-8 bg-gradient-to-r from-rose-gold to-soft-pink rounded-full flex items-center justify-center">
                <User className="w-4 h-4 text-white" />
              </div>
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-red-600 hover:text-red-700 hover:bg-red-50"
                onClick={handleLogout}
              >
                <LogOut className="w-4 h-4 mr-2" />
                Keluar
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <nav className="bg-white border-b border-gray-200 sticky top-16 z-20">
        <div className="px-6">
          <div className="flex space-x-8 overflow-x-auto">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const isActive = location === item.path;
              return (
                <Link key={item.id} href={item.path}>
                  <button
                    className={`flex items-center space-x-2 px-4 py-4 border-b-2 font-medium text-sm transition-colors whitespace-nowrap ${
                      isActive
                        ? 'border-rose-gold text-gray-800 bg-rose-gold bg-opacity-10 font-semibold'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </button>
                </Link>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="flex-1">
        {/* Dashboard Overview (only show on main dashboard) */}
        {location === '/admin' && (
          <div className="p-6">
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-2">Dashboard Overview</h2>
              <p className="text-sm text-gray-500">Ringkasan aktivitas dan statistik website</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl">
              {stats.map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <Card key={index} className="hover:shadow-lg transition-all duration-200 border-0 shadow-sm">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className={`w-12 h-12 ${stat.bgColor} rounded-xl flex items-center justify-center`}>
                            <Icon className={`w-6 h-6 ${stat.color}`} />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                            <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                          </div>
                        </div>
                        <div className={`text-sm font-medium ${stat.color} flex items-center space-x-1`}>
                          <TrendingUp className="w-4 h-4" />
                          <span>{stat.change}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        )}

        {/* Main Content Area */}
        {location !== '/admin' && (
          <div className="p-6">
            {children}
          </div>
        )}
      </div>
    </div>
  );
}
