import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Calendar } from "./ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Alert, AlertDescription } from "./ui/alert";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { defaultAddOnCatalog, type AddOnItem } from "../utils/addOnCatalog";
import { 
  Plus, 
  Palette, 
  Target, 
  FileText, 
  BarChart3, 
  Calendar as CalendarIcon,
  Upload,
  Bot,
  Users,
  Clock,
  AlertCircle,
  CheckCircle,
  X,
  DollarSign,
  Monitor,
  Smartphone,
  Globe,
  CreditCard,
  Sparkles,
  FileCheck
} from "lucide-react";

interface NewRequestModalProps {
  onSubmit?: (request: any) => void;
}

interface RequestData {
  type: string;
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
  deadline?: Date;
  assignedAgent?: string;
  additionalDetails: Record<string, any>;
  files: File[];
  paymentOption?: 'catalog' | 'included' | 'quote';
  selectedService?: AddOnItem;
}

export function NewRequestModal({ onSubmit }: NewRequestModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [requestData, setRequestData] = useState<RequestData>({
    type: '',
    title: '',
    description: '',
    priority: 'medium',
    deadline: undefined,
    assignedAgent: '',
    additionalDetails: {},
    files: [],
    paymentOption: undefined,
    selectedService: undefined
  });

  const requestTypes = [
    {
      id: 'design',
      name: 'Design & Development',
      description: 'Professional design and development services by our expert team',
      icon: Palette,
      color: 'bg-[#6F42C1]/10 text-[#6F42C1]',
      isHumanTeam: true
    },
    {
      id: 'strategy',
      name: 'Strategy Development',
      description: 'AI-powered brand strategy, positioning, and market analysis',
      icon: Target,
      color: 'bg-primary/10 text-primary',
      isHumanTeam: false
    },
    {
      id: 'content',
      name: 'Content Creation',
      description: 'AI-generated copy, blog posts, and social media content',
      icon: FileText,
      color: 'bg-[#20C997]/10 text-[#20C997]',
      isHumanTeam: false
    },
    {
      id: 'analysis',
      name: 'Data Analysis',
      description: 'AI-powered market research, competitor analysis, and insights',
      icon: BarChart3,
      color: 'bg-orange-500/10 text-orange-500',
      isHumanTeam: false
    }
  ];

  const availableAgents = [
    { id: 'brand-developer', name: 'Brand Developer Agent', specialty: 'Brand Strategy' },
    { id: 'design-team', name: 'Design Team', specialty: 'Professional Design & Development' },
    { id: 'content-agent', name: 'Content Agent', specialty: 'Content Creation' },
    { id: 'market-intelligence', name: 'Market Intelligence Agent', specialty: 'Market Analysis' }
  ];

  const designTypes = [
    {
      id: 'landing-page',
      name: 'Landing Page',
      description: 'High-converting landing pages for campaigns',
      icon: Globe,
      estimatedCost: '$2,500 - $5,000',
      timeline: '2-3 weeks'
    },
    {
      id: 'website',
      name: 'Website Design & Development',
      description: 'Complete website design and development',
      icon: Monitor,
      estimatedCost: '$5,000 - $15,000',
      timeline: '4-8 weeks'
    },
    {
      id: 'mobile-app',
      name: 'Mobile App Design',
      description: 'iOS and Android app design and prototyping',
      icon: Smartphone,
      estimatedCost: '$8,000 - $20,000',
      timeline: '6-12 weeks'
    },
    {
      id: 'branding',
      name: 'Brand Identity Package',
      description: 'Logo, brand guidelines, and visual identity',
      icon: Palette,
      estimatedCost: '$3,000 - $7,500',
      timeline: '3-4 weeks'
    },
    {
      id: 'marketing-materials',
      name: 'Marketing Materials',
      description: 'Brochures, presentations, and marketing collateral',
      icon: FileText,
      estimatedCost: '$1,500 - $3,500',
      timeline: '1-2 weeks'
    },
    {
      id: 'template-design',
      name: 'Template Design',
      description: 'Custom templates for presentations, emails, social media',
      icon: Palette,
      estimatedCost: '$800 - $2,000',
      timeline: '1-2 weeks'
    }
  ];

  const handleTypeSelect = (type: string) => {
    setRequestData(prev => ({ ...prev, type }));
    setCurrentStep(2);
  };

  const handleSubmit = () => {
    if (onSubmit) {
      onSubmit(requestData);
    }
    setIsOpen(false);
    setCurrentStep(1);
    setRequestData({
      type: '',
      title: '',
      description: '',
      priority: 'medium',
      deadline: undefined,
      assignedAgent: '',
      additionalDetails: {},
      files: [],
      paymentOption: undefined,
      selectedService: undefined
    });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const isDesignRequest = requestData.type === 'design';
  const selectedDesignType = designTypes.find(dt => dt.id === requestData.additionalDetails.designType);

  const totalSteps = isDesignRequest ? 4 : 3;

  const getStepLabel = (step: number) => {
    if (isDesignRequest) {
      switch (step) {
        case 1: return 'Type';
        case 2: return 'Details';
        case 3: return 'Payment';
        case 4: return 'Files';
        default: return '';
      }
    } else {
      switch (step) {
        case 1: return 'Type';
        case 2: return 'Details';
        case 3: return 'Files';
        default: return '';
      }
    }
  };

  const renderStepIndicator = () => (
    <div className="mb-8">
      <div className="flex items-center justify-center space-x-2 mb-3">
        {Array.from({ length: totalSteps }, (_, i) => i + 1).map((step) => (
          <div key={step} className="flex items-center">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium ${
              step <= currentStep 
                ? 'bg-cyan-accent text-dark-bg' 
                : 'bg-border-subtle text-text-secondary'
            }`}>
              {step < currentStep ? <CheckCircle className="h-5 w-5" /> : step}
            </div>
            {step < totalSteps && (
              <div className={`w-16 h-px ${
                step < currentStep ? 'bg-cyan-accent' : 'bg-border-subtle'
              }`} />
            )}
          </div>
        ))}
      </div>
      <div className="flex items-center justify-center">
        {Array.from({ length: totalSteps }, (_, i) => i + 1).map((step, index) => (
          <div key={step} className="flex items-center">
            <div className={`text-xs ${step <= currentStep ? 'text-cyan-accent' : 'text-text-secondary'}`} style={{ width: '40px', textAlign: 'center' }}>
              {getStepLabel(step)}
            </div>
            {step < totalSteps && <div style={{ width: '64px' }} />}
          </div>
        ))}
      </div>
    </div>
  );

  const renderTypeSelection = () => (
    <div className="space-y-4">
      <div className="text-center">
        <h3 className="mb-2 text-white">Select Request Type</h3>
        <p className="text-sm text-text-secondary">Choose the type of request you'd like to submit</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {requestTypes.map((type) => {
          const Icon = type.icon;
          return (
            <Card 
              key={type.id}
              className="p-4 cursor-pointer border-border-subtle hover:border-cyan-accent/50 transition-all duration-300 group"
              style={{ backgroundColor: '#1A1A1A' }}
              onClick={() => handleTypeSelect(type.id)}
            >
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${type.color}`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h4 className="text-white group-hover:text-cyan-accent transition-colors">{type.name}</h4>
                      {type.isHumanTeam && (
                        <Badge variant="secondary" className="bg-[#20C997]/10 text-[#20C997] text-xs border-[#20C997]/20">
                          <Users className="h-3 w-3 mr-1" />
                          Expert Team
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
                <p className="text-sm text-text-secondary leading-relaxed">
                  {type.description}
                </p>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );

  const renderDetailsForm = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="mb-2 text-white">Request Details</h3>
        <p className="text-sm text-text-secondary">Provide details about your request</p>
      </div>

      {isDesignRequest && (
        <Alert className="border-orange-500/20 bg-orange-500/5">
          <AlertCircle className="h-4 w-4 text-orange-500" />
          <AlertDescription className="text-orange-500">
            <strong>Design & Development Notice:</strong> Professional design services are executed by our expert human team. 
            You'll choose your payment option in the next step.
          </AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Request Title</Label>
            <Input
              id="title"
              placeholder="Enter request title"
              value={requestData.title}
              onChange={(e) => setRequestData(prev => ({ ...prev, title: e.target.value }))}
              className="bg-dark-bg border-border-subtle text-white placeholder:text-text-secondary focus:border-cyan-accent focus:ring-cyan-accent/20 transition-all duration-300"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="priority">Priority</Label>
            <Select value={requestData.priority} onValueChange={(value: any) => setRequestData(prev => ({ ...prev, priority: value }))}>
              <SelectTrigger className="bg-dark-bg border-border-subtle text-white focus:border-cyan-accent focus:ring-cyan-accent/20 transition-all duration-300">
                <SelectValue placeholder="Select priority" />
              </SelectTrigger>
              <SelectContent className="bg-card-bg border-border-subtle">
                <SelectItem value="low">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-blue-500" />
                    Low Priority
                  </div>
                </SelectItem>
                <SelectItem value="medium">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-orange-500" />
                    Medium Priority
                  </div>
                </SelectItem>
                <SelectItem value="high">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-red-500" />
                    High Priority
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Deadline</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button 
                  variant="outline" 
                  className="w-full justify-start bg-dark-bg border-border-subtle text-text-secondary hover:border-cyan-accent hover:text-white transition-all duration-300"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {requestData.deadline ? formatDate(requestData.deadline) : "Select deadline"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" style={{ backgroundColor: '#0F0F0F', borderColor: '#333333', border: '1px solid #333333' }}>
                <Calendar
                  mode="single"
                  selected={requestData.deadline}
                  onSelect={(date) => setRequestData(prev => ({ ...prev, deadline: date }))}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Describe your request in detail..."
              value={requestData.description}
              onChange={(e) => setRequestData(prev => ({ ...prev, description: e.target.value }))}
              rows={4}
              className="bg-dark-bg border-border-subtle text-white placeholder:text-text-secondary focus:border-cyan-accent focus:ring-cyan-accent/20 transition-all duration-300 resize-none"
            />
          </div>

          <div className="space-y-2">
            <Label>Assign to {isDesignRequest ? 'Team' : 'Agent'}</Label>
            <Select value={requestData.assignedAgent} onValueChange={(value) => setRequestData(prev => ({ ...prev, assignedAgent: value }))}>
              <SelectTrigger className="bg-dark-bg border-border-subtle text-white focus:border-cyan-accent focus:ring-cyan-accent/20 transition-all duration-300">
                <SelectValue placeholder={`Select ${isDesignRequest ? 'team' : 'agent'}`} />
              </SelectTrigger>
              <SelectContent className="bg-card-bg border-border-subtle">
                {availableAgents.map((agent) => (
                  <SelectItem key={agent.id} value={agent.id}>
                    <div className="flex items-center gap-2">
                      {agent.id === 'design-team' ? <Users className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
                      <div>
                        <div className="text-sm text-white">{agent.name}</div>
                        <div className="text-xs text-text-secondary">{agent.specialty}</div>
                      </div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Type-specific fields */}
      {isDesignRequest && (
        <Card className="p-4 border-border-subtle" style={{ backgroundColor: '#1A1A1A' }}>
          <h4 className="mb-3 flex items-center gap-2 text-white">
            <Palette className="h-4 w-4 text-cyan-accent" />
            Design & Development Specifications
          </h4>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Design Type</Label>
              <Select onValueChange={(value) => setRequestData(prev => ({ 
                ...prev, 
                additionalDetails: { ...prev.additionalDetails, designType: value }
              }))}>
                <SelectTrigger className="bg-dark-bg border-border-subtle text-white">
                  <SelectValue placeholder="Select design type" />
                </SelectTrigger>
                <SelectContent className="bg-card-bg border-border-subtle">
                  {designTypes.map((type) => {
                    const Icon = type.icon;
                    return (
                      <SelectItem key={type.id} value={type.id}>
                        <div className="flex items-center gap-2">
                          <Icon className="h-4 w-4" />
                          <div>
                            <div className="text-sm text-white">{type.name}</div>
                            <div className="text-xs text-text-secondary">{type.description}</div>
                          </div>
                        </div>
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            </div>

            {selectedDesignType && (
              <Card className="p-3 border-border-subtle" style={{ backgroundColor: 'rgba(34, 197, 94, 0.05)' }}>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <DollarSign className="h-4 w-4 text-green-400" />
                    <span className="text-green-400">Estimated Cost: {selectedDesignType.estimatedCost}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Clock className="h-4 w-4 text-cyan-accent" />
                    <span className="text-cyan-accent">Timeline: {selectedDesignType.timeline}</span>
                  </div>
                </div>
              </Card>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Target Audience</Label>
                <Input 
                  placeholder="e.g., B2B professionals, consumers"
                  className="bg-dark-bg border-border-subtle text-white placeholder:text-text-secondary"
                  onChange={(e) => setRequestData(prev => ({ 
                    ...prev, 
                    additionalDetails: { ...prev.additionalDetails, targetAudience: e.target.value }
                  }))}
                />
              </div>
              <div className="space-y-2">
                <Label>Budget Range</Label>
                <Select onValueChange={(value) => setRequestData(prev => ({ 
                  ...prev, 
                  additionalDetails: { ...prev.additionalDetails, budget: value }
                }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select budget range" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="under-5k">Under $5,000</SelectItem>
                    <SelectItem value="5k-10k">$5,000 - $10,000</SelectItem>
                    <SelectItem value="10k-20k">$10,000 - $20,000</SelectItem>
                    <SelectItem value="over-20k">Over $20,000</SelectItem>
                    <SelectItem value="discuss">Discuss with team</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </Card>
      )}

      {requestData.type === 'content' && (
        <Card className="p-4 bg-accent/5 border-border/50">
          <h4 className="mb-3 flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Content Requirements
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Content Type</Label>
              <Select onValueChange={(value) => setRequestData(prev => ({ 
                ...prev, 
                additionalDetails: { ...prev.additionalDetails, contentType: value }
              }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select content type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="blog">Blog Post</SelectItem>
                  <SelectItem value="social">Social Media</SelectItem>
                  <SelectItem value="email">Email Campaign</SelectItem>
                  <SelectItem value="copy">Marketing Copy</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Word Count</Label>
              <Input 
                placeholder="e.g., 500-1000 words"
                onChange={(e) => setRequestData(prev => ({ 
                  ...prev, 
                  additionalDetails: { ...prev.additionalDetails, wordCount: e.target.value }
                }))}
              />
            </div>
          </div>
        </Card>
      )}

      {requestData.type === 'strategy' && (
        <Card className="p-4 bg-accent/5 border-border/50">
          <h4 className="mb-3 flex items-center gap-2">
            <Target className="h-4 w-4" />
            Strategy Focus
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Strategy Type</Label>
              <Select onValueChange={(value) => setRequestData(prev => ({ 
                ...prev, 
                additionalDetails: { ...prev.additionalDetails, strategyType: value }
              }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select strategy type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="brand">Brand Strategy</SelectItem>
                  <SelectItem value="market">Market Positioning</SelectItem>
                  <SelectItem value="competitive">Competitive Analysis</SelectItem>
                  <SelectItem value="messaging">Messaging Framework</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Target Market</Label>
              <Input 
                placeholder="e.g., B2B SaaS, SME, Enterprise"
                onChange={(e) => setRequestData(prev => ({ 
                  ...prev, 
                  additionalDetails: { ...prev.additionalDetails, targetMarket: e.target.value }
                }))}
              />
            </div>
          </div>
        </Card>
      )}

      {requestData.type === 'analysis' && (
        <Card className="p-4 bg-accent/5 border-border/50">
          <h4 className="mb-3 flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Analysis Parameters
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Analysis Type</Label>
              <Select onValueChange={(value) => setRequestData(prev => ({ 
                ...prev, 
                additionalDetails: { ...prev.additionalDetails, analysisType: value }
              }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select analysis type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="market">Market Research</SelectItem>
                  <SelectItem value="competitor">Competitor Analysis</SelectItem>
                  <SelectItem value="performance">Performance Review</SelectItem>
                  <SelectItem value="trends">Trend Analysis</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Data Source</Label>
              <Input 
                placeholder="e.g., Google Analytics, Social Media, Surveys"
                onChange={(e) => setRequestData(prev => ({ 
                  ...prev, 
                  additionalDetails: { ...prev.additionalDetails, dataSource: e.target.value }
                }))}
              />
            </div>
          </div>
        </Card>
      )}

      <div className="flex justify-between">
        <Button variant="outline" onClick={() => setCurrentStep(1)} className="border-border-subtle hover:bg-card-bg">
          Back
        </Button>
        <Button onClick={() => setCurrentStep(isDesignRequest ? 3 : 4)} className="bg-cyan-accent hover:bg-cyan-accent/90 text-dark-bg">
          Next
        </Button>
      </div>
    </div>
  );

  const renderPaymentSelection = () => {
    // Get all catalog items
    const allCatalogItems = defaultAddOnCatalog.flatMap(category => 
      category.items.filter(item => item.enabled)
    );

    return (
      <div className="space-y-6">
        <div className="text-center">
          <h3 className="mb-2 text-white">Choose Payment Option</h3>
          <p className="text-sm text-text-secondary">How would you like to pay for this design request?</p>
        </div>

        <RadioGroup 
          value={requestData.paymentOption} 
          onValueChange={(value: 'catalog' | 'included' | 'quote') => 
            setRequestData(prev => ({ ...prev, paymentOption: value, selectedService: undefined }))
          }
          className="space-y-4"
        >
          {/* Use Design Hours Included */}
          <Card 
            className={`p-5 cursor-pointer transition-all duration-300 ${
              requestData.paymentOption === 'included'
                ? 'border-cyan-accent bg-cyan-accent/5'
                : 'border-border-subtle hover:border-cyan-accent/30'
            }`}
            style={{ backgroundColor: requestData.paymentOption === 'included' ? 'rgba(166, 224, 255, 0.05)' : '#1A1A1A' }}
            onClick={() => setRequestData(prev => ({ ...prev, paymentOption: 'included', selectedService: undefined }))}
          >
            <div className="flex items-start gap-4">
              <RadioGroupItem value="included" id="included" className="mt-1" />
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-10 h-10 bg-cyan-accent/10 rounded-lg flex items-center justify-center">
                    <Sparkles className="h-5 w-5 text-cyan-accent" />
                  </div>
                  <div>
                    <Label htmlFor="included" className="text-white cursor-pointer">
                      Use Design Hours Included
                    </Label>
                    <Badge variant="secondary" className="ml-2 bg-green-500/10 text-green-400 border-green-500/20 text-xs">
                      Recommended
                    </Badge>
                  </div>
                </div>
                <p className="text-text-secondary text-sm leading-relaxed">
                  Use your monthly included design hours. Perfect for ongoing design work and updates within your subscription plan.
                </p>
                {requestData.paymentOption === 'included' && (
                  <Alert className="mt-4 border-cyan-accent/20 bg-cyan-accent/5">
                    <CheckCircle className="h-4 w-4 text-cyan-accent" />
                    <AlertDescription className="text-cyan-accent text-sm">
                      This request will be tracked against your monthly design hour allocation.
                    </AlertDescription>
                  </Alert>
                )}
              </div>
            </div>
          </Card>

          {/* Choose from Service Catalog */}
          <Card 
            className={`p-5 cursor-pointer transition-all duration-300 ${
              requestData.paymentOption === 'catalog'
                ? 'border-violet bg-violet/5'
                : 'border-border-subtle hover:border-violet/30'
            }`}
            style={{ backgroundColor: requestData.paymentOption === 'catalog' ? 'rgba(111, 66, 193, 0.05)' : '#1A1A1A' }}
            onClick={() => setRequestData(prev => ({ ...prev, paymentOption: 'catalog' }))}
          >
            <div className="flex items-start gap-4">
              <RadioGroupItem value="catalog" id="catalog" className="mt-1" />
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-10 h-10 bg-violet/10 rounded-lg flex items-center justify-center">
                    <CreditCard className="h-5 w-5 text-violet" />
                  </div>
                  <Label htmlFor="catalog" className="text-white cursor-pointer">
                    Choose from Service Catalog
                  </Label>
                </div>
                <p className="text-text-secondary text-sm leading-relaxed mb-4">
                  Select a specific service with fixed pricing from our catalog. Great for well-defined projects.
                </p>

                {requestData.paymentOption === 'catalog' && (
                  <div className="space-y-3 mt-4">
                    <Label className="text-white text-sm">Select a Service</Label>
                    <div className="grid grid-cols-1 gap-3 max-h-[300px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-border-subtle scrollbar-track-transparent">
                      {allCatalogItems.map((service) => (
                        <Card
                          key={service.id}
                          className={`p-4 cursor-pointer transition-all duration-200 ${
                            requestData.selectedService?.id === service.id
                              ? 'border-violet bg-violet/10'
                              : 'border-border-subtle hover:border-violet/30'
                          }`}
                          style={{ backgroundColor: requestData.selectedService?.id === service.id ? 'rgba(111, 66, 193, 0.1)' : '#0F0F0F' }}
                          onClick={(e) => {
                            e.stopPropagation();
                            setRequestData(prev => ({ ...prev, selectedService: service }));
                          }}
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex-1 min-w-0">
                              <h5 className="text-white mb-1">{service.title}</h5>
                              <p className="text-text-secondary text-sm mb-2 line-clamp-2">{service.description}</p>
                              <div className="flex items-center gap-3 text-xs text-text-secondary">
                                <div className="flex items-center gap-1">
                                  <Clock className="h-3 w-3" />
                                  <span>{service.turnaround}</span>
                                </div>
                              </div>
                            </div>
                            <div className="flex flex-col items-end gap-2">
                              <Badge variant="secondary" className="bg-violet/10 text-violet border-violet/20">
                                {service.price}
                              </Badge>
                              {requestData.selectedService?.id === service.id && (
                                <CheckCircle className="h-5 w-5 text-violet" />
                              )}
                            </div>
                          </div>
                        </Card>
                      ))}
                    </div>
                    {requestData.selectedService && (
                      <Alert className="border-violet/20 bg-violet/5">
                        <CheckCircle className="h-4 w-4 text-violet" />
                        <AlertDescription className="text-violet text-sm">
                          <strong>{requestData.selectedService.title}</strong> selected - {requestData.selectedService.price}
                        </AlertDescription>
                      </Alert>
                    )}
                  </div>
                )}
              </div>
            </div>
          </Card>

          {/* Use Approved Quote */}
          <Card 
            className={`p-5 cursor-pointer transition-all duration-300 ${
              requestData.paymentOption === 'quote'
                ? 'border-teal bg-teal/5'
                : 'border-border-subtle hover:border-teal/30'
            }`}
            style={{ backgroundColor: requestData.paymentOption === 'quote' ? 'rgba(32, 201, 151, 0.05)' : '#1A1A1A' }}
            onClick={() => setRequestData(prev => ({ ...prev, paymentOption: 'quote', selectedService: undefined }))}
          >
            <div className="flex items-start gap-4">
              <RadioGroupItem value="quote" id="quote" className="mt-1" />
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-10 h-10 bg-teal/10 rounded-lg flex items-center justify-center">
                    <FileCheck className="h-5 w-5 text-teal" />
                  </div>
                  <Label htmlFor="quote" className="text-white cursor-pointer">
                    Use Approved Quote
                  </Label>
                </div>
                <p className="text-text-secondary text-sm leading-relaxed">
                  Apply this request to a previously approved quote. Select this if you have an existing quote that covers this work.
                </p>
                {requestData.paymentOption === 'quote' && (
                  <div className="mt-4 space-y-2">
                    <Label className="text-white text-sm">Quote Reference (Optional)</Label>
                    <Input
                      placeholder="e.g., Q-2024-001 or Quote #123"
                      className="bg-dark-bg border-border-subtle text-white placeholder:text-text-secondary focus:border-teal focus:ring-teal/20"
                      onChange={(e) => setRequestData(prev => ({ 
                        ...prev, 
                        additionalDetails: { ...prev.additionalDetails, quoteReference: e.target.value }
                      }))}
                    />
                  </div>
                )}
              </div>
            </div>
          </Card>
        </RadioGroup>

        <div className="flex justify-between pt-4">
          <Button variant="outline" onClick={() => setCurrentStep(2)} className="border-border-subtle hover:bg-card-bg">
            Back
          </Button>
          <Button 
            onClick={() => setCurrentStep(4)} 
            className="bg-cyan-accent hover:bg-cyan-accent/90 text-dark-bg"
            disabled={!requestData.paymentOption || (requestData.paymentOption === 'catalog' && !requestData.selectedService)}
          >
            Next
          </Button>
        </div>
      </div>
    );
  };

  const renderFileUpload = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="mb-2 text-white">Upload Files</h3>
        <p className="text-sm text-text-secondary">Add any relevant files, references, or inspiration (optional)</p>
      </div>

      <Card className="border-2 border-dashed border-border-subtle p-8 text-center hover:border-cyan-accent/50 hover:bg-cyan-accent/5 transition-all duration-300" style={{ backgroundColor: '#1A1A1A' }}>
        <Upload className="h-8 w-8 text-text-secondary mx-auto mb-3" />
        <h4 className="mb-2 text-white">Drop files here or click to browse</h4>
        <p className="text-sm text-text-secondary mb-4">
          Supports: PDF, DOC, JPG, PNG, ZIP, AI, PSD, Sketch (max 25MB)
        </p>
        <Button variant="outline" className="border-border-subtle hover:bg-card-bg hover:border-cyan-accent">Choose Files</Button>
      </Card>

      {isDesignRequest && (
        <Alert className="border-cyan-accent/20 bg-cyan-accent/5">
          <AlertCircle className="h-4 w-4 text-cyan-accent" />
          <AlertDescription className="text-cyan-accent">
            <strong>Design Brief:</strong> For best results, please include brand guidelines, style references, 
            competitor examples, or any existing assets. Our design team will review all materials before starting.
          </AlertDescription>
        </Alert>
      )}

      {isDesignRequest && requestData.paymentOption && (
        <Card className="p-4 border-border-subtle" style={{ backgroundColor: '#1A1A1A' }}>
          <div className="flex items-start gap-3">
            <CheckCircle className="h-5 w-5 text-green-400 flex-shrink-0 mt-0.5" />
            <div>
              <h5 className="text-white mb-1">Payment Option Selected</h5>
              <p className="text-text-secondary text-sm">
                {requestData.paymentOption === 'included' && 'Using monthly design hours included in your plan'}
                {requestData.paymentOption === 'catalog' && requestData.selectedService && 
                  `${requestData.selectedService.title} - ${requestData.selectedService.price}`
                }
                {requestData.paymentOption === 'quote' && 'Using approved quote'}
              </p>
            </div>
          </div>
        </Card>
      )}

      <div className="text-center">
        <p className="text-sm text-text-secondary">
          {isDesignRequest 
            ? "Our design team will contact you within 24 hours to discuss your project."
            : "You can also skip this step and provide files later"
          }
        </p>
      </div>

      <div className="flex justify-between">
        <Button variant="outline" onClick={() => setCurrentStep(isDesignRequest ? 3 : 2)} className="border-border-subtle hover:bg-card-bg">
          Back
        </Button>
        <Button onClick={handleSubmit} className="bg-cyan-accent hover:bg-cyan-accent/90 text-dark-bg">
          {isDesignRequest ? 'Submit Design Request' : 'Submit Request'}
        </Button>
      </div>
    </div>
  );

  const renderCurrentStep = () => {
    if (isDesignRequest) {
      switch (currentStep) {
        case 1:
          return renderTypeSelection();
        case 2:
          return renderDetailsForm();
        case 3:
          return renderPaymentSelection();
        case 4:
          return renderFileUpload();
        default:
          return renderTypeSelection();
      }
    } else {
      switch (currentStep) {
        case 1:
          return renderTypeSelection();
        case 2:
          return renderDetailsForm();
        case 3:
          return renderFileUpload();
        default:
          return renderTypeSelection();
      }
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="bg-cyan-accent hover:bg-cyan-accent/90 text-dark-bg glow-blue transition-all duration-300">
          <Plus className="h-4 w-4 mr-2" />
          New Request
        </Button>
      </DialogTrigger>
      <DialogContent 
        className="max-w-4xl max-h-[90vh] overflow-y-auto" 
        style={{ backgroundColor: '#0F0F0F', borderColor: '#333333', border: '1px solid #333333' }}
      >
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-white">
            <Plus className="h-5 w-5" />
            Create New Request
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {renderStepIndicator()}
          {renderCurrentStep()}
        </div>
      </DialogContent>
    </Dialog>
  );
}