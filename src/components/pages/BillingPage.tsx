import { useState, useEffect } from "react";
import { Card } from "../ui/card";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { Switch } from "../ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import {
  DollarSign,
  CreditCard,
  Users,
  CheckCircle,
  Edit,
  TrendingUp,
  Calendar,
  Plus,
  Palette,
  Code,
  Settings as SettingsIcon,
  Package,
} from "lucide-react";
import { api } from "../../utils/supabase/client";
import { toast } from "sonner@2.0.3";
import { defaultAddOnCatalog, AddOnItem, AddOnCategory } from "../../utils/addOnCatalog";

type ClientPlan = {
  clientId: string;
  clientName: string;
  plan: "starter" | "professional" | "enterprise";
  billingCycle: "monthly" | "annual";
  amount: number;
  status: "active" | "trial" | "cancelled";
  nextBillingDate: string;
  startDate: string;
};

interface BillingPageProps {
  submenu?: "invoices" | "quotes" | "addons" | "packages" | null;
}

// Add-Ons Management Component
function AddOnsManagement() {
  const [addOnCatalog, setAddOnCatalog] = useState<AddOnCategory[]>(defaultAddOnCatalog);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<AddOnItem | null>(null);
  const [editForm, setEditForm] = useState({
    title: "",
    description: "",
    turnaround: "",
    priceValue: 0,
    enabled: true,
  });

  const handleEditAddOn = (item: AddOnItem) => {
    setEditingItem(item);
    setEditForm({
      title: item.title,
      description: item.description,
      turnaround: item.turnaround,
      priceValue: item.priceValue,
      enabled: item.enabled,
    });
    setIsEditDialogOpen(true);
  };

  const handleSaveAddOn = () => {
    if (!editingItem) return;

    setAddOnCatalog(prevCatalog => 
      prevCatalog.map(category => ({
        ...category,
        items: category.items.map(item => 
          item.id === editingItem.id
            ? {
                ...item,
                title: editForm.title,
                description: editForm.description,
                turnaround: editForm.turnaround,
                priceValue: editForm.priceValue,
                price: `Starting at $${editForm.priceValue}`,
                enabled: editForm.enabled,
              }
            : item
        ),
      }))
    );

    toast.success("Add-on updated successfully");
    setIsEditDialogOpen(false);
    setEditingItem(null);
  };

  const getCategoryIcon = (categoryId: string) => {
    switch (categoryId) {
      case "creative-marketing":
        return <Palette className="h-4 w-4" />;
      case "design-development":
        return <Code className="h-4 w-4" />;
      case "operations-systems":
        return <SettingsIcon className="h-4 w-4" />;
      default:
        return <Package className="h-4 w-4" />;
    }
  };

  const allAddOns = addOnCatalog.flatMap(category => 
    category.items.map(item => ({ ...item, categoryTitle: category.title, categoryId: category.id }))
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl text-white mb-1">Add-On Catalog</h2>
          <p className="text-text-secondary">Manage pricing and details for additional services</p>
        </div>
        <Button className="bg-cyan-accent hover:bg-cyan-accent/90 text-dark-bg">
          <Plus className="h-4 w-4 mr-2" />
          Add New Service
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {addOnCatalog.map((category) => (
          <Card key={category.id} className={`p-6 glass-card border-border-subtle`}>
            <div className="flex items-center gap-3 mb-3">
              <div className={`w-12 h-12 ${category.bgColor} rounded-xl flex items-center justify-center`}>
                <span className={category.color}>{getCategoryIcon(category.id)}</span>
              </div>
              <div>
                <p className="text-2xl text-white">{category.items.filter(i => i.enabled).length}</p>
                <p className="text-sm text-text-secondary">Active</p>
              </div>
            </div>
            <p className="text-sm text-white">{category.title}</p>
          </Card>
        ))}
      </div>

      {/* Add-Ons Table */}
      <Card className="glass-card border-border-subtle">
        <div className="p-6 border-b border-border-subtle">
          <h4 className="text-white">All Add-On Services</h4>
          <p className="text-text-secondary text-sm mt-1">
            Configure pricing, descriptions, and availability for each service
          </p>
        </div>
        <Table>
          <TableHeader>
            <TableRow className="border-border-subtle hover:bg-transparent">
              <TableHead className="text-text-secondary">Service</TableHead>
              <TableHead className="text-text-secondary">Category</TableHead>
              <TableHead className="text-text-secondary">Description</TableHead>
              <TableHead className="text-text-secondary">Turnaround</TableHead>
              <TableHead className="text-text-secondary">Price</TableHead>
              <TableHead className="text-text-secondary">Status</TableHead>
              <TableHead className="text-text-secondary">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {allAddOns.map((item) => (
              <TableRow key={item.id} className="border-border-subtle hover:bg-card-bg/50">
                <TableCell className="text-white">{item.title}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    {getCategoryIcon(item.categoryId)}
                    <span className="text-text-secondary text-sm">{item.categoryTitle}</span>
                  </div>
                </TableCell>
                <TableCell className="text-text-secondary max-w-xs truncate">
                  {item.description}
                </TableCell>
                <TableCell className="text-text-secondary">{item.turnaround}</TableCell>
                <TableCell className="text-white">${item.priceValue}</TableCell>
                <TableCell>
                  <Badge
                    variant="outline"
                    className={
                      item.enabled
                        ? "bg-green-500/10 text-green-400 border-green-500/20"
                        : "bg-text-secondary/10 text-text-secondary border-text-secondary/20"
                    }
                  >
                    {item.enabled ? "Active" : "Disabled"}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEditAddOn(item)}
                    className="text-text-secondary hover:text-cyan-accent"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      {/* Edit Add-On Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent 
          className="max-w-2xl" 
          style={{ backgroundColor: '#0F0F0F', borderColor: '#333333', border: '1px solid #333333' }}
        >
          <DialogHeader>
            <DialogTitle className="text-white">Edit Add-On Service</DialogTitle>
            <DialogDescription className="text-text-secondary">
              Update pricing and details for {editingItem?.title}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label className="text-white">Service Title</Label>
              <Input
                value={editForm.title}
                onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                placeholder="Service title"
                className="bg-dark-bg border-border-subtle text-white placeholder:text-text-secondary"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-white">Description</Label>
              <Textarea
                value={editForm.description}
                onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                placeholder="Service description"
                rows={3}
                className="bg-dark-bg border-border-subtle text-white placeholder:text-text-secondary"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-white">Turnaround Time</Label>
                <Input
                  value={editForm.turnaround}
                  onChange={(e) => setEditForm({ ...editForm, turnaround: e.target.value })}
                  placeholder="e.g., 1-2 weeks"
                  className="bg-dark-bg border-border-subtle text-white placeholder:text-text-secondary"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-white">Starting Price ($)</Label>
                <Input
                  type="number"
                  value={editForm.priceValue}
                  onChange={(e) => setEditForm({ ...editForm, priceValue: parseInt(e.target.value) || 0 })}
                  placeholder="0"
                  className="bg-dark-bg border-border-subtle text-white placeholder:text-text-secondary"
                />
              </div>
            </div>

            <div className="flex items-center justify-between p-4 rounded-lg border bg-cyan-accent/10 border-cyan-accent/20">
              <div>
                <Label className="text-white">Service Status</Label>
                <p className="text-sm text-text-secondary mt-1">
                  {editForm.enabled ? "Visible to clients" : "Hidden from clients"}
                </p>
              </div>
              <Switch
                checked={editForm.enabled}
                onCheckedChange={(checked) => setEditForm({ ...editForm, enabled: checked })}
              />
            </div>
          </div>
          <div className="flex justify-end gap-3">
            <Button
              variant="ghost"
              onClick={() => setIsEditDialogOpen(false)}
              className="text-text-secondary hover:text-white"
            >
              Cancel
            </Button>
            <Button
              className="bg-cyan-accent hover:bg-cyan-accent/80 text-dark-bg"
              onClick={handleSaveAddOn}
            >
              <CheckCircle className="h-4 w-4 mr-2" />
              Save Changes
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export function BillingPage({ submenu }: BillingPageProps = {}) {
  const [clientPlans, setClientPlans] = useState<ClientPlan[]>([]);
  const [isEditPlanDialogOpen, setIsEditPlanDialogOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState<ClientPlan | null>(null);
  const [planForm, setPlanForm] = useState({
    plan: "starter" as "starter" | "professional" | "enterprise",
    billingCycle: "monthly" as "monthly" | "annual",
    amount: 0,
    status: "active" as "active" | "trial" | "cancelled",
  });

  useEffect(() => {
    loadClientPlans();
  }, []);

  const loadClientPlans = async () => {
    try {
      const response = await api.getClientPlans();
      if (response.success && response.data) {
        setClientPlans(response.data);
      }
    } catch (error) {
      console.error("Error loading client plans:", error);
    }
  };

  const handleEditPlan = (plan: ClientPlan) => {
    setEditingPlan(plan);
    setPlanForm({
      plan: plan.plan,
      billingCycle: plan.billingCycle,
      amount: plan.amount,
      status: plan.status,
    });
    setIsEditPlanDialogOpen(true);
  };

  const handleUpdatePlan = async () => {
    if (!editingPlan) return;

    try {
      const response = await api.updateClientPlan(editingPlan.clientId, planForm);
      if (response.success) {
        toast.success("Plan updated successfully");
        await loadClientPlans();
        setIsEditPlanDialogOpen(false);
        setEditingPlan(null);
      } else {
        toast.error(response.error || "Failed to update plan");
      }
    } catch (error) {
      console.error("Error updating plan:", error);
      toast.error("Failed to update plan");
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-500/10 text-green-400 border-green-500/20";
      case "trial":
        return "bg-blue-500/10 text-blue-400 border-blue-500/20";
      case "cancelled":
        return "bg-text-secondary/10 text-text-secondary border-text-secondary/20";
      default:
        return "bg-text-secondary/10 text-text-secondary border-text-secondary/20";
    }
  };

  const getPlanColor = (plan: string) => {
    switch (plan) {
      case "starter":
        return "bg-cyan-accent/10 text-cyan-accent border-cyan-accent/20";
      case "professional":
        return "bg-violet/10 text-violet border-violet/20";
      case "enterprise":
        return "bg-teal/10 text-teal border-teal/20";
      default:
        return "bg-text-secondary/10 text-text-secondary border-text-secondary/20";
    }
  };

  const activePlans = clientPlans.filter((p) => p.status === "active");
  const trialPlans = clientPlans.filter((p) => p.status === "trial");
  const monthlyRevenue = activePlans.reduce((sum, p) => sum + p.amount, 0);
  const annualRevenue = monthlyRevenue * 12;

  // Render submenu content if selected
  if (submenu === "invoices") {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl text-white mb-1">Invoices</h2>
          <p className="text-gray-400">Manage and track client invoices</p>
        </div>
        <Card className="glass-card border-border-subtle p-8">
          <div className="text-center py-12">
            <DollarSign className="h-16 w-16 text-cyan-accent mx-auto mb-4 opacity-50" />
            <p className="text-white mb-2">Invoice management coming soon</p>
            <p className="text-gray-400 text-sm">Track payments, send invoices, and manage billing history</p>
          </div>
        </Card>
      </div>
    );
  }

  if (submenu === "quotes") {
    // Import QuotesManagementPage dynamically
    const { QuotesManagementPage } = require("./QuotesManagementPage");
    return <QuotesManagementPage />;
  }

  if (submenu === "addons") {
    return <AddOnsManagement />;
  }

  if (submenu === "packages") {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl text-white mb-1">Packages</h2>
          <p className="text-gray-400">Configure service packages and pricing tiers</p>
        </div>
        <Card className="glass-card border-border-subtle p-8">
          <div className="text-center py-12">
            <Users className="h-16 w-16 text-cyan-accent mx-auto mb-4 opacity-50" />
            <p className="text-white mb-2">Package management coming soon</p>
            <p className="text-gray-400 text-sm">Create and customize service packages for different client needs</p>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl text-white mb-1">Billing & Subscriptions</h2>
        <p className="text-text-secondary">
          Manage client subscription plans and billing information
        </p>
      </div>

      {/* Revenue Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-6 bg-gradient-to-br from-cyan-accent/10 to-cyan-accent/5 border-cyan-accent/20">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 bg-cyan-accent/10 rounded-xl flex items-center justify-center">
              <DollarSign className="h-6 w-6 text-cyan-accent" />
            </div>
            <div>
              <p className="text-2xl text-white">${monthlyRevenue.toLocaleString()}</p>
              <p className="text-sm text-text-secondary">Monthly Revenue</p>
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-teal/10 to-teal/5 border-teal/20">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 bg-teal/10 rounded-xl flex items-center justify-center">
              <TrendingUp className="h-6 w-6 text-teal" />
            </div>
            <div>
              <p className="text-2xl text-white">${annualRevenue.toLocaleString()}</p>
              <p className="text-sm text-text-secondary">Annual Projection</p>
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-green-500/10 to-green-500/5 border-green-500/20">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 bg-green-500/10 rounded-xl flex items-center justify-center">
              <CheckCircle className="h-6 w-6 text-green-400" />
            </div>
            <div>
              <p className="text-2xl text-white">{activePlans.length}</p>
              <p className="text-sm text-text-secondary">Active Plans</p>
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-blue-500/10 to-blue-500/5 border-blue-500/20">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center">
              <Users className="h-6 w-6 text-blue-400" />
            </div>
            <div>
              <p className="text-2xl text-white">{trialPlans.length}</p>
              <p className="text-sm text-text-secondary">Trial Users</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Plan Distribution */}
      <div className="grid grid-cols-3 gap-4">
        <Card className="p-4 glass-card border-border-subtle">
          <div className="flex items-center justify-between mb-2">
            <span className="text-text-secondary text-sm">Starter Plans</span>
            <Badge variant="outline" className={getPlanColor("starter")}>
              {clientPlans.filter((p) => p.plan === "starter").length}
            </Badge>
          </div>
          <p className="text-2xl text-white">
            ${clientPlans
              .filter((p) => p.plan === "starter" && p.status === "active")
              .reduce((sum, p) => sum + p.amount, 0)
              .toLocaleString()}
            /mo
          </p>
        </Card>

        <Card className="p-4 glass-card border-border-subtle">
          <div className="flex items-center justify-between mb-2">
            <span className="text-text-secondary text-sm">Professional Plans</span>
            <Badge variant="outline" className={getPlanColor("professional")}>
              {clientPlans.filter((p) => p.plan === "professional").length}
            </Badge>
          </div>
          <p className="text-2xl text-white">
            ${clientPlans
              .filter((p) => p.plan === "professional" && p.status === "active")
              .reduce((sum, p) => sum + p.amount, 0)
              .toLocaleString()}
            /mo
          </p>
        </Card>

        <Card className="p-4 glass-card border-border-subtle">
          <div className="flex items-center justify-between mb-2">
            <span className="text-text-secondary text-sm">Enterprise Plans</span>
            <Badge variant="outline" className={getPlanColor("enterprise")}>
              {clientPlans.filter((p) => p.plan === "enterprise").length}
            </Badge>
          </div>
          <p className="text-2xl text-white">
            ${clientPlans
              .filter((p) => p.plan === "enterprise" && p.status === "active")
              .reduce((sum, p) => sum + p.amount, 0)
              .toLocaleString()}
            /mo
          </p>
        </Card>
      </div>

      {/* Client Plans Table */}
      <Card className="glass-card border-border-subtle">
        <div className="p-6 border-b border-border-subtle">
          <h4 className="text-white">All Client Plans</h4>
          <p className="text-text-secondary text-sm mt-1">
            View and manage subscription details for all clients
          </p>
        </div>
        <Table>
          <TableHeader>
            <TableRow className="border-border-subtle hover:bg-transparent">
              <TableHead className="text-text-secondary">Client</TableHead>
              <TableHead className="text-text-secondary">Plan</TableHead>
              <TableHead className="text-text-secondary">Billing Cycle</TableHead>
              <TableHead className="text-text-secondary">Amount</TableHead>
              <TableHead className="text-text-secondary">Status</TableHead>
              <TableHead className="text-text-secondary">Next Billing</TableHead>
              <TableHead className="text-text-secondary">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {clientPlans.length === 0 ? (
              <TableRow className="border-border-subtle hover:bg-transparent">
                <TableCell colSpan={7} className="text-center text-text-secondary py-8">
                  No client plans configured yet.
                </TableCell>
              </TableRow>
            ) : (
              clientPlans.map((plan) => (
                <TableRow key={plan.clientId} className="border-border-subtle hover:bg-card-bg/50">
                  <TableCell className="text-white">{plan.clientName}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className={getPlanColor(plan.plan)}>
                      {plan.plan}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2 text-text-secondary">
                      <Calendar className="h-4 w-4" />
                      <span className="capitalize">{plan.billingCycle}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-white">${plan.amount}/mo</TableCell>
                  <TableCell>
                    <Badge variant="outline" className={getStatusColor(plan.status)}>
                      {plan.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-text-secondary">
                    {new Date(plan.nextBillingDate).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEditPlan(plan)}
                      className="text-text-secondary hover:text-cyan-accent"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Card>

      {/* Edit Plan Dialog */}
      <Dialog open={isEditPlanDialogOpen} onOpenChange={setIsEditPlanDialogOpen}>
        <DialogContent className="max-w-2xl" style={{ backgroundColor: '#0F0F0F', borderColor: '#333333', border: '1px solid #333333' }}>
          <DialogHeader>
            <DialogTitle className="text-white">Edit Client Plan</DialogTitle>
            <DialogDescription className="text-text-secondary">
              Update subscription plan for {editingPlan?.clientName}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-white">Plan Type</Label>
                <Select
                  value={planForm.plan}
                  onValueChange={(value: "starter" | "professional" | "enterprise") =>
                    setPlanForm({ ...planForm, plan: value })
                  }
                >
                  <SelectTrigger className="bg-dark-bg border-border-subtle text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-card-bg border-border-subtle">
                    <SelectItem value="starter">Starter</SelectItem>
                    <SelectItem value="professional">Professional</SelectItem>
                    <SelectItem value="enterprise">Enterprise</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-white">Billing Cycle</Label>
                <Select
                  value={planForm.billingCycle}
                  onValueChange={(value: "monthly" | "annual") =>
                    setPlanForm({ ...planForm, billingCycle: value })
                  }
                >
                  <SelectTrigger className="bg-dark-bg border-border-subtle text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-card-bg border-border-subtle">
                    <SelectItem value="monthly">Monthly</SelectItem>
                    <SelectItem value="annual">Annual</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-white">Amount (per month)</Label>
                <Input
                  type="number"
                  value={planForm.amount}
                  onChange={(e) => setPlanForm({ ...planForm, amount: parseInt(e.target.value) || 0 })}
                  placeholder="0"
                  className="bg-dark-bg border-border-subtle text-white placeholder:text-text-secondary"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-white">Status</Label>
                <Select
                  value={planForm.status}
                  onValueChange={(value: "active" | "trial" | "cancelled") =>
                    setPlanForm({ ...planForm, status: value })
                  }
                >
                  <SelectTrigger className="bg-dark-bg border-border-subtle text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-card-bg border-border-subtle">
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="trial">Trial</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <div className="flex justify-end gap-3">
            <Button
              variant="ghost"
              onClick={() => setIsEditPlanDialogOpen(false)}
              className="text-text-secondary hover:text-white"
            >
              Cancel
            </Button>
            <Button
              className="bg-cyan-accent hover:bg-cyan-accent/80 text-dark-bg"
              onClick={handleUpdatePlan}
            >
              <CreditCard className="h-4 w-4 mr-2" />
              Update Plan
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
