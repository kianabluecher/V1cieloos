import { useState, useEffect } from "react";
import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { Badge } from "../ui/badge";
import { Separator } from "../ui/separator";
import { Checkbox } from "../ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import {
  Plus,
  FileText,
  Send,
  Eye,
  Edit,
  Trash2,
  Check,
  X,
  DollarSign,
  Calendar,
  User,
  Package,
  Search,
  Filter,
  Copy,
  Link as LinkIcon,
  Printer,
} from "lucide-react";
import { api } from "../../utils/supabase/client";
import { toast } from "sonner@2.0.3";
import { defaultAddOnCatalog } from "../../utils/addOnCatalog";

type Customer = {
  id: string;
  name: string;
  email: string;
  company?: string;
  phone?: string;
};

type CatalogItem = {
  id: string;
  name: string;
  description?: string;
  price: number;
  sku?: string;
  category?: string;
};

type QuoteItem = {
  id: string;
  name: string;
  description?: string;
  quantity: number;
  unit_price: number;
  total: number;
};

type Quote = {
  id: string;
  quote_number: string;
  customer_id: string;
  customer_name: string;
  status: "draft" | "sent" | "accepted" | "declined" | "expired";
  valid_until?: string;
  subtotal: number;
  tax_rate: number;
  tax_amount: number;
  discount_amount: number;
  total: number;
  notes?: string;
  terms?: string;
  created_at: string;
  items: QuoteItem[];
};

export function QuotesManagementPage() {
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [catalogItems, setCatalogItems] = useState<CatalogItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  
  // Quote Builder State
  const [isQuoteBuilderOpen, setIsQuoteBuilderOpen] = useState(false);
  const [isAddItemModalOpen, setIsAddItemModalOpen] = useState(false);
  const [editingQuote, setEditingQuote] = useState<Quote | null>(null);
  const [quoteForm, setQuoteForm] = useState({
    customer_id: "",
    valid_until: "",
    notes: "",
    terms: "Payment due within 30 days of quote acceptance. Quote valid for 30 days from issue date.",
    tax_rate: 10,
    discount_amount: 0,
  });
  const [quoteItems, setQuoteItems] = useState<QuoteItem[]>([]);
  const [notifyCustomer, setNotifyCustomer] = useState(true);
  const [quoteLink, setQuoteLink] = useState<string | null>(null);
  const [previewQuote, setPreviewQuote] = useState<Quote | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  
  // Customer & Catalog Management
  const [isCustomerDialogOpen, setIsCustomerDialogOpen] = useState(false);
  const [customerForm, setCustomerForm] = useState({
    name: "",
    email: "",
    company: "",
    phone: "",
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [quotesRes, customersRes, catalogRes, clientsRes] = await Promise.all([
        api.getQuotes(),
        api.getQuoteCustomers(),
        api.getCatalogItems(),
        api.getClients(),
      ]);

      if (quotesRes.success) setQuotes(quotesRes.data || []);
      if (customersRes.success) setCustomers(customersRes.data || []);
      
      // Merge catalog items with add-ons from the catalog
      const catalogData: CatalogItem[] = catalogRes.success ? catalogRes.data || [] : [];
      
      // Add add-ons from defaultAddOnCatalog
      const addOnItems: CatalogItem[] = defaultAddOnCatalog.flatMap(category => 
        category.items.filter(item => item.enabled).map(item => ({
          id: item.id,
          name: item.title,
          description: item.description,
          price: item.priceValue,
          sku: item.id,
          category: category.title,
        }))
      );
      
      setCatalogItems([...catalogData, ...addOnItems]);
      
      // Sync customers with clients
      if (clientsRes.success && clientsRes.data) {
        const existingCustomerEmails = new Set(customersRes.data?.map((c: Customer) => c.email) || []);
        const clientCustomers: Customer[] = clientsRes.data
          .filter((client: any) => !existingCustomerEmails.has(client.email))
          .map((client: any) => ({
            id: client.id,
            name: client.name,
            email: client.email,
            company: client.company || "",
            phone: client.phone || "",
          }));
        
        setCustomers([...(customersRes.data || []), ...clientCustomers]);
      }
    } catch (error) {
      console.error("Error loading data:", error);
      toast.error("Failed to load quotes data");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateCustomer = async () => {
    if (!customerForm.name || !customerForm.email) {
      toast.error("Name and email are required");
      return;
    }

    try {
      // Create both as quote customer and as client
      const [quoteCustomerRes, clientRes] = await Promise.all([
        api.createQuoteCustomer(customerForm),
        api.createClient({
          name: customerForm.name,
          email: customerForm.email,
          company: customerForm.company,
          phone: customerForm.phone,
          status: "active",
          plan: "starter",
        }),
      ]);
      
      if (quoteCustomerRes.success || clientRes.success) {
        toast.success("Customer created successfully");
        setIsCustomerDialogOpen(false);
        setCustomerForm({ name: "", email: "", company: "", phone: "" });
        loadData();
      } else {
        toast.error("Failed to create customer");
      }
    } catch (error) {
      console.error("Error creating customer:", error);
      toast.error("Failed to create customer");
    }
  };



  const handleAddItemToQuote = (item: CatalogItem) => {
    const newItem: QuoteItem = {
      id: Date.now().toString(),
      name: item.name,
      description: item.description,
      quantity: 1,
      unit_price: item.price,
      total: item.price,
    };
    setQuoteItems([...quoteItems, newItem]);
    setIsAddItemModalOpen(false);
    toast.success(`Added ${item.name} to quote`);
  };

  const handleAddCustomItem = () => {
    const newItem: QuoteItem = {
      id: Date.now().toString(),
      name: "Custom Item",
      description: "",
      quantity: 1,
      unit_price: 0,
      total: 0,
    };
    setQuoteItems([...quoteItems, newItem]);
    toast.success("Added custom item");
  };

  const handleUpdateQuoteItem = (itemId: string, field: string, value: any) => {
    setQuoteItems(quoteItems.map(item => {
      if (item.id === itemId) {
        const updated = { ...item, [field]: value };
        if (field === "quantity" || field === "unit_price") {
          updated.total = updated.quantity * updated.unit_price;
        }
        return updated;
      }
      return item;
    }));
  };

  const handleRemoveQuoteItem = (itemId: string) => {
    setQuoteItems(quoteItems.filter(item => item.id !== itemId));
  };

  const calculateQuoteTotals = () => {
    const subtotal = quoteItems.reduce((sum, item) => sum + item.total, 0);
    const tax_amount = (subtotal * quoteForm.tax_rate) / 100;
    const total = subtotal + tax_amount - quoteForm.discount_amount;
    return { subtotal, tax_amount, total };
  };

  const handleSaveQuote = async (sendToCustomer: boolean = false) => {
    if (!quoteForm.customer_id) {
      toast.error("Please select a customer");
      return;
    }
    if (quoteItems.length === 0) {
      toast.error("Please add at least one item");
      return;
    }

    const totals = calculateQuoteTotals();
    const customer = customers.find(c => c.id === quoteForm.customer_id);

    const quoteData = {
      ...quoteForm,
      customer_name: customer?.name || "",
      status: (sendToCustomer || notifyCustomer) ? "sent" : "draft",
      subtotal: totals.subtotal,
      tax_amount: totals.tax_amount,
      total: totals.total,
      items: quoteItems,
    };

    try {
      let response;
      if (editingQuote) {
        response = await api.updateQuote(editingQuote.id, quoteData);
      } else {
        response = await api.createQuote(quoteData);
      }

      if (response.success) {
        const quoteId = response.data.id || response.data.quote_number;
        const shareableLink = `${window.location.origin}/quote/${quoteId}`;
        setQuoteLink(shareableLink);
        
        if (sendToCustomer || notifyCustomer) {
          // Send email to customer
          await api.sendQuoteEmail(response.data.id);
          toast.success("Quote sent to customer!");
        } else {
          toast.success(editingQuote ? "Quote updated" : "Quote saved as draft");
        }
        
        // Don't close the builder immediately if we have a link to show
        if (!sendToCustomer && !notifyCustomer) {
          handleCloseQuoteBuilder();
        }
        loadData();
      } else {
        toast.error(response.error || "Failed to save quote");
      }
    } catch (error) {
      console.error("Error saving quote:", error);
      toast.error("Failed to save quote");
    }
  };

  const handleSendQuote = async (quoteId: string) => {
    try {
      const response = await api.sendQuoteEmail(quoteId);
      if (response.success) {
        toast.success("Quote sent to customer!");
        loadData();
      } else {
        toast.error(response.error || "Failed to send quote");
      }
    } catch (error) {
      console.error("Error sending quote:", error);
      toast.error("Failed to send quote");
    }
  };

  const handleDeleteQuote = async (quoteId: string) => {
    if (!confirm("Are you sure you want to delete this quote?")) return;

    try {
      const response = await api.deleteQuote(quoteId);
      if (response.success) {
        toast.success("Quote deleted");
        loadData();
      } else {
        toast.error(response.error || "Failed to delete quote");
      }
    } catch (error) {
      console.error("Error deleting quote:", error);
      toast.error("Failed to delete quote");
    }
  };

  const handleOpenQuoteBuilder = (quote?: Quote) => {
    if (quote) {
      setEditingQuote(quote);
      setQuoteForm({
        customer_id: quote.customer_id,
        valid_until: quote.valid_until || "",
        notes: quote.notes || "",
        terms: quote.terms || "",
        tax_rate: quote.tax_rate,
        discount_amount: quote.discount_amount,
      });
      setQuoteItems(quote.items);
    } else {
      setEditingQuote(null);
      setQuoteForm({
        customer_id: "",
        valid_until: "",
        notes: "",
        terms: "Payment due within 30 days of quote acceptance. Quote valid for 30 days from issue date.",
        tax_rate: 10,
        discount_amount: 0,
      });
      setQuoteItems([]);
      setNotifyCustomer(true); // Reset to default checked
      setQuoteLink(null);
    }
    setIsQuoteBuilderOpen(true);
  };

  const handleCloseQuoteBuilder = () => {
    setIsQuoteBuilderOpen(false);
    setEditingQuote(null);
    setQuoteItems([]);
    setQuoteLink(null);
    setNotifyCustomer(true);
  };
  
  const handleCopyLink = () => {
    if (quoteLink) {
      navigator.clipboard.writeText(quoteLink);
      toast.success("Link copied to clipboard!");
    }
  };

  const handlePreviewQuote = (quote: Quote) => {
    setPreviewQuote(quote);
    setIsPreviewOpen(true);
  };

  const handlePrintQuote = () => {
    window.print();
  };

  const getStatusBadge = (status: string) => {
    const styles = {
      draft: "bg-gray-500/10 text-gray-400 border-gray-500/20",
      sent: "bg-blue-500/10 text-blue-400 border-blue-500/20",
      accepted: "bg-green-500/10 text-green-400 border-green-500/20",
      declined: "bg-red-500/10 text-red-400 border-red-500/20",
      expired: "bg-orange-500/10 text-orange-400 border-orange-500/20",
    };
    return (
      <Badge variant="outline" className={styles[status as keyof typeof styles]}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const filteredQuotes = quotes.filter(quote => {
    const matchesSearch = quote.quote_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
      quote.customer_name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || quote.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totals = calculateQuoteTotals();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-white">Loading quotes...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-white text-2xl">Quotes & Proposals</h2>
          <p className="text-text-secondary mt-1">
            Create and manage quotes, send to customers, and convert to invoices
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            onClick={() => setIsCustomerDialogOpen(true)}
            variant="outline"
            className="border-cyan-accent/20 text-cyan-accent hover:bg-cyan-accent/10"
          >
            <User className="h-4 w-4 mr-2" />
            New Customer
          </Button>
          <Button
            onClick={() => handleOpenQuoteBuilder()}
            className="bg-cyan-accent hover:bg-cyan-accent/80 text-dark-bg"
          >
            <Plus className="h-4 w-4 mr-2" />
            Create Quote
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-4 gap-4">
        <Card className="border-border-subtle p-4" style={{ backgroundColor: '#1A1A1A' }}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-500/10 rounded-lg flex items-center justify-center">
              <FileText className="h-5 w-5 text-blue-400" />
            </div>
            <div>
              <p className="text-text-secondary text-sm">Total Quotes</p>
              <p className="text-white text-xl">{quotes.length}</p>
            </div>
          </div>
        </Card>
        <Card className="border-border-subtle p-4" style={{ backgroundColor: '#1A1A1A' }}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-cyan-accent/10 rounded-lg flex items-center justify-center">
              <Send className="h-5 w-5 text-cyan-accent" />
            </div>
            <div>
              <p className="text-text-secondary text-sm">Sent</p>
              <p className="text-white text-xl">{quotes.filter(q => q.status === "sent").length}</p>
            </div>
          </div>
        </Card>
        <Card className="border-border-subtle p-4" style={{ backgroundColor: '#1A1A1A' }}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-500/10 rounded-lg flex items-center justify-center">
              <Check className="h-5 w-5 text-green-400" />
            </div>
            <div>
              <p className="text-text-secondary text-sm">Accepted</p>
              <p className="text-white text-xl">{quotes.filter(q => q.status === "accepted").length}</p>
            </div>
          </div>
        </Card>
        <Card className="border-border-subtle p-4" style={{ backgroundColor: '#1A1A1A' }}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-violet/10 rounded-lg flex items-center justify-center">
              <DollarSign className="h-5 w-5 text-violet" />
            </div>
            <div>
              <p className="text-text-secondary text-sm">Total Value</p>
              <p className="text-white text-xl">${quotes.reduce((sum, q) => sum + q.total, 0).toFixed(2)}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Filters */}
      <Card className="border-border-subtle p-4" style={{ backgroundColor: '#1A1A1A' }}>
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-text-secondary" />
              <Input
                placeholder="Search by quote number or customer..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-dark-bg border-border-subtle text-white"
              />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-text-secondary" />
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-40 bg-dark-bg border-border-subtle text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-[#0F0F0F] border-border-subtle">
                <SelectItem value="all" className="text-white focus:bg-cyan-accent/10 focus:text-cyan-accent">All Status</SelectItem>
                <SelectItem value="draft" className="text-white focus:bg-cyan-accent/10 focus:text-cyan-accent">Draft</SelectItem>
                <SelectItem value="sent" className="text-white focus:bg-cyan-accent/10 focus:text-cyan-accent">Sent</SelectItem>
                <SelectItem value="accepted" className="text-white focus:bg-cyan-accent/10 focus:text-cyan-accent">Accepted</SelectItem>
                <SelectItem value="declined" className="text-white focus:bg-cyan-accent/10 focus:text-cyan-accent">Declined</SelectItem>
                <SelectItem value="expired" className="text-white focus:bg-cyan-accent/10 focus:text-cyan-accent">Expired</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </Card>

      {/* Quotes Table */}
      <Card className="border-border-subtle" style={{ backgroundColor: '#1A1A1A' }}>
        <Table>
          <TableHeader>
            <TableRow className="border-border-subtle hover:bg-transparent">
              <TableHead className="text-text-secondary">Quote #</TableHead>
              <TableHead className="text-text-secondary">Customer</TableHead>
              <TableHead className="text-text-secondary">Amount</TableHead>
              <TableHead className="text-text-secondary">Status</TableHead>
              <TableHead className="text-text-secondary">Valid Until</TableHead>
              <TableHead className="text-text-secondary">Created</TableHead>
              <TableHead className="text-text-secondary text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredQuotes.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-12 text-text-secondary">
                  No quotes found. Create your first quote to get started.
                </TableCell>
              </TableRow>
            ) : (
              filteredQuotes.map((quote) => (
                <TableRow key={quote.id} className="border-border-subtle hover:bg-cyan-accent/5">
                  <TableCell className="text-white">{quote.quote_number}</TableCell>
                  <TableCell className="text-white">{quote.customer_name}</TableCell>
                  <TableCell className="text-white">${quote.total.toFixed(2)}</TableCell>
                  <TableCell>{getStatusBadge(quote.status)}</TableCell>
                  <TableCell className="text-text-secondary">
                    {quote.valid_until ? new Date(quote.valid_until).toLocaleDateString() : "—"}
                  </TableCell>
                  <TableCell className="text-text-secondary">
                    {new Date(quote.created_at).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      {quote.status === "draft" && (
                        <>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleOpenQuoteBuilder(quote)}
                            className="text-text-secondary hover:text-cyan-accent"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleSendQuote(quote.id)}
                            className="text-text-secondary hover:text-green-400"
                          >
                            <Send className="h-4 w-4" />
                          </Button>
                        </>
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handlePreviewQuote(quote)}
                        className="text-text-secondary hover:text-cyan-accent"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteQuote(quote.id)}
                        className="text-text-secondary hover:text-red-400"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Card>

      {/* Quote Builder Dialog */}
      <Dialog open={isQuoteBuilderOpen} onOpenChange={setIsQuoteBuilderOpen}>
        <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto" style={{ backgroundColor: '#0F0F0F', borderColor: '#333333' }}>
          <DialogHeader>
            <DialogTitle className="text-white">
              {editingQuote ? `Edit Quote ${editingQuote.quote_number}` : "Create New Quote"}
            </DialogTitle>
            <DialogDescription className="text-text-secondary">
              Build a professional quote to send to your customer
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 mt-4">
            {/* Customer Selection */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label className="text-white">Customer *</Label>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsCustomerDialogOpen(true)}
                  className="text-cyan-accent hover:text-cyan-accent/80 h-auto p-0"
                >
                  <Plus className="h-3 w-3 mr-1" />
                  Add New
                </Button>
              </div>
              <Select value={quoteForm.customer_id} onValueChange={(value) => setQuoteForm({ ...quoteForm, customer_id: value })}>
                <SelectTrigger className="bg-dark-bg border-border-subtle text-white">
                  <SelectValue placeholder="Select a customer" />
                </SelectTrigger>
                <SelectContent className="bg-[#0F0F0F] border-border-subtle">
                  {customers.map((customer) => (
                    <SelectItem key={customer.id} value={customer.id} className="text-white focus:bg-cyan-accent/10 focus:text-cyan-accent">
                      {customer.name} {customer.company ? `- ${customer.company}` : ""}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Line Items */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label className="text-white">Line Items *</Label>
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setIsAddItemModalOpen(true)}
                    className="border-cyan-accent/20 text-cyan-accent hover:bg-cyan-accent/10"
                  >
                    <Package className="h-4 w-4 mr-2" />
                    Add from Catalog
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleAddCustomItem}
                    className="border-cyan-accent/20 text-cyan-accent hover:bg-cyan-accent/10"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Custom Item
                  </Button>
                </div>
              </div>

              {/* Items List */}
              {quoteItems.length === 0 ? (
                <Card className="border-border-subtle p-8 text-center" style={{ backgroundColor: '#1A1A1A' }}>
                  <p className="text-[rgb(147,134,134)]">No items added yet. Add items from catalog or create custom items.</p>
                </Card>
              ) : (
                <div className="space-y-2">
                  {quoteItems.map((item) => (
                    <Card key={item.id} className="border-border-subtle p-4" style={{ backgroundColor: '#1A1A1A' }}>
                      <div className="grid grid-cols-12 gap-4 items-start">
                        <div className="col-span-4 space-y-2">
                          <Input
                            value={item.name}
                            onChange={(e) => handleUpdateQuoteItem(item.id, "name", e.target.value)}
                            placeholder="Item name"
                            className="bg-dark-bg border-border-subtle text-white"
                          />
                          <Input
                            value={item.description || ""}
                            onChange={(e) => handleUpdateQuoteItem(item.id, "description", e.target.value)}
                            placeholder="Description (optional)"
                            className="bg-dark-bg border-border-subtle text-white text-sm"
                          />
                        </div>
                        <div className="col-span-2">
                          <Input
                            type="number"
                            value={item.quantity}
                            onChange={(e) => handleUpdateQuoteItem(item.id, "quantity", parseInt(e.target.value) || 0)}
                            placeholder="Qty"
                            min="1"
                            className="bg-dark-bg border-border-subtle text-white"
                          />
                        </div>
                        <div className="col-span-2">
                          <Input
                            type="number"
                            value={item.unit_price}
                            onChange={(e) => handleUpdateQuoteItem(item.id, "unit_price", parseFloat(e.target.value) || 0)}
                            placeholder="Price"
                            min="0"
                            step="0.01"
                            className="bg-dark-bg border-border-subtle text-white"
                          />
                        </div>
                        <div className="col-span-3">
                          <div className="h-10 px-3 rounded border border-border-subtle bg-card-bg flex items-center justify-end">
                            <span className="text-white">${item.total.toFixed(2)}</span>
                          </div>
                        </div>
                        <div className="col-span-1">
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRemoveQuoteItem(item.id)}
                            className="text-text-secondary hover:text-red-400 h-10 w-full"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </div>

            {/* Calculations */}
            <Card className="border-border-subtle p-4" style={{ backgroundColor: '#1A1A1A' }}>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-[rgb(150,150,150)]">Subtotal</span>
                  <span className="text-white">${totals.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center gap-4">
                  <div className="flex items-center gap-2">
                    <span className="text-[rgb(167,164,164)]">Tax Rate</span>
                    <Input
                      type="number"
                      value={quoteForm.tax_rate}
                      onChange={(e) => setQuoteForm({ ...quoteForm, tax_rate: parseFloat(e.target.value) || 0 })}
                      className="w-20 bg-dark-bg border-border-subtle text-white"
                      min="0"
                      max="100"
                      step="0.1"
                    />
                    <span className="text-text-secondary">%</span>
                  </div>
                  <span className="text-white">${totals.tax_amount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center gap-4">
                  <div className="flex items-center gap-2 bg-[rgba(146,146,146,0)]">
                    <span className="text-[rgb(145,145,145)]">Discount</span>
                    <Input
                      type="number"
                      value={quoteForm.discount_amount}
                      onChange={(e) => setQuoteForm({ ...quoteForm, discount_amount: parseFloat(e.target.value) || 0 })}
                      className="w-32 bg-dark-bg border-border-subtle text-white"
                      min="0"
                      step="0.01"
                    />
                  </div>
                  <span className="text-white">-${quoteForm.discount_amount.toFixed(2)}</span>
                </div>
                <Separator className="bg-border-subtle" />
                <div className="flex justify-between items-center">
                  <span className="text-white text-lg">Total</span>
                  <span className="text-[rgb(129,129,129)] text-2xl">${totals.total.toFixed(2)}</span>
                </div>
              </div>
            </Card>

            {/* Additional Fields */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-white">Valid Until</Label>
                <Input
                  type="date"
                  value={quoteForm.valid_until}
                  onChange={(e) => setQuoteForm({ ...quoteForm, valid_until: e.target.value })}
                  className="bg-dark-bg border-border-subtle text-white"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-white">Notes</Label>
              <Textarea
                value={quoteForm.notes}
                onChange={(e) => setQuoteForm({ ...quoteForm, notes: e.target.value })}
                placeholder="Any additional notes for the customer..."
                rows={3}
                className="bg-dark-bg border-border-subtle text-white"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-white">Terms & Conditions</Label>
              <Textarea
                value={quoteForm.terms}
                onChange={(e) => setQuoteForm({ ...quoteForm, terms: e.target.value })}
                placeholder="Payment terms, conditions, etc..."
                rows={3}
                className="bg-dark-bg border-border-subtle text-white"
              />
            </div>

            {/* Notify Customer Checkbox */}
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="notify-customer" 
                checked={notifyCustomer}
                onCheckedChange={(checked) => setNotifyCustomer(checked as boolean)}
                className="border-border-subtle data-[state=checked]:bg-cyan-accent data-[state=checked]:border-cyan-accent"
              />
              <Label htmlFor="notify-customer" className="text-white cursor-pointer">
                Notify customer via email when quote is saved
              </Label>
            </div>

            {/* Shareable Link (shown after quote is created) */}
            {quoteLink && (
              <Card className="border-cyan-accent/30 p-4 bg-cyan-accent/5">
                <div className="space-y-2">
                  <Label className="text-cyan-accent">Shareable Quote Link</Label>
                  <div className="flex gap-2">
                    <Input
                      value={quoteLink}
                      readOnly
                      className="bg-dark-bg border-border-subtle text-white font-mono text-sm"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleCopyLink}
                      className="border-cyan-accent/20 text-cyan-accent hover:bg-cyan-accent/10"
                    >
                      <Copy className="h-4 w-4 mr-2" />
                      Copy
                    </Button>
                  </div>
                  <p className="text-text-secondary text-sm">
                    Share this link with your customer to view the quote online
                  </p>
                </div>
              </Card>
            )}

            {/* Actions */}
            <div className="flex justify-end gap-3">
              <Button
                variant="ghost"
                onClick={handleCloseQuoteBuilder}
                className="text-text-secondary hover:text-white"
              >
                Cancel
              </Button>
              <Button
                variant="outline"
                onClick={() => handleSaveQuote(false)}
                className="border-cyan-accent/20 text-cyan-accent hover:bg-cyan-accent/10"
              >
                Save as Draft
              </Button>
              <Button
                onClick={() => handleSaveQuote(true)}
                className="bg-cyan-accent hover:bg-cyan-accent/80 text-dark-bg"
              >
                <Send className="h-4 w-4 mr-2" />
                Send to Customer
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Add Item from Catalog Modal */}
      <Dialog open={isAddItemModalOpen} onOpenChange={setIsAddItemModalOpen}>
        <DialogContent className="max-w-5xl max-h-[85vh]" style={{ backgroundColor: '#0F0F0F', borderColor: '#333333' }}>
          <DialogHeader>
            <DialogTitle className="text-white">Select from Catalog</DialogTitle>
            <DialogDescription className="text-text-secondary">
              Choose products, services, and add-ons from the catalog
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-6 mt-4 max-h-[calc(85vh-150px)] overflow-y-auto pr-2">
            {catalogItems.length === 0 ? (
              <div className="text-center py-12 text-text-secondary">
                No catalog items available.
              </div>
            ) : (
              <>
                {/* Group items by category */}
                {Array.from(new Set(catalogItems.map(item => item.category || "Other"))).map(category => {
                  const categoryItems = catalogItems.filter(item => (item.category || "Other") === category);
                  
                  // Determine category color based on category name
                  const getCategoryColor = (cat: string) => {
                    if (cat.toLowerCase().includes("creative") || cat.toLowerCase().includes("marketing")) {
                      return { bg: "bg-cyan-accent/10", text: "text-cyan-accent", border: "border-cyan-accent/20" };
                    } else if (cat.toLowerCase().includes("design") || cat.toLowerCase().includes("development")) {
                      return { bg: "bg-violet/10", text: "text-violet", border: "border-violet/20" };
                    } else if (cat.toLowerCase().includes("operations") || cat.toLowerCase().includes("systems")) {
                      return { bg: "bg-teal/10", text: "text-teal", border: "border-teal/20" };
                    }
                    return { bg: "bg-gray-500/10", text: "text-gray-400", border: "border-gray-500/20" };
                  };
                  
                  const colors = getCategoryColor(category);
                  
                  return (
                    <div key={category} className="space-y-3">
                      <div className="flex items-center gap-2">
                        <Package className={`h-4 w-4 ${colors.text}`} />
                        <h3 className={`${colors.text}`}>{category}</h3>
                        <div className={`h-px flex-1 ${colors.bg}`}></div>
                      </div>
                      <div className="grid grid-cols-3 gap-3">
                        {categoryItems.map((item) => (
                          <Card
                            key={item.id}
                            className={`border-border-subtle p-4 cursor-pointer hover:${colors.border} hover:shadow-lg transition-all`}
                            style={{ backgroundColor: '#1A1A1A' }}
                            onClick={() => handleAddItemToQuote(item)}
                          >
                            <h4 className="text-white mb-1">{item.name}</h4>
                            {item.description && (
                              <p className="text-text-secondary text-xs mb-3 line-clamp-2">
                                {item.description}
                              </p>
                            )}
                            <div className="flex justify-between items-center mt-auto pt-2 border-t border-border-subtle">
                              {item.sku && (
                                <span className="text-text-secondary text-xs">SKU: {item.sku}</span>
                              )}
                              <span className={`${colors.text} ml-auto`}>
                                ${item.price.toLocaleString()}
                              </span>
                            </div>
                          </Card>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Quote Preview Dialog */}
      <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
        <DialogContent className="max-w-4xl max-h-[95vh] overflow-hidden p-0" style={{ backgroundColor: '#0F0F0F', borderColor: '#333333' }}>
          <div className="flex flex-col h-full">
            {/* Preview Header with Actions */}
            <div className="flex items-center justify-between p-4 border-b border-border-subtle">
              <div className="flex flex-col">
                <DialogTitle className="text-white">Quote Preview</DialogTitle>
                <DialogDescription className="text-text-secondary text-sm">
                  Preview how the quote will look to the customer
                </DialogDescription>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handlePrintQuote}
                  className="border-cyan-accent/20 text-cyan-accent hover:bg-cyan-accent/10"
                >
                  <Printer className="h-4 w-4 mr-2" />
                  Print / PDF
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsPreviewOpen(false)}
                  className="text-text-secondary hover:text-white"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* US Letter Format Preview */}
            {previewQuote && (
              <div className="flex-1 overflow-y-auto p-8 bg-[#1A1A1A]">
                <div 
                  className="print-quote mx-auto bg-white text-black shadow-2xl"
                  style={{ 
                    width: '8.5in', 
                    minHeight: '11in',
                    padding: '0.75in',
                  }}
                >
                  {/* Header */}
                  <div className="flex justify-between items-start mb-12">
                    <div>
                      <h1 className="text-3xl font-bold text-gray-900 mb-2">CIELO</h1>
                      <p className="text-sm text-gray-600">Brand Agency</p>
                      <p className="text-sm text-gray-600">admin@cielo.marketing</p>
                    </div>
                    <div className="text-right">
                      <h2 className="text-2xl font-bold text-gray-900 mb-2">QUOTE</h2>
                      <p className="text-sm text-gray-600">Quote #: {previewQuote.quote_number}</p>
                      <p className="text-sm text-gray-600">Date: {new Date(previewQuote.created_at).toLocaleDateString()}</p>
                      {previewQuote.valid_until && (
                        <p className="text-sm text-gray-600">Valid Until: {new Date(previewQuote.valid_until).toLocaleDateString()}</p>
                      )}
                    </div>
                  </div>

                  {/* Bill To Section */}
                  <div className="mb-8">
                    <h3 className="text-sm font-bold text-gray-900 mb-2 uppercase tracking-wide">Bill To:</h3>
                    <div className="text-sm text-gray-700">
                      <p className="font-semibold">{previewQuote.customer_name}</p>
                      {(() => {
                        const customer = customers.find(c => c.id === previewQuote.customer_id);
                        return (
                          <>
                            {customer?.company && <p>{customer.company}</p>}
                            {customer?.email && <p>{customer.email}</p>}
                            {customer?.phone && <p>{customer.phone}</p>}
                          </>
                        );
                      })()}
                    </div>
                  </div>

                  {/* Line Items Table */}
                  <div className="mb-8">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="border-b-2 border-gray-900">
                          <th className="text-left py-3 text-sm font-bold text-gray-900 uppercase tracking-wide">Description</th>
                          <th className="text-center py-3 text-sm font-bold text-gray-900 uppercase tracking-wide w-20">Qty</th>
                          <th className="text-right py-3 text-sm font-bold text-gray-900 uppercase tracking-wide w-28">Unit Price</th>
                          <th className="text-right py-3 text-sm font-bold text-gray-900 uppercase tracking-wide w-32">Amount</th>
                        </tr>
                      </thead>
                      <tbody>
                        {previewQuote.items.map((item, index) => (
                          <tr key={item.id} className="border-b border-gray-200">
                            <td className="py-3 text-sm">
                              <p className="font-semibold text-gray-900">{item.name}</p>
                              {item.description && (
                                <p className="text-xs text-gray-600 mt-1">{item.description}</p>
                              )}
                            </td>
                            <td className="py-3 text-center text-sm text-gray-700">{item.quantity}</td>
                            <td className="py-3 text-right text-sm text-gray-700">${item.unit_price.toFixed(2)}</td>
                            <td className="py-3 text-right text-sm font-semibold text-gray-900">${item.total.toFixed(2)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Totals Section */}
                  <div className="flex justify-end mb-12">
                    <div className="w-80">
                      <div className="flex justify-between py-2 text-sm">
                        <span className="text-gray-600">Subtotal:</span>
                        <span className="text-gray-900 font-semibold">${previewQuote.subtotal.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between py-2 text-sm">
                        <span className="text-gray-600">Tax ({previewQuote.tax_rate}%):</span>
                        <span className="text-gray-900 font-semibold">${previewQuote.tax_amount.toFixed(2)}</span>
                      </div>
                      {previewQuote.discount_amount > 0 && (
                        <div className="flex justify-between py-2 text-sm">
                          <span className="text-gray-600">Discount:</span>
                          <span className="text-gray-900 font-semibold">-${previewQuote.discount_amount.toFixed(2)}</span>
                        </div>
                      )}
                      <div className="flex justify-between py-3 border-t-2 border-gray-900 mt-2">
                        <span className="text-lg font-bold text-gray-900">Total:</span>
                        <span className="text-lg font-bold text-gray-900">${previewQuote.total.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Notes Section */}
                  {previewQuote.notes && (
                    <div className="mb-8">
                      <h3 className="text-sm font-bold text-gray-900 mb-2 uppercase tracking-wide">Notes:</h3>
                      <p className="text-sm text-gray-700 whitespace-pre-wrap">{previewQuote.notes}</p>
                    </div>
                  )}

                  {/* Terms & Conditions */}
                  {previewQuote.terms && (
                    <div className="mb-8">
                      <h3 className="text-sm font-bold text-gray-900 mb-2 uppercase tracking-wide">Terms & Conditions:</h3>
                      <p className="text-sm text-gray-700 whitespace-pre-wrap">{previewQuote.terms}</p>
                    </div>
                  )}

                  {/* Footer */}
                  <div className="mt-12 pt-8 border-t border-gray-300 text-center">
                    <p className="text-xs text-gray-500">
                      Thank you for your business. If you have any questions, please contact us at admin@cielo.marketing
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* New Customer Dialog */}
      <Dialog open={isCustomerDialogOpen} onOpenChange={setIsCustomerDialogOpen}>
        <DialogContent style={{ backgroundColor: '#0F0F0F', borderColor: '#333333' }}>
          <DialogHeader>
            <DialogTitle className="text-white">Add New Customer</DialogTitle>
            <DialogDescription className="text-text-secondary">
              Create a new customer to use in quotes and invoices
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label className="text-white">Name *</Label>
              <Input
                value={customerForm.name}
                onChange={(e) => setCustomerForm({ ...customerForm, name: e.target.value })}
                placeholder="Customer name"
                className="bg-dark-bg border-border-subtle text-white"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-white">Email *</Label>
              <Input
                type="email"
                value={customerForm.email}
                onChange={(e) => setCustomerForm({ ...customerForm, email: e.target.value })}
                placeholder="customer@example.com"
                className="bg-dark-bg border-border-subtle text-white"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-white">Company</Label>
              <Input
                value={customerForm.company}
                onChange={(e) => setCustomerForm({ ...customerForm, company: e.target.value })}
                placeholder="Company name"
                className="bg-dark-bg border-border-subtle text-white"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-white">Phone</Label>
              <Input
                value={customerForm.phone}
                onChange={(e) => setCustomerForm({ ...customerForm, phone: e.target.value })}
                placeholder="+1 (555) 000-0000"
                className="bg-dark-bg border-border-subtle text-white"
              />
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <Button
                variant="ghost"
                onClick={() => setIsCustomerDialogOpen(false)}
                className="text-text-secondary hover:text-white"
              >
                Cancel
              </Button>
              <Button
                onClick={handleCreateCustomer}
                className="bg-cyan-accent hover:bg-cyan-accent/80 text-dark-bg"
              >
                Create Customer
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>


    </div>
  );
}
