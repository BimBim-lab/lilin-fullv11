import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { Plus, Edit3, Trash2, Save, X, Clock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface WorkshopPackage {
  id?: number;
  name: string;
  description: string;
  price: string;
  duration: string;
  features: string; // JSON string of array
  isPopular: boolean;
}

interface CurriculumItem {
  id?: number;
  step: string;
  title: string;
  description: string;
  duration: string;
  order: number;
}

export default function WorkshopDashboard() {
  const [packages, setPackages] = useState<WorkshopPackage[]>([]);
  const [curriculum, setCurriculum] = useState<CurriculumItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  
  // Dialog states
  const [isPackageDialogOpen, setIsPackageDialogOpen] = useState(false);
  const [isCurriculumDialogOpen, setIsCurriculumDialogOpen] = useState(false);
  const [editingPackage, setEditingPackage] = useState<WorkshopPackage | null>(null);
  const [editingCurriculum, setEditingCurriculum] = useState<CurriculumItem | null>(null);
  
  // Form states
  const [packageForm, setPackageForm] = useState<WorkshopPackage>({
    name: "",
    description: "",
    price: "",
    duration: "",
    features: "[]",
    isPopular: false,
  });
  
  const [curriculumForm, setCurriculumForm] = useState<CurriculumItem>({
    step: "",
    title: "",
    description: "",
    duration: "",
    order: 0,
  });

  const [featuresList, setFeaturesList] = useState<string[]>([""]);
  
  const { toast } = useToast();

  // Load data on component mount
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setIsLoading(true);
      
      const [packagesResponse, curriculumResponse] = await Promise.all([
        fetch('/api/workshop/packages'),
        fetch('/api/workshop/curriculum')
      ]);
      
      if (packagesResponse.ok) {
        const packagesData = await packagesResponse.json();
        setPackages(packagesData);
      }
      
      if (curriculumResponse.ok) {
        const curriculumData = await curriculumResponse.json();
        setCurriculum(curriculumData);
      }
    } catch (error) {
      console.error('Error loading data:', error);
      toast({
        title: "Error",
        description: "Failed to load workshop data",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const saveAllData = async () => {
    try {
      setIsSaving(true);
      
      const [packagesResponse, curriculumResponse] = await Promise.all([
        fetch('/api/workshop/packages', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(packages.map(pkg => ({
            name: pkg.name,
            description: pkg.description,
            price: pkg.price,
            duration: pkg.duration,
            features: pkg.features,
            isPopular: pkg.isPopular,
          }))),
        }),
        fetch('/api/workshop/curriculum', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(curriculum.map(curr => ({
            step: curr.step,
            title: curr.title,
            description: curr.description,
            duration: curr.duration,
            order: curr.order,
          }))),
        })
      ]);
      
      if (packagesResponse.ok && curriculumResponse.ok) {
        toast({
          title: "Success",
          description: "Workshop data saved successfully",
        });
        // Reload data to get updated IDs
        await loadData();
      } else {
        throw new Error('Failed to save data');
      }
    } catch (error) {
      console.error('Error saving data:', error);
      toast({
        title: "Error",
        description: "Failed to save workshop data",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  // Package management functions
  const openPackageDialog = (pkg?: WorkshopPackage) => {
    if (pkg) {
      setEditingPackage(pkg);
      setPackageForm(pkg);
      setFeaturesList(JSON.parse(pkg.features || "[]"));
    } else {
      setEditingPackage(null);
      setPackageForm({
        name: "",
        description: "",
        price: "",
        duration: "",
        features: "[]",
        isPopular: false,
      });
      setFeaturesList([""]);
    }
    setIsPackageDialogOpen(true);
  };

  const savePackage = () => {
    const featuresJson = JSON.stringify(featuresList.filter(f => f.trim()));
    const packageData = { ...packageForm, features: featuresJson };
    
    if (editingPackage) {
      setPackages(packages.map(pkg => 
        pkg.id === editingPackage.id ? { ...packageData, id: editingPackage.id } : pkg
      ));
    } else {
      setPackages([...packages, { ...packageData, id: Date.now() }]);
    }
    
    setIsPackageDialogOpen(false);
  };

  const deletePackage = (id: number) => {
    setPackages(packages.filter(pkg => pkg.id !== id));
  };

  // Curriculum management functions
  const openCurriculumDialog = (curr?: CurriculumItem) => {
    if (curr) {
      setEditingCurriculum(curr);
      setCurriculumForm(curr);
    } else {
      setEditingCurriculum(null);
      setCurriculumForm({
        step: String(curriculum.length + 1),
        title: "",
        description: "",
        duration: "",
        order: curriculum.length + 1,
      });
    }
    setIsCurriculumDialogOpen(true);
  };

  const saveCurriculum = () => {
    if (editingCurriculum) {
      setCurriculum(curriculum.map(curr => 
        curr.id === editingCurriculum.id ? { ...curriculumForm, id: editingCurriculum.id } : curr
      ));
    } else {
      setCurriculum([...curriculum, { ...curriculumForm, id: Date.now() }]);
    }
    
    setIsCurriculumDialogOpen(false);
  };

  const deleteCurriculum = (id: number) => {
    setCurriculum(curriculum.filter(curr => curr.id !== id));
  };

  const updateFeature = (index: number, value: string) => {
    const newFeatures = [...featuresList];
    newFeatures[index] = value;
    setFeaturesList(newFeatures);
  };

  const addFeature = () => {
    setFeaturesList([...featuresList, ""]);
  };

  const removeFeature = (index: number) => {
    setFeaturesList(featuresList.filter((_, i) => i !== index));
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-rose-gold mx-auto mb-4"></div>
          <p>Loading workshop data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Workshop Management</h2>
          <p className="text-sm text-gray-500">Kelola workshop packages dan kurikulum</p>
        </div>
        <Button 
          onClick={saveAllData} 
          disabled={isSaving}
          className="bg-rose-gold hover:bg-rose-gold/90"
        >
          <Save className="w-4 h-4 mr-2" />
          {isSaving ? "Saving..." : "Save All Changes"}
        </Button>
      </div>

      {/* Workshop Packages */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Workshop Packages</CardTitle>
            <Button 
              onClick={() => openPackageDialog()}
              variant="outline"
              size="sm"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Package
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {packages.map((pkg) => (
              <div key={pkg.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="font-semibold text-gray-900">{pkg.name}</h3>
                      {pkg.isPopular && (
                        <Badge className="bg-rose-gold text-white">Popular</Badge>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{pkg.description}</p>
                    <div className="flex items-center space-x-4 text-sm text-gray-500 mb-2">
                      <span className="flex items-center">
                        <Clock className="w-4 h-4 mr-1" />
                        {pkg.duration}
                      </span>
                      <span className="font-semibold text-rose-gold">{pkg.price}</span>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {JSON.parse(pkg.features || "[]").map((feature: string, index: number) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {feature}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => openPackageDialog(pkg)}
                    >
                      <Edit3 className="w-4 h-4" />
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="text-red-600 hover:text-red-700"
                      onClick={() => deletePackage(pkg.id!)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Kurikulum Workshop */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Kurikulum Workshop</CardTitle>
            <Button 
              onClick={() => openCurriculumDialog()}
              variant="outline"
              size="sm"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Step
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {curriculum.map((item) => (
              <div key={item.id} className="flex items-start border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                <div className="w-10 h-10 bg-rose-gold rounded-full flex items-center justify-center flex-shrink-0 mr-4">
                  <span className="text-white font-bold text-sm">{item.step}</span>
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-gray-900">{item.title}</h3>
                    <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">
                      {item.duration}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">{item.description}</p>
                </div>
                <div className="flex items-center space-x-2 ml-4">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => openCurriculumDialog(item)}
                  >
                    <Edit3 className="w-4 h-4" />
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="text-red-600 hover:text-red-700"
                    onClick={() => deleteCurriculum(item.id!)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Package Dialog */}
      <Dialog open={isPackageDialogOpen} onOpenChange={setIsPackageDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {editingPackage ? "Edit Package" : "Add New Package"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="pkg-name">Package Name</Label>
              <Input
                id="pkg-name"
                value={packageForm.name}
                onChange={(e) => setPackageForm({...packageForm, name: e.target.value})}
                placeholder="e.g., Workshop Basic"
              />
            </div>
            <div>
              <Label htmlFor="pkg-desc">Description</Label>
              <Textarea
                id="pkg-desc"
                value={packageForm.description}
                onChange={(e) => setPackageForm({...packageForm, description: e.target.value})}
                placeholder="Package description"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="pkg-price">Price</Label>
                <Input
                  id="pkg-price"
                  value={packageForm.price}
                  onChange={(e) => setPackageForm({...packageForm, price: e.target.value})}
                  placeholder="Rp 350.000"
                />
              </div>
              <div>
                <Label htmlFor="pkg-duration">Duration</Label>
                <Input
                  id="pkg-duration"
                  value={packageForm.duration}
                  onChange={(e) => setPackageForm({...packageForm, duration: e.target.value})}
                  placeholder="3 hours"
                />
              </div>
            </div>
            <div>
              <Label>Features</Label>
              {featuresList.map((feature, index) => (
                <div key={index} className="flex gap-2 mb-2">
                  <Input
                    value={feature}
                    onChange={(e) => updateFeature(index, e.target.value)}
                    placeholder="Feature description"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => removeFeature(index)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addFeature}
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Feature
              </Button>
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="pkg-popular"
                checked={packageForm.isPopular}
                onCheckedChange={(checked) => setPackageForm({...packageForm, isPopular: checked})}
              />
              <Label htmlFor="pkg-popular">Mark as Popular</Label>
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setIsPackageDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={savePackage}>
                Save Package
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Curriculum Dialog */}
      <Dialog open={isCurriculumDialogOpen} onOpenChange={setIsCurriculumDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {editingCurriculum ? "Edit Curriculum Step" : "Add New Step"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="curr-step">Step Number</Label>
                <Input
                  id="curr-step"
                  value={curriculumForm.step}
                  onChange={(e) => setCurriculumForm({...curriculumForm, step: e.target.value})}
                  placeholder="1"
                />
              </div>
              <div>
                <Label htmlFor="curr-duration">Duration</Label>
                <Input
                  id="curr-duration"
                  value={curriculumForm.duration}
                  onChange={(e) => setCurriculumForm({...curriculumForm, duration: e.target.value})}
                  placeholder="45 minutes"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="curr-title">Title</Label>
              <Input
                id="curr-title"
                value={curriculumForm.title}
                onChange={(e) => setCurriculumForm({...curriculumForm, title: e.target.value})}
                placeholder="Step title"
              />
            </div>
            <div>
              <Label htmlFor="curr-desc">Description</Label>
              <Textarea
                id="curr-desc"
                value={curriculumForm.description}
                onChange={(e) => setCurriculumForm({...curriculumForm, description: e.target.value})}
                placeholder="Step description"
                rows={3}
              />
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setIsCurriculumDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={saveCurriculum}>
                Save Step
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
