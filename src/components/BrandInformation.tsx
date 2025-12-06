import { useState, useEffect } from "react";
import { Card } from "./ui/card";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Label } from "./ui/label";
import { Button } from "./ui/button";
import { Save, Loader2 } from "lucide-react";
import { api } from "../utils/supabase/client";
import { toast } from "sonner@2.0.3";

interface BrandData {
  companyName: string;
  industry: string;
  targetAudience: string;
  brandPersonality: string;
  challenges: string;
}

export function BrandInformation() {
  const [brandData, setBrandData] = useState<BrandData>({
    companyName: '',
    industry: '',
    targetAudience: '',
    brandPersonality: '',
    challenges: ''
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    loadBrandData();
  }, []);

  const loadBrandData = async () => {
    try {
      const response = await api.getBrandInfo();
      if (response.success) {
        setBrandData({
          companyName: response.data.companyName || 'ACME Corporation',
          industry: response.data.industry || 'Technology',
          targetAudience: response.data.targetAudience || 'B2B SaaS companies, 50-500 employees',
          brandPersonality: response.data.brandPersonality || 'Innovative, trustworthy, and customer-focused. Goal to become the leading platform for small businesses.',
          challenges: response.data.challenges || 'Brand awareness in new markets, competing with established players, consistent messaging across channels.'
        });
      }
    } catch (error) {
      console.error('Error loading brand data:', error);
      toast.error('Failed to load brand information');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const response = await api.saveBrandInfo(brandData);
      if (response.success) {
        toast.success('Brand information saved successfully');
      } else {
        toast.error('Failed to save brand information');
      }
    } catch (error) {
      console.error('Error saving brand data:', error);
      toast.error('Failed to save brand information');
    } finally {
      setIsSaving(false);
    }
  };

  const handleInputChange = (field: keyof BrandData, value: string) => {
    setBrandData(prev => ({ ...prev, [field]: value }));
  };

  if (isLoading) {
    return (
      <Card className="p-6 glass backdrop-blur-heavy border-white/20 shadow-2xl bg-white/10">
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin text-cyan-accent" />
          <span className="ml-2 text-white/90">Loading brand information...</span>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6 glass backdrop-blur-heavy border-white/20 shadow-2xl bg-white/10">
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="company-name" className="text-white/90">Company Name</Label>
            <Input
              id="company-name"
              placeholder="Enter company name"
              value={brandData.companyName}
              onChange={(e) => handleInputChange('companyName', e.target.value)}
              className="bg-white/10 border-white/20 focus:border-white/40 focus:bg-white/15 transition-all duration-300 text-white placeholder:text-white/60 backdrop-blur-light"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="industry" className="text-white/90">Industry</Label>
            <Input
              id="industry"
              placeholder="e.g., Technology, Healthcare"
              value={brandData.industry}
              onChange={(e) => handleInputChange('industry', e.target.value)}
              className="bg-white/10 border-white/20 focus:border-white/40 focus:bg-white/15 transition-all duration-300 text-white placeholder:text-white/60 backdrop-blur-light"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="target-audience" className="text-white/90">Target Audience</Label>
          <Input
            id="target-audience"
            placeholder="Describe your target audience"
            value={brandData.targetAudience}
            onChange={(e) => handleInputChange('targetAudience', e.target.value)}
            className="bg-white/10 border-white/20 focus:border-white/40 focus:bg-white/15 transition-all duration-300 text-white placeholder:text-white/60 backdrop-blur-light"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="brand-personality" className="text-white/90">Brand Personality &amp; Goals</Label>
          <Textarea
            id="brand-personality"
            placeholder="Describe your brand's personality and key goals"
            value={brandData.brandPersonality}
            onChange={(e) => handleInputChange('brandPersonality', e.target.value)}
            rows={3}
            className="bg-white/10 border-white/20 focus:border-white/40 focus:bg-white/15 transition-all duration-300 text-white placeholder:text-white/60 backdrop-blur-light resize-none"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="challenges" className="text-white/90">Current Challenges</Label>
          <Textarea
            id="challenges"
            placeholder="What challenges is your brand currently facing?"
            value={brandData.challenges}
            onChange={(e) => handleInputChange('challenges', e.target.value)}
            rows={3}
            className="bg-white/10 border-white/20 focus:border-white/40 focus:bg-white/15 transition-all duration-300 text-white placeholder:text-white/60 backdrop-blur-light resize-none"
          />
        </div>

        <Button 
          onClick={handleSave}
          disabled={isSaving}
          className="w-full md:w-auto bg-cyan-accent hover:bg-cyan-accent/90 text-dark-bg glow-cyan transition-all duration-300 shadow-lg nav-item-glow"
        >
          {isSaving ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="h-4 w-4 mr-2" />
              Save Changes
            </>
          )}
        </Button>
      </div>
    </Card>
  );
}