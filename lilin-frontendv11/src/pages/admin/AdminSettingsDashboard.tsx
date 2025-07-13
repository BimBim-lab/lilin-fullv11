import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useQueryClient } from "@tanstack/react-query";
import { Eye, EyeOff, User, Settings } from "lucide-react";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

interface AdminCredentials {
  id: number;
  email: string;
  updatedAt: string;
}

export default function AdminSettingsDashboard() {
  const [credentials, setCredentials] = useState<AdminCredentials | null>(null);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: ""
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [alert, setAlert] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);

  const queryClient = useQueryClient();

  useEffect(() => {
    loadCredentials();
  }, []);

  const loadCredentials = async () => {
    try {
      const token = localStorage.getItem('admin_token');
      const response = await fetch(`${API_BASE_URL}/api/admin/credentials`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setCredentials(data);
        setFormData(prev => ({
          ...prev,
          email: data.email
        }));
      } else {
        setAlert({
          type: 'error',
          message: 'Failed to load admin credentials'
        });
      }
    } catch (error) {
      console.error('Error loading credentials:', error);
      setAlert({
        type: 'error',
        message: 'Error loading admin credentials'
      });
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setAlert(null);

    // Validation
    if (!formData.email || !formData.password) {
      setAlert({
        type: 'error',
        message: 'Email and password are required'
      });
      setIsLoading(false);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setAlert({
        type: 'error',
        message: 'Passwords do not match'
      });
      setIsLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setAlert({
        type: 'error',
        message: 'Password must be at least 6 characters long'
      });
      setIsLoading(false);
      return;
    }

    try {
      const token = localStorage.getItem('admin_token');
      const response = await fetch(`${API_BASE_URL}/api/admin/credentials`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password
        })
      });

      if (response.ok) {
        const data = await response.json();
        setCredentials({
          id: data.id,
          email: data.email,
          updatedAt: data.updatedAt
        });
        
        // Clear password fields
        setFormData(prev => ({
          ...prev,
          password: "",
          confirmPassword: ""
        }));

        setAlert({
          type: 'success',
          message: 'Admin credentials updated successfully'
        });

        // Invalidate any relevant queries
        queryClient.invalidateQueries({ queryKey: ['adminCredentials'] });

      } else {
        const errorData = await response.json();
        setAlert({
          type: 'error',
          message: errorData.message || 'Failed to update credentials'
        });
      }
    } catch (error) {
      console.error('Error updating credentials:', error);
      setAlert({
        type: 'error',
        message: 'Error updating admin credentials'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="p-2 bg-gray-100 rounded-lg">
          <Settings className="h-6 w-6 text-gray-600" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Admin Settings</h1>
          <p className="text-gray-600">Kelola kredensial akun admin</p>
        </div>
      </div>

      {/* Alert */}
      {alert && (
        <Alert className={alert.type === 'success' ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}>
          <AlertDescription className={alert.type === 'success' ? 'text-green-800' : 'text-red-800'}>
            {alert.message}
          </AlertDescription>
        </Alert>
      )}

      {/* Current Credentials Info */}
      {credentials && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Current Admin Account
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div>
                <Label className="text-sm font-medium text-gray-700">Email</Label>
                <p className="text-gray-900 mt-1">{credentials.email}</p>
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-700">Last Updated</Label>
                <p className="text-gray-600 mt-1">
                  {new Date(credentials.updatedAt).toLocaleString('id-ID')}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Update Credentials Form */}
      <Card>
        <CardHeader>
          <CardTitle>Update Credentials</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Enter admin email"
                required
              />
            </div>

            <div>
              <Label htmlFor="password">New Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="Enter new password"
                  required
                  minLength={6}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>

            <div>
              <Label htmlFor="confirmPassword">Confirm New Password</Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  placeholder="Confirm new password"
                  required
                  minLength={6}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>

            <div className="pt-4">
              <Button 
                type="submit" 
                disabled={isLoading}
                className="w-full"
              >
                {isLoading ? 'Updating...' : 'Update Credentials'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Security Notice */}
      <Card className="border-yellow-200 bg-yellow-50">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <div className="p-1 bg-yellow-100 rounded">
              <Settings className="h-4 w-4 text-yellow-600" />
            </div>
            <div>
              <h3 className="font-medium text-yellow-800">Security Notice</h3>
              <p className="text-sm text-yellow-700 mt-1">
                Setelah mengubah kredensial admin, Anda akan tetap login dengan session yang sama. 
                Gunakan kredensial baru untuk login berikutnya. Pastikan untuk menyimpan kredensial 
                dengan aman.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
