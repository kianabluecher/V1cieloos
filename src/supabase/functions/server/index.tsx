import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import { createClient } from "npm:@supabase/supabase-js";
import * as kv from "./kv_store.tsx";

const app = new Hono();

// Initialize Supabase client
const supabase = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
);

// Enable logger
app.use('*', logger(console.log));

// Enable CORS for all routes and methods
app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  }),
);

// Storage bucket setup (optional - fallback to KV store if storage not available)
let storageAvailable = false;
(async () => {
  try {
    const bucketName = 'make-6023d608-files';
    const { data: buckets, error: listError } = await supabase.storage.listBuckets();
    
    if (listError) {
      console.log('Storage service not available, using KV store for file metadata only');
      return;
    }
    
    const bucketExists = buckets?.some(bucket => bucket.name === bucketName);
    if (!bucketExists) {
      const { data, error } = await supabase.storage.createBucket(bucketName, {
        public: false,
        allowedMimeTypes: ['image/*', 'application/pdf', 'text/*', 'application/*'],
        fileSizeLimit: 26214400 // 25MB
      });
      if (error) {
        console.log('Could not create storage bucket, using KV store fallback:', error.message);
        return;
      } else {
        console.log(`Created bucket: ${bucketName}`);
        storageAvailable = true;
      }
    } else {
      console.log(`Bucket ${bucketName} already exists`);
      storageAvailable = true;
    }
  } catch (error) {
    console.log('Storage setup failed, using KV store fallback:', error.message);
  }
})();

// Health check endpoint
app.get("/make-server-6023d608/health", (c) => {
  return c.json({ 
    status: "ok",
    storageAvailable: storageAvailable,
    timestamp: new Date().toISOString()
  });
});

// Initialize default data endpoint
app.post("/make-server-6023d608/init", async (c) => {
  try {
    // Check if brand info exists, if not create default
    const existingBrand = await kv.get('brand_information');
    if (!existingBrand) {
      await kv.set('brand_information', {
        companyName: 'ACME Corporation',
        industry: 'Technology',
        targetAudience: 'B2B SaaS companies, 50-500 employees',
        brandPersonality: 'Innovative, trustworthy, and customer-focused. Goal to become the leading platform for small businesses.',
        challenges: 'Brand awareness in new markets, competing with established players, consistent messaging across channels.',
        createdAt: new Date().toISOString()
      });
    }

    // Initialize AI insights if they don't exist
    const existingInsights = await kv.get('ai_insights');
    if (!existingInsights) {
      await kv.set('ai_insights', {
        agents: [
          {
            name: "Brand Developer Agent",
            confidence: 94,
            insight: "Your brand positioning shows strong differentiation in the technology sector. Consider emphasizing innovation and reliability.",
            isActive: true,
          },
          {
            name: "Market Intelligence Agent",
            confidence: 89,
            insight: "Current market trends favor companies with strong digital transformation messaging. Recommend pivoting strategy.",
            isActive: true,
          },
          {
            name: "Content Strategy Agent",
            confidence: 92,
            insight: "Your target audience responds well to ROI-focused content. Suggest increasing case study frequency by 40%.",
            isActive: true,
          },
        ],
        lastUpdated: new Date().toISOString()
      });
    }

    // Initialize demo files if they don't exist
    const existingFiles = await kv.get('uploaded_files');
    if (!existingFiles || existingFiles.length === 0) {
      await kv.set('uploaded_files', [
        {
          id: "demo-1",
          name: "Brand Guidelines v2.pdf",
          size: "2.4 MB",
          type: "pdf",
          addedBy: "Brand Developer Agent",
          uploadedAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
          storagePath: null,
          signedUrl: null,
          storageAvailable: false
        },
        {
          id: "demo-2",
          name: "Market Research.xlsx",
          size: "1.8 MB",
          type: "file",
          addedBy: "Market Intelligence Agent",
          uploadedAt: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(), // 2 days ago
          storagePath: null,
          signedUrl: null,
          storageAvailable: false
        },
        {
          id: "demo-3",
          name: "Logo Assets.zip",
          size: "15.2 MB",
          type: "file",
          addedBy: "Design Team",
          uploadedAt: new Date(Date.now() - 72 * 60 * 60 * 1000).toISOString(), // 3 days ago
          storagePath: null,
          signedUrl: null,
          storageAvailable: false
        }
      ]);
    }

    // Initialize demo clients if they don't exist
    const existingClients = await kv.get('clients');
    if (!existingClients || existingClients.length === 0) {
      await kv.set('clients', [
        {
          id: "1",
          name: "Sarah Johnson",
          email: "sarah@example.com",
          password: "demo123",
          companyName: "ACME Corporation",
          status: "active",
          projectCount: 7,
          lastActivity: "2 hours ago",
          createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString() // 30 days ago
        }
      ]);
      
      // Store credentials for demo client
      await kv.set('client_credentials_1', {
        email: "sarah@example.com",
        password: "demo123",
        createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()
      });
    }

    // Initialize demo tasks if they don't exist
    const existingTasks = await kv.get('tasks');
    if (!existingTasks || existingTasks.length === 0) {
      await kv.set('tasks', [
        {
          id: "task-1",
          clientId: "1",
          title: "Review Q3 Marketing Strategy",
          description: "Review and provide feedback on the Q3 marketing strategy document",
          status: "in-progress",
          priority: "high",
          createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
          updatedAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
          dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
          id: "task-2",
          clientId: "1",
          title: "Logo Design Approval",
          description: "Approve final logo design variations",
          status: "review",
          priority: "medium",
          createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
          updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
          dueDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
          id: "task-3",
          clientId: "1",
          title: "Update Brand Guidelines",
          description: "Review updated brand guidelines document with new color palette",
          status: "todo",
          priority: "low",
          createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
          updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
          dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
        }
      ]);
    }

    // Initialize demo team members if they don't exist
    const existingTeam = await kv.get('team_members');
    if (!existingTeam || existingTeam.length === 0) {
      await kv.set('team_members', [
        {
          id: "team-1",
          name: "Alex Designer",
          email: "alex@agency.com",
          role: "designer",
          status: "active",
          permissions: ["manage_tasks", "upload_documents", "edit_strategy"],
          joinedAt: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
          id: "team-2",
          name: "Morgan Strategist",
          email: "morgan@agency.com",
          role: "strategist",
          status: "active",
          permissions: ["manage_clients", "edit_strategy", "view_analytics"],
          joinedAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString()
        }
      ]);
    }

    // Initialize demo client plans if they don't exist
    const existingPlans = await kv.get('client_plans');
    if (!existingPlans || existingPlans.length === 0) {
      await kv.set('client_plans', [
        {
          clientId: "1",
          clientName: "Sarah Johnson",
          plan: "professional",
          billingCycle: "monthly",
          amount: 2500,
          status: "active",
          nextBillingDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString(),
          startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()
        }
      ]);
    }

    // Initialize demo requests if they don't exist
    const existingRequests = await kv.get('design_requests');
    if (!existingRequests || existingRequests.length === 0) {
      await kv.set('design_requests', [
        {
          id: "req-1",
          type: "design",
          title: "Marketing Strategy Proposal",
          description: "Create comprehensive marketing strategy for Q3 campaign including competitive analysis, target audience research, and campaign recommendations.",
          priority: "high",
          status: "completed",
          assignedAgent: "brand-developer",
          createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days ago
          updatedAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
          deadline: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days from now
          additionalDetails: {
            designType: "ad-creative",
            targetAudience: "B2B professionals",
            budget: "10k-20k"
          }
        },
        {
          id: "req-2",
          type: "design",
          title: "Landing Page Redesign",
          description: "Redesign main product landing page with improved conversion flow and modern UI components.",
          priority: "medium",
          status: "running",
          assignedAgent: "design-team",
          createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days ago
          updatedAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(), // 12 hours ago
          deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days from now
          additionalDetails: {
            designType: "landing-page",
            targetAudience: "SME decision makers",
            budget: "5k-10k"
          }
        },
        {
          id: "req-3",
          type: "design",
          title: "Brand Guidelines Update",
          description: "Update brand guidelines document with new color palette, typography, and logo usage rules.",
          priority: "low",
          status: "waiting",
          assignedAgent: "brand-developer",
          createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
          updatedAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(), // 6 hours ago
          deadline: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days from now
          additionalDetails: {
            designType: "branding",
            targetAudience: "Internal team",
            budget: "under-5k"
          }
        }
      ]);
    }

    return c.json({ 
      success: true, 
      message: 'Default data initialized successfully' 
    });
  } catch (error) {
    console.error('Error initializing data:', error);
    return c.json({ success: false, error: 'Failed to initialize data' }, 500);
  }
});

// Brand Information endpoints
app.get("/make-server-6023d608/brand", async (c) => {
  try {
    let brandInfo = null;
    try {
      brandInfo = await kv.get('brand_information');
    } catch (kvError) {
      console.error('KV get error for brand_information:', kvError);
      // Return default empty brand info if KV fails
      brandInfo = null;
    }
    
    return c.json({ 
      success: true, 
      data: brandInfo || {
        companyName: '',
        industry: '',
        targetAudience: '',
        brandPersonality: '',
        challenges: ''
      }
    });
  } catch (error) {
    console.error('Error fetching brand information:', error);
    // Return empty data instead of error to prevent UI breaks
    return c.json({ 
      success: true, 
      data: {
        companyName: '',
        industry: '',
        targetAudience: '',
        brandPersonality: '',
        challenges: ''
      }
    });
  }
});

app.post("/make-server-6023d608/brand", async (c) => {
  try {
    const body = await c.req.json();
    await kv.set('brand_information', {
      ...body,
      updatedAt: new Date().toISOString()
    });
    return c.json({ success: true, message: 'Brand information saved successfully' });
  } catch (error) {
    console.error('Error saving brand information:', error);
    return c.json({ success: false, error: 'Failed to save brand information' }, 500);
  }
});

// File management endpoints
app.get("/make-server-6023d608/files", async (c) => {
  try {
    const files = await kv.get('uploaded_files') || [];
    return c.json({ success: true, data: files });
  } catch (error) {
    console.error('Error fetching files:', error);
    return c.json({ success: false, error: 'Failed to fetch files' }, 500);
  }
});

app.post("/make-server-6023d608/files/upload", async (c) => {
  try {
    const formData = await c.req.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return c.json({ success: false, error: 'No file provided' }, 400);
    }

    const fileName = `${Date.now()}-${file.name}`;
    const bucketName = 'make-6023d608-files';
    let signedUrl = null;
    let storagePath = null;

    // Try to upload to Supabase Storage if available
    if (storageAvailable) {
      try {
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from(bucketName)
          .upload(fileName, file);

        if (!uploadError) {
          // Create signed URL
          const { data: urlData } = await supabase.storage
            .from(bucketName)
            .createSignedUrl(fileName, 60 * 60 * 24 * 7); // 7 days
          
          signedUrl = urlData?.signedUrl;
          storagePath = fileName;
        } else {
          console.log('Storage upload failed, storing metadata only:', uploadError.message);
        }
      } catch (storageError) {
        console.log('Storage operation failed, storing metadata only:', storageError);
      }
    }

    // Save file metadata to KV store (always save metadata even if storage fails)
    const existingFiles = await kv.get('uploaded_files') || [];
    const newFile = {
      id: Date.now().toString(),
      name: file.name,
      size: `${(file.size / 1024 / 1024).toFixed(1)} MB`,
      type: file.type.includes('pdf') ? 'pdf' : file.type.includes('image') ? 'image' : 'file',
      storagePath: storagePath,
      signedUrl: signedUrl,
      uploadedAt: new Date().toISOString(),
      addedBy: formData.get('addedBy') || 'User',
      storageAvailable: storageAvailable && !!storagePath
    };
    
    await kv.set('uploaded_files', [...existingFiles, newFile]);

    return c.json({ 
      success: true, 
      data: newFile,
      message: storageAvailable && storagePath 
        ? 'File uploaded successfully' 
        : 'File metadata saved (storage not available for file content)'
    });
  } catch (error) {
    console.error('Error processing file upload:', error);
    return c.json({ success: false, error: 'Failed to process file upload' }, 500);
  }
});

app.delete("/make-server-6023d608/files/:id", async (c) => {
  try {
    const fileId = c.req.param('id');
    const existingFiles = await kv.get('uploaded_files') || [];
    const fileToDelete = existingFiles.find((f: any) => f.id === fileId);
    
    if (!fileToDelete) {
      return c.json({ success: false, error: 'File not found' }, 404);
    }

    // Delete from storage if it was stored there
    if (storageAvailable && fileToDelete.storagePath) {
      try {
        const { error: deleteError } = await supabase.storage
          .from('make-6023d608-files')
          .remove([fileToDelete.storagePath]);

        if (deleteError) {
          console.log('Storage delete error (non-critical):', deleteError.message);
        }
      } catch (storageError) {
        console.log('Storage delete failed (non-critical):', storageError);
      }
    }

    // Remove from KV store
    const updatedFiles = existingFiles.filter((f: any) => f.id !== fileId);
    await kv.set('uploaded_files', updatedFiles);

    return c.json({ success: true, message: 'File deleted successfully' });
  } catch (error) {
    console.error('Error deleting file:', error);
    return c.json({ success: false, error: 'Failed to delete file' }, 500);
  }
});

// Design requests endpoints
app.get("/make-server-6023d608/requests", async (c) => {
  try {
    const requests = await kv.get('design_requests') || [];
    return c.json({ success: true, data: requests });
  } catch (error) {
    console.error('Error fetching requests:', error);
    return c.json({ success: false, error: 'Failed to fetch requests' }, 500);
  }
});

app.post("/make-server-6023d608/requests", async (c) => {
  try {
    const body = await c.req.json();
    const existingRequests = await kv.get('design_requests') || [];
    
    const newRequest = {
      id: Date.now().toString(),
      ...body,
      status: 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    await kv.set('design_requests', [...existingRequests, newRequest]);
    
    return c.json({ 
      success: true, 
      data: newRequest,
      message: 'Request created successfully' 
    });
  } catch (error) {
    console.error('Error creating request:', error);
    return c.json({ success: false, error: 'Failed to create request' }, 500);
  }
});

app.put("/make-server-6023d608/requests/:id", async (c) => {
  try {
    const requestId = c.req.param('id');
    const body = await c.req.json();
    const existingRequests = await kv.get('design_requests') || [];
    
    const updatedRequests = existingRequests.map((req: any) => 
      req.id === requestId 
        ? { ...req, ...body, updatedAt: new Date().toISOString() }
        : req
    );
    
    await kv.set('design_requests', updatedRequests);
    
    return c.json({ success: true, message: 'Request updated successfully' });
  } catch (error) {
    console.error('Error updating request:', error);
    return c.json({ success: false, error: 'Failed to update request' }, 500);
  }
});

// AI insights endpoints
app.get("/make-server-6023d608/insights", async (c) => {
  try {
    const insights = await kv.get('ai_insights') || [];
    return c.json({ success: true, data: insights });
  } catch (error) {
    console.error('Error fetching insights:', error);
    return c.json({ success: false, error: 'Failed to fetch insights' }, 500);
  }
});

app.post("/make-server-6023d608/insights", async (c) => {
  try {
    const body = await c.req.json();
    await kv.set('ai_insights', {
      ...body,
      lastUpdated: new Date().toISOString()
    });
    return c.json({ success: true, message: 'Insights updated successfully' });
  } catch (error) {
    console.error('Error updating insights:', error);
    return c.json({ success: false, error: 'Failed to update insights' }, 500);
  }
});

// Strategy data endpoints
app.get("/make-server-6023d608/strategy", async (c) => {
  try {
    const strategy = await kv.get('strategy_data') || {};
    return c.json({ success: true, data: strategy });
  } catch (error) {
    console.error('Error fetching strategy:', error);
    return c.json({ success: false, error: 'Failed to fetch strategy' }, 500);
  }
});

app.post("/make-server-6023d608/strategy", async (c) => {
  try {
    const body = await c.req.json();
    await kv.set('strategy_data', {
      ...body,
      lastUpdated: new Date().toISOString()
    });
    return c.json({ success: true, message: 'Strategy data saved successfully' });
  } catch (error) {
    console.error('Error saving strategy:', error);
    return c.json({ success: false, error: 'Failed to save strategy' }, 500);
  }
});

// Meeting records endpoints
app.get("/make-server-6023d608/meetings", async (c) => {
  try {
    const meetings = await kv.get('meeting_records') || [];
    return c.json({ success: true, data: meetings });
  } catch (error) {
    console.error('Error fetching meetings:', error);
    return c.json({ success: false, error: 'Failed to fetch meetings' }, 500);
  }
});

app.post("/make-server-6023d608/meetings", async (c) => {
  try {
    const body = await c.req.json();
    const existingMeetings = await kv.get('meeting_records') || [];
    
    const newMeeting = {
      id: Date.now().toString(),
      ...body,
      createdAt: new Date().toISOString()
    };
    
    await kv.set('meeting_records', [...existingMeetings, newMeeting]);
    
    return c.json({ 
      success: true, 
      data: newMeeting,
      message: 'Meeting record saved successfully' 
    });
  } catch (error) {
    console.error('Error saving meeting:', error);
    return c.json({ success: false, error: 'Failed to save meeting' }, 500);
  }
});

// Client management endpoints
app.get("/make-server-6023d608/clients", async (c) => {
  try {
    const clients = await kv.get('clients') || [];
    return c.json({ success: true, data: clients });
  } catch (error) {
    console.error('Error fetching clients:', error);
    return c.json({ success: false, error: 'Failed to fetch clients' }, 500);
  }
});

app.post("/make-server-6023d608/clients", async (c) => {
  try {
    const body = await c.req.json();
    const existingClients = await kv.get('clients') || [];
    
    // Check if email already exists
    const emailExists = existingClients.some((client: any) => client.email === body.email);
    if (emailExists) {
      return c.json({ success: false, error: 'Email already exists' }, 400);
    }
    
    const newClient = {
      id: Date.now().toString(),
      name: body.name,
      email: body.email,
      password: body.password, // In production, this should be hashed
      companyName: body.companyName || '',
      status: 'pending',
      projectCount: 0,
      lastActivity: 'Just created',
      createdAt: new Date().toISOString()
    };
    
    await kv.set('clients', [...existingClients, newClient]);
    
    // Store client credentials for invitation email
    await kv.set(`client_credentials_${newClient.id}`, {
      email: body.email,
      password: body.password,
      createdAt: new Date().toISOString()
    });
    
    return c.json({ 
      success: true, 
      data: newClient,
      message: 'Client created successfully' 
    });
  } catch (error) {
    console.error('Error creating client:', error);
    return c.json({ success: false, error: 'Failed to create client' }, 500);
  }
});

app.put("/make-server-6023d608/clients/:id", async (c) => {
  try {
    const clientId = c.req.param('id');
    const body = await c.req.json();
    const existingClients = await kv.get('clients') || [];
    
    const clientIndex = existingClients.findIndex((client: any) => client.id === clientId);
    if (clientIndex === -1) {
      return c.json({ success: false, error: 'Client not found' }, 404);
    }
    
    const updatedClient = {
      ...existingClients[clientIndex],
      ...body,
      updatedAt: new Date().toISOString()
    };
    
    existingClients[clientIndex] = updatedClient;
    await kv.set('clients', existingClients);
    
    // Update credentials if password was changed
    if (body.password) {
      await kv.set(`client_credentials_${clientId}`, {
        email: updatedClient.email,
        password: body.password,
        updatedAt: new Date().toISOString()
      });
    }
    
    return c.json({ 
      success: true, 
      data: updatedClient,
      message: 'Client updated successfully' 
    });
  } catch (error) {
    console.error('Error updating client:', error);
    return c.json({ success: false, error: 'Failed to update client' }, 500);
  }
});

// Send client invitation via Resend
app.post("/make-server-6023d608/clients/:id/invite", async (c) => {
  try {
    const clientId = c.req.param('id');
    const clients = await kv.get('clients') || [];
    const client = clients.find((c: any) => c.id === clientId);
    
    if (!client) {
      return c.json({ success: false, error: 'Client not found' }, 404);
    }
    
    const credentials = await kv.get(`client_credentials_${clientId}`);
    
    if (!credentials) {
      return c.json({ success: false, error: 'Client credentials not found' }, 404);
    }
    
    const resendApiKey = Deno.env.get('RESEND_API_KEY');
    
    if (!resendApiKey) {
      console.warn('RESEND_API_KEY not configured - email not sent');
      return c.json({ 
        success: false, 
        error: 'Email service not configured. Please set RESEND_API_KEY in your Supabase Edge Function secrets.' 
      }, 503);
    }
    
    // Send email via Resend
    const emailResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${resendApiKey}`
      },
      body: JSON.stringify({
        from: 'CIELO OS <onboarding@resend.dev>', // Use your verified domain
        to: [client.email],
        subject: 'Welcome to CIELO OS - Your Account is Ready',
        html: `
          <!DOCTYPE html>
          <html>
            <head>
              <meta charset="utf-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <title>Welcome to CIELO OS</title>
            </head>
            <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #0A0A0A; color: #ffffff;">
              <div style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">
                <div style="background: linear-gradient(135deg, #0A0A0A 0%, #1A1A1A 100%); border: 1px solid #2A2A2A; border-radius: 12px; padding: 40px; box-shadow: 0 8px 32px rgba(166, 224, 255, 0.1);">
                  <!-- Header -->
                  <div style="text-align: center; margin-bottom: 40px;">
                    <div style="display: inline-block; padding: 12px 24px; background: linear-gradient(135deg, #A6E0FF 0%, #4DD0E1 100%); border-radius: 8px; margin-bottom: 20px;">
                      <h1 style="margin: 0; color: #0A0A0A; font-size: 24px;">CIELO OS</h1>
                    </div>
                    <h2 style="margin: 0; color: #A6E0FF; font-size: 28px;">Welcome Aboard!</h2>
                  </div>
                  
                  <!-- Content -->
                  <div style="margin-bottom: 30px;">
                    <p style="color: #E0E0E0; font-size: 16px; line-height: 1.6; margin-bottom: 20px;">
                      Hi ${client.name},
                    </p>
                    <p style="color: #E0E0E0; font-size: 16px; line-height: 1.6; margin-bottom: 20px;">
                      Your CIELO OS account has been created! We're excited to have you on board. Our AI-enhanced client dashboard will help you manage your brand strategy, design requests, and collaborate with our team seamlessly.
                    </p>
                  </div>
                  
                  <!-- Credentials Box -->
                  <div style="background-color: #1A1A1A; border: 1px solid #A6E0FF; border-radius: 8px; padding: 24px; margin-bottom: 30px;">
                    <h3 style="margin: 0 0 16px 0; color: #A6E0FF; font-size: 18px;">Your Login Credentials</h3>
                    <div style="margin-bottom: 12px;">
                      <span style="color: #999999; font-size: 14px; display: block; margin-bottom: 4px;">Email:</span>
                      <span style="color: #ffffff; font-size: 16px; font-family: 'Courier New', monospace;">${credentials.email}</span>
                    </div>
                    <div>
                      <span style="color: #999999; font-size: 14px; display: block; margin-bottom: 4px;">Password:</span>
                      <span style="color: #ffffff; font-size: 16px; font-family: 'Courier New', monospace;">${credentials.password}</span>
                    </div>
                    <p style="color: #999999; font-size: 12px; margin-top: 16px; margin-bottom: 0;">
                      ⚠️ Please change your password after your first login
                    </p>
                  </div>
                  
                  <!-- CTA Button -->
                  <div style="text-align: center; margin-bottom: 30px;">
                    <a href="https://${c.req.header('host') || 'your-app-url.com'}" 
                       style="display: inline-block; padding: 14px 32px; background: linear-gradient(135deg, #A6E0FF 0%, #4DD0E1 100%); color: #0A0A0A; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px; box-shadow: 0 4px 12px rgba(166, 224, 255, 0.3);">
                      Access Your Dashboard
                    </a>
                  </div>
                  
                  <!-- What's Next -->
                  <div style="border-top: 1px solid #2A2A2A; padding-top: 24px; margin-top: 24px;">
                    <h3 style="color: #A6E0FF; font-size: 18px; margin-bottom: 16px;">What's Next?</h3>
                    <ul style="color: #E0E0E0; font-size: 14px; line-height: 1.8; padding-left: 20px;">
                      <li>Complete your brand profile</li>
                      <li>Explore AI-generated insights</li>
                      <li>Submit your first design request</li>
                      <li>Connect with your dedicated team</li>
                    </ul>
                  </div>
                  
                  <!-- Footer -->
                  <div style="text-align: center; margin-top: 40px; padding-top: 24px; border-top: 1px solid #2A2A2A;">
                    <p style="color: #999999; font-size: 12px; margin: 0;">
                      Need help? Contact your agency team or reply to this email.
                    </p>
                    <p style="color: #666666; font-size: 11px; margin: 12px 0 0 0;">
                      © ${new Date().getFullYear()} CIELO OS. All rights reserved.
                    </p>
                  </div>
                </div>
              </div>
            </body>
          </html>
        `
      })
    });
    
    if (!emailResponse.ok) {
      const errorData = await emailResponse.json();
      console.error('Resend API error:', errorData);
      return c.json({ 
        success: false, 
        error: `Failed to send email: ${errorData.message || 'Unknown error'}` 
      }, 500);
    }
    
    const emailData = await emailResponse.json();
    console.log('Email sent successfully:', emailData);
    
    // Update client status to pending if not already active
    if (client.status !== 'active') {
      const clients = await kv.get('clients') || [];
      const updatedClients = clients.map((c: any) => 
        c.id === clientId ? { ...c, status: 'pending', lastActivity: 'Invitation sent' } : c
      );
      await kv.set('clients', updatedClients);
    }
    
    return c.json({ 
      success: true, 
      message: 'Invitation email sent successfully',
      emailId: emailData.id
    });
  } catch (error) {
    console.error('Error sending invitation:', error);
    return c.json({ success: false, error: 'Failed to send invitation email' }, 500);
  }
});

// Tasks management endpoints
app.get("/make-server-6023d608/tasks", async (c) => {
  try {
    const tasks = await kv.get('tasks') || [];
    return c.json({ success: true, data: tasks });
  } catch (error) {
    console.error('Error fetching tasks:', error);
    return c.json({ success: false, error: 'Failed to fetch tasks' }, 500);
  }
});

app.post("/make-server-6023d608/tasks", async (c) => {
  try {
    const body = await c.req.json();
    const existingTasks = await kv.get('tasks') || [];
    
    const newTask = {
      id: `task-${Date.now()}`,
      clientId: body.clientId,
      title: body.title,
      description: body.description,
      status: 'todo',
      priority: body.priority || 'medium',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      dueDate: body.dueDate || null
    };
    
    await kv.set('tasks', [...existingTasks, newTask]);
    
    return c.json({ 
      success: true, 
      data: newTask,
      message: 'Task created successfully' 
    });
  } catch (error) {
    console.error('Error creating task:', error);
    return c.json({ success: false, error: 'Failed to create task' }, 500);
  }
});

app.put("/make-server-6023d608/tasks/:id", async (c) => {
  try {
    const taskId = c.req.param('id');
    const body = await c.req.json();
    const existingTasks = await kv.get('tasks') || [];
    
    const updatedTasks = existingTasks.map((task: any) => 
      task.id === taskId 
        ? { ...task, ...body, updatedAt: new Date().toISOString() }
        : task
    );
    
    await kv.set('tasks', updatedTasks);
    
    return c.json({ success: true, message: 'Task updated successfully' });
  } catch (error) {
    console.error('Error updating task:', error);
    return c.json({ success: false, error: 'Failed to update task' }, 500);
  }
});

// Team management endpoints
app.get("/make-server-6023d608/team", async (c) => {
  try {
    const team = await kv.get('team_members') || [];
    return c.json({ success: true, data: team });
  } catch (error) {
    console.error('Error fetching team:', error);
    return c.json({ success: false, error: 'Failed to fetch team members' }, 500);
  }
});

app.post("/make-server-6023d608/team/invite", async (c) => {
  try {
    const body = await c.req.json();
    const existingTeam = await kv.get('team_members') || [];
    
    // Check if email already exists
    const emailExists = existingTeam.some((member: any) => member.email === body.email);
    if (emailExists) {
      return c.json({ success: false, error: 'Email already exists' }, 400);
    }
    
    const newMember = {
      id: Date.now().toString(),
      name: body.name,
      email: body.email,
      role: body.role,
      status: 'pending',
      permissions: body.permissions || [],
      joinedAt: new Date().toISOString()
    };
    
    await kv.set('team_members', [...existingTeam, newMember]);
    
    // In production, send invitation email via Resend here
    
    return c.json({ 
      success: true, 
      data: newMember,
      message: 'Team member invited successfully' 
    });
  } catch (error) {
    console.error('Error inviting team member:', error);
    return c.json({ success: false, error: 'Failed to invite team member' }, 500);
  }
});

app.delete("/make-server-6023d608/team/:id", async (c) => {
  try {
    const memberId = c.req.param('id');
    const existingTeam = await kv.get('team_members') || [];
    
    const updatedTeam = existingTeam.filter((member: any) => member.id !== memberId);
    await kv.set('team_members', updatedTeam);
    
    return c.json({ success: true, message: 'Team member removed successfully' });
  } catch (error) {
    console.error('Error removing team member:', error);
    return c.json({ success: false, error: 'Failed to remove team member' }, 500);
  }
});

// Client plans endpoints
app.get("/make-server-6023d608/plans", async (c) => {
  try {
    const plans = await kv.get('client_plans') || [];
    return c.json({ success: true, data: plans });
  } catch (error) {
    console.error('Error fetching plans:', error);
    return c.json({ success: false, error: 'Failed to fetch client plans' }, 500);
  }
});

app.put("/make-server-6023d608/plans/:clientId", async (c) => {
  try {
    const clientId = c.req.param('clientId');
    const body = await c.req.json();
    const existingPlans = await kv.get('client_plans') || [];
    
    const updatedPlans = existingPlans.map((plan: any) => 
      plan.clientId === clientId 
        ? { ...plan, ...body, updatedAt: new Date().toISOString() }
        : plan
    );
    
    await kv.set('client_plans', updatedPlans);
    
    return c.json({ success: true, message: 'Plan updated successfully' });
  } catch (error) {
    console.error('Error updating plan:', error);
    return c.json({ success: false, error: 'Failed to update plan' }, 500);
  }
});

// Client assets endpoints
app.get("/make-server-6023d608/clients/:clientId/assets", async (c) => {
  try {
    const clientId = c.req.param('clientId');
    const assetsKey = `client_assets_${clientId}`;
    const assets = await kv.get(assetsKey) || [];
    return c.json({ success: true, data: assets });
  } catch (error) {
    console.error('Error fetching client assets:', error);
    return c.json({ success: false, error: 'Failed to fetch assets' }, 500);
  }
});

app.post("/make-server-6023d608/clients/:clientId/assets", async (c) => {
  try {
    const clientId = c.req.param('clientId');
    const formData = await c.req.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return c.json({ success: false, error: 'No file provided' }, 400);
    }

    const fileName = `${Date.now()}-${file.name}`;
    const bucketName = 'make-6023d608-files';
    let signedUrl = null;
    let storagePath = null;

    // Try to upload to Supabase Storage if available
    if (storageAvailable) {
      try {
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from(bucketName)
          .upload(`client-assets/${clientId}/${fileName}`, file);

        if (!uploadError) {
          // Create signed URL
          const { data: urlData } = await supabase.storage
            .from(bucketName)
            .createSignedUrl(`client-assets/${clientId}/${fileName}`, 60 * 60 * 24 * 365); // 1 year
          
          signedUrl = urlData?.signedUrl;
          storagePath = `client-assets/${clientId}/${fileName}`;
        } else {
          console.log('Storage upload failed, storing metadata only:', uploadError.message);
        }
      } catch (storageError) {
        console.log('Storage operation failed, storing metadata only:', storageError);
      }
    }

    // Save asset metadata to KV store
    const assetsKey = `client_assets_${clientId}`;
    const existingAssets = await kv.get(assetsKey) || [];
    const newAsset = {
      id: Date.now().toString(),
      clientId: clientId,
      name: file.name,
      type: file.type || 'application/octet-stream',
      size: `${(file.size / 1024 / 1024).toFixed(2)} MB`,
      storagePath: storagePath,
      url: signedUrl,
      uploadedAt: new Date().toISOString(),
      storageAvailable: storageAvailable && !!storagePath
    };
    
    await kv.set(assetsKey, [...existingAssets, newAsset]);

    return c.json({ 
      success: true, 
      data: newAsset,
      message: storageAvailable && storagePath 
        ? 'Asset uploaded successfully' 
        : 'Asset metadata saved (storage not available for file content)'
    });
  } catch (error) {
    console.error('Error uploading client asset:', error);
    return c.json({ success: false, error: 'Failed to upload asset' }, 500);
  }
});

app.delete("/make-server-6023d608/assets/:id", async (c) => {
  try {
    const assetId = c.req.param('id');
    
    // Find the asset across all client asset collections
    const allKeys = await kv.getByPrefix('client_assets_');
    let assetToDelete = null;
    let clientId = null;
    
    for (const key of allKeys) {
      const assets = key as any[];
      const asset = assets.find((a: any) => a.id === assetId);
      if (asset) {
        assetToDelete = asset;
        clientId = asset.clientId;
        break;
      }
    }
    
    if (!assetToDelete || !clientId) {
      return c.json({ success: false, error: 'Asset not found' }, 404);
    }

    // Delete from storage if it was stored there
    if (storageAvailable && assetToDelete.storagePath) {
      try {
        const { error: deleteError } = await supabase.storage
          .from('make-6023d608-files')
          .remove([assetToDelete.storagePath]);

        if (deleteError) {
          console.log('Storage delete error (non-critical):', deleteError.message);
        }
      } catch (storageError) {
        console.log('Storage delete failed (non-critical):', storageError);
      }
    }

    // Remove from KV store
    const assetsKey = `client_assets_${clientId}`;
    const existingAssets = await kv.get(assetsKey) || [];
    const updatedAssets = existingAssets.filter((a: any) => a.id !== assetId);
    await kv.set(assetsKey, updatedAssets);

    return c.json({ success: true, message: 'Asset deleted successfully' });
  } catch (error) {
    console.error('Error deleting asset:', error);
    return c.json({ success: false, error: 'Failed to delete asset' }, 500);
  }
});

// Activity Logs
app.get("/make-server-6023d608/activity", async (c) => {
  try {
    const activities = await kv.get('activity_logs') || [];
    return c.json({ success: true, data: activities });
  } catch (error) {
    console.error('Error fetching activity logs:', error);
    return c.json({ success: false, error: 'Failed to fetch activity logs' }, 500);
  }
});

app.post("/make-server-6023d608/activity", async (c) => {
  try {
    const body = await c.req.json();
    const activities = await kv.get('activity_logs') || [];
    
    const newActivity = {
      id: `act-${Date.now()}`,
      userId: body.userId || 'unknown',
      userName: body.userName || 'Unknown User',
      userEmail: body.userEmail || '',
      userType: body.userType || 'client',
      action: body.action || 'unknown',
      description: body.description || '',
      metadata: body.metadata || {},
      timestamp: new Date().toISOString()
    };
    
    activities.unshift(newActivity);
    
    // Keep only last 1000 activities to prevent unlimited growth
    const trimmedActivities = activities.slice(0, 1000);
    await kv.set('activity_logs', trimmedActivities);
    
    return c.json({ 
      success: true, 
      data: newActivity,
      message: 'Activity logged successfully' 
    });
  } catch (error) {
    console.error('Error logging activity:', error);
    return c.json({ success: false, error: 'Failed to log activity' }, 500);
  }
});

// Client Invitations
app.post("/make-server-6023d608/clients/invite", async (c) => {
  try {
    const body = await c.req.json();
    const clients = await kv.get('clients') || [];
    
    const newClient = {
      id: `client-${Date.now()}`,
      name: body.name,
      email: body.email,
      company: body.company,
      phone: body.phone || '',
      status: 'pending',
      joinedAt: new Date().toISOString(),
      plan: body.plan || 'professional'
    };
    
    clients.push(newClient);
    await kv.set('clients', clients);
    
    // Also create a client plan entry
    const plans = await kv.get('client_plans') || [];
    const planPrices = {
      starter: 499,
      professional: 999,
      enterprise: 2500
    };
    
    const newPlan = {
      clientId: newClient.id,
      clientName: newClient.name,
      plan: newClient.plan,
      billingCycle: 'monthly',
      amount: planPrices[newClient.plan] || 999,
      status: 'trial',
      nextBillingDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
      startDate: new Date().toISOString()
    };
    
    plans.push(newPlan);
    await kv.set('client_plans', plans);
    
    // Log activity
    const activities = await kv.get('activity_logs') || [];
    activities.unshift({
      id: `act-${Date.now()}`,
      userId: 'admin',
      userName: 'Admin User',
      userEmail: 'admin@cielo.marketing',
      userType: 'management',
      action: 'client_created',
      description: `Invited new client: ${newClient.name} from ${newClient.company}`,
      metadata: { clientId: newClient.id, clientName: newClient.name },
      timestamp: new Date().toISOString()
    });
    await kv.set('activity_logs', activities.slice(0, 1000));
    
    return c.json({ 
      success: true, 
      data: newClient,
      message: 'Client invited successfully' 
    });
  } catch (error) {
    console.error('Error inviting client:', error);
    return c.json({ success: false, error: 'Failed to invite client' }, 500);
  }
});

// Client Assets
app.get("/make-server-6023d608/clients/:clientId/assets", async (c) => {
  try {
    const clientId = c.req.param('clientId');
    const allAssets = await kv.get('client_assets') || [];
    const clientAssets = allAssets.filter((asset: any) => asset.clientId === clientId);
    
    return c.json({ success: true, data: clientAssets });
  } catch (error) {
    console.error('Error fetching client assets:', error);
    return c.json({ success: false, error: 'Failed to fetch assets', data: [] }, 500);
  }
});

app.post("/make-server-6023d608/clients/:clientId/assets", async (c) => {
  try {
    const clientId = c.req.param('clientId');
    const formData = await c.req.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return c.json({ success: false, error: 'No file provided' }, 400);
    }
    
    const allAssets = await kv.get('client_assets') || [];
    
    // Create asset metadata
    const newAsset = {
      id: `asset-${Date.now()}`,
      clientId: clientId,
      name: file.name,
      type: file.type.startsWith('image/') ? 'image' : file.type.startsWith('video/') ? 'video' : 'document',
      size: file.size,
      url: `#placeholder-${file.name}`, // In production, upload to Supabase Storage
      uploadedAt: new Date().toISOString()
    };
    
    allAssets.push(newAsset);
    await kv.set('client_assets', allAssets);
    
    // Log activity
    const activities = await kv.get('activity_logs') || [];
    activities.unshift({
      id: `act-${Date.now()}`,
      userId: 'admin',
      userName: 'Admin User',
      userEmail: 'admin@cielo.marketing',
      userType: 'management',
      action: 'file_uploaded',
      description: `Uploaded asset: ${file.name}`,
      metadata: { clientId, fileName: file.name, fileSize: file.size },
      timestamp: new Date().toISOString()
    });
    await kv.set('activity_logs', activities.slice(0, 1000));
    
    return c.json({ 
      success: true, 
      data: newAsset,
      message: 'Asset uploaded successfully' 
    });
  } catch (error) {
    console.error('Error uploading asset:', error);
    return c.json({ success: false, error: 'Failed to upload asset' }, 500);
  }
});

app.delete("/make-server-6023d608/assets/:assetId", async (c) => {
  try {
    const assetId = c.req.param('assetId');
    const allAssets = await kv.get('client_assets') || [];
    
    const updatedAssets = allAssets.filter((asset: any) => asset.id !== assetId);
    await kv.set('client_assets', updatedAssets);
    
    return c.json({ 
      success: true,
      message: 'Asset deleted successfully' 
    });
  } catch (error) {
    console.error('Error deleting asset:', error);
    return c.json({ success: false, error: 'Failed to delete asset' }, 500);
  }
});

// Initialize Demo Data
app.post("/make-server-6023d608/init-demo", async (c) => {
  try {
    // Initialize activity logs with sample data
    const sampleActivities = [
      {
        id: 'act-1',
        userId: 'sarah@client.com',
        userName: 'Sarah Johnson',
        userEmail: 'sarah@client.com',
        userType: 'client',
        action: 'sign_in',
        description: 'Sarah Johnson signed in to CIELO OS',
        metadata: {},
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
      },
      {
        id: 'act-2',
        userId: 'john@cielo.marketing',
        userName: 'John Smith',
        userEmail: 'john@cielo.marketing',
        userType: 'team',
        action: 'task_viewed',
        description: 'John Smith viewed task: Design new logo concepts',
        metadata: { taskId: 'TASK-1', taskTitle: 'Design new logo concepts' },
        timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString()
      },
      {
        id: 'act-3',
        userId: 'admin@cielo.marketing',
        userName: 'Admin User',
        userEmail: 'admin@cielo.marketing',
        userType: 'management',
        action: 'sign_in',
        description: 'Admin User signed in to CIELO OS',
        metadata: {},
        timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString()
      }
    ];
    
    await kv.set('activity_logs', sampleActivities);
    await kv.set('client_assets', []);
    
    // Initialize Quotes Demo Data
    const demoCustomers = [
      {
        id: 'customer-1',
        name: 'Sarah Johnson',
        email: 'sarah@client.com',
        company: 'ACME Corporation',
        phone: '+1 (555) 123-4567',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        id: 'customer-2',
        name: 'Michael Chen',
        email: 'michael@techstartup.io',
        company: 'TechStartup Inc',
        phone: '+1 (555) 987-6543',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        id: 'customer-3',
        name: 'Emily Rodriguez',
        email: 'emily@creativeco.com',
        company: 'Creative Co',
        phone: '+1 (555) 456-7890',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }
    ];
    
    const demoCatalogItems = [
      {
        id: 'item-1',
        name: 'Brand Identity Package',
        description: 'Complete brand identity including logo, color palette, typography, and brand guidelines',
        price: 2500.00,
        sku: 'BRD-001',
        category: 'Branding',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        id: 'item-2',
        name: 'Website Design (5 pages)',
        description: 'Custom website design for up to 5 pages with responsive layouts',
        price: 3500.00,
        sku: 'WEB-001',
        category: 'Web Design',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        id: 'item-3',
        name: 'Social Media Graphics Package',
        description: 'Monthly package of 12 custom social media graphics',
        price: 800.00,
        sku: 'SOC-001',
        category: 'Social Media',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        id: 'item-4',
        name: 'Marketing Strategy Consultation',
        description: '2-hour strategic planning session with recommendations document',
        price: 500.00,
        sku: 'CON-001',
        category: 'Consulting',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        id: 'item-5',
        name: 'Email Template Design',
        description: 'Custom HTML email template with responsive design',
        price: 600.00,
        sku: 'EML-001',
        category: 'Design',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }
    ];
    
    const demoQuotes = [
      {
        id: 'quote-1',
        quote_number: 'QUO-0001',
        public_token: 'token-demo-1-abc123',
        customer_id: 'customer-1',
        customer_name: 'Sarah Johnson',
        status: 'sent',
        valid_until: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        subtotal: 6000.00,
        tax_rate: 10,
        tax_amount: 600.00,
        discount_amount: 0,
        total: 6600.00,
        notes: 'Thank you for choosing CIELO OS for your brand refresh project!',
        terms: 'Payment due within 30 days of quote acceptance. Quote valid for 30 days from issue date.',
        items: [
          {
            id: 'qi-1',
            name: 'Brand Identity Package',
            description: 'Complete brand identity including logo, color palette, typography, and brand guidelines',
            quantity: 1,
            unit_price: 2500.00,
            total: 2500.00
          },
          {
            id: 'qi-2',
            name: 'Website Design (5 pages)',
            description: 'Custom website design for up to 5 pages with responsive layouts',
            quantity: 1,
            unit_price: 3500.00,
            total: 3500.00
          }
        ],
        created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        updated_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        sent_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: 'quote-2',
        quote_number: 'QUO-0002',
        public_token: 'token-demo-2-xyz789',
        customer_id: 'customer-2',
        customer_name: 'Michael Chen',
        status: 'accepted',
        valid_until: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        subtotal: 1300.00,
        tax_rate: 10,
        tax_amount: 130.00,
        discount_amount: 100.00,
        total: 1330.00,
        notes: 'Startup discount applied!',
        terms: 'Payment due within 30 days of quote acceptance. Quote valid for 30 days from issue date.',
        items: [
          {
            id: 'qi-3',
            name: 'Social Media Graphics Package',
            description: 'Monthly package of 12 custom social media graphics',
            quantity: 1,
            unit_price: 800.00,
            total: 800.00
          },
          {
            id: 'qi-4',
            name: 'Marketing Strategy Consultation',
            description: '2-hour strategic planning session with recommendations document',
            quantity: 1,
            unit_price: 500.00,
            total: 500.00
          }
        ],
        created_at: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
        updated_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        sent_at: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
        accepted_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: 'quote-3',
        quote_number: 'QUO-0003',
        public_token: 'token-demo-3-def456',
        customer_id: 'customer-3',
        customer_name: 'Emily Rodriguez',
        status: 'draft',
        valid_until: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        subtotal: 600.00,
        tax_rate: 10,
        tax_amount: 60.00,
        discount_amount: 0,
        total: 660.00,
        notes: '',
        terms: 'Payment due within 30 days of quote acceptance. Quote valid for 30 days from issue date.',
        items: [
          {
            id: 'qi-5',
            name: 'Email Template Design',
            description: 'Custom HTML email template with responsive design',
            quantity: 1,
            unit_price: 600.00,
            total: 600.00
          }
        ],
        created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        updated_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      }
    ];
    
    await kv.set('customers', demoCustomers);
    await kv.set('catalog_items', demoCatalogItems);
    await kv.set('quotes', demoQuotes);
    
    return c.json({ 
      success: true,
      message: 'Demo data initialized successfully' 
    });
  } catch (error) {
    console.error('Error initializing demo data:', error);
    return c.json({ success: false, error: 'Failed to initialize demo data' }, 500);
  }
});

// Client Services
app.get("/make-server-6023d608/clients/:clientId/services", async (c) => {
  try {
    const clientId = c.req.param('clientId');
    const services = await kv.get('client_services') || [];
    const clientServices = services.filter((service: any) => service.clientId === clientId);
    return c.json({ success: true, data: clientServices });
  } catch (error) {
    console.error('Error fetching client services:', error);
    return c.json({ success: false, error: 'Failed to fetch services' }, 500);
  }
});

app.post("/make-server-6023d608/clients/:clientId/services", async (c) => {
  try {
    const clientId = c.req.param('clientId');
    const body = await c.req.json();
    const services = await kv.get('client_services') || [];
    
    const newService = {
      id: `service-${Date.now()}`,
      clientId: clientId,
      name: body.name,
      status: body.status || 'active',
      startDate: body.startDate || new Date().toISOString(),
      description: body.description || ''
    };
    
    services.push(newService);
    await kv.set('client_services', services);
    
    return c.json({ success: true, data: newService, message: 'Service added successfully' });
  } catch (error) {
    console.error('Error adding service:', error);
    return c.json({ success: false, error: 'Failed to add service' }, 500);
  }
});

// Client Contracts
app.get("/make-server-6023d608/clients/:clientId/contracts", async (c) => {
  try {
    const clientId = c.req.param('clientId');
    const contracts = await kv.get('client_contracts') || [];
    const clientContracts = contracts.filter((contract: any) => contract.clientId === clientId);
    return c.json({ success: true, data: clientContracts });
  } catch (error) {
    console.error('Error fetching client contracts:', error);
    return c.json({ success: false, error: 'Failed to fetch contracts' }, 500);
  }
});

app.post("/make-server-6023d608/clients/:clientId/contracts", async (c) => {
  try {
    const clientId = c.req.param('clientId');
    const body = await c.req.json();
    const contracts = await kv.get('client_contracts') || [];
    
    const newContract = {
      id: `contract-${Date.now()}`,
      clientId: clientId,
      title: body.title,
      value: body.value || 0,
      startDate: body.startDate || new Date().toISOString(),
      endDate: body.endDate || new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
      status: body.status || 'active',
      terms: body.terms || ''
    };
    
    contracts.push(newContract);
    await kv.set('client_contracts', contracts);
    
    return c.json({ success: true, data: newContract, message: 'Contract added successfully' });
  } catch (error) {
    console.error('Error adding contract:', error);
    return c.json({ success: false, error: 'Failed to add contract' }, 500);
  }
});

// Client Comments
app.get("/make-server-6023d608/clients/:clientId/comments", async (c) => {
  try {
    const clientId = c.req.param('clientId');
    const comments = await kv.get('client_comments') || [];
    const clientComments = comments.filter((comment: any) => comment.clientId === clientId);
    return c.json({ success: true, data: clientComments });
  } catch (error) {
    console.error('Error fetching client comments:', error);
    return c.json({ success: false, error: 'Failed to fetch comments' }, 500);
  }
});

app.post("/make-server-6023d608/clients/:clientId/comments", async (c) => {
  try {
    const clientId = c.req.param('clientId');
    const body = await c.req.json();
    const comments = await kv.get('client_comments') || [];
    
    const newComment = {
      id: `comment-${Date.now()}`,
      clientId: clientId,
      author: 'Admin User', // TODO: Get from session
      content: body.content,
      parentId: body.parentId || null,
      images: body.images || [],
      createdAt: new Date().toISOString(),
      updatedAt: null
    };
    
    comments.push(newComment);
    await kv.set('client_comments', comments);
    
    return c.json({ success: true, data: newComment, message: 'Comment added successfully' });
  } catch (error) {
    console.error('Error adding comment:', error);
    return c.json({ success: false, error: 'Failed to add comment' }, 500);
  }
});

// Update comment
app.put("/make-server-6023d608/comments/:commentId", async (c) => {
  try {
    const commentId = c.req.param('commentId');
    const body = await c.req.json();
    const comments = await kv.get('client_comments') || [];
    
    const commentIndex = comments.findIndex((comment: any) => comment.id === commentId);
    if (commentIndex === -1) {
      return c.json({ success: false, error: 'Comment not found' }, 404);
    }
    
    comments[commentIndex] = {
      ...comments[commentIndex],
      content: body.content,
      updatedAt: new Date().toISOString()
    };
    
    await kv.set('client_comments', comments);
    
    return c.json({ success: true, data: comments[commentIndex], message: 'Comment updated successfully' });
  } catch (error) {
    console.error('Error updating comment:', error);
    return c.json({ success: false, error: 'Failed to update comment' }, 500);
  }
});

// Delete comment
app.delete("/make-server-6023d608/comments/:commentId", async (c) => {
  try {
    const commentId = c.req.param('commentId');
    const comments = await kv.get('client_comments') || [];
    
    const filteredComments = comments.filter((comment: any) => comment.id !== commentId && comment.parentId !== commentId);
    
    if (filteredComments.length === comments.length) {
      return c.json({ success: false, error: 'Comment not found' }, 404);
    }
    
    await kv.set('client_comments', filteredComments);
    
    return c.json({ success: true, message: 'Comment deleted successfully' });
  } catch (error) {
    console.error('Error deleting comment:', error);
    return c.json({ success: false, error: 'Failed to delete comment' }, 500);
  }
});

// Upload comment image
app.post("/make-server-6023d608/comments/:commentId/images", async (c) => {
  try {
    const commentId = c.req.param('commentId');
    const formData = await c.req.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return c.json({ success: false, error: 'No file provided' }, 400);
    }
    
    const comments = await kv.get('client_comments') || [];
    const commentIndex = comments.findIndex((comment: any) => comment.id === commentId);
    
    if (commentIndex === -1) {
      return c.json({ success: false, error: 'Comment not found' }, 404);
    }
    
    // Convert file to base64 for storage
    const arrayBuffer = await file.arrayBuffer();
    const base64 = btoa(String.fromCharCode(...new Uint8Array(arrayBuffer)));
    const dataUrl = `data:${file.type};base64,${base64}`;
    
    const imageData = {
      id: `img-${Date.now()}`,
      name: file.name,
      type: file.type,
      url: dataUrl,
      uploadedAt: new Date().toISOString()
    };
    
    if (!comments[commentIndex].images) {
      comments[commentIndex].images = [];
    }
    comments[commentIndex].images.push(imageData);
    
    await kv.set('client_comments', comments);
    
    return c.json({ success: true, data: imageData, message: 'Image uploaded successfully' });
  } catch (error) {
    console.error('Error uploading comment image:', error);
    return c.json({ success: false, error: 'Failed to upload image' }, 500);
  }
});

// Client Activity
app.get("/make-server-6023d608/clients/:clientId/activity", async (c) => {
  try {
    const clientId = c.req.param('clientId');
    const activities = await kv.get('activity_logs') || [];
    
    // Filter activities related to this client
    const clientActivities = activities.filter((activity: any) => 
      activity.metadata?.clientId === clientId ||
      activity.userId === clientId ||
      activity.description?.includes(clientId)
    );
    
    return c.json({ success: true, data: clientActivities });
  } catch (error) {
    console.error('Error fetching client activity:', error);
    return c.json({ success: false, error: 'Failed to fetch activity' }, 500);
  }
});

// Recording Notes
app.post("/make-server-6023d608/recordings/:recordingId/notes", async (c) => {
  try {
    const recordingId = c.req.param('recordingId');
    const body = await c.req.json();
    const notes = await kv.get('recording_notes') || [];
    
    const newNote = {
      id: `note-${Date.now()}`,
      recordingId: recordingId,
      content: body.content,
      author: body.author || 'Admin User',
      createdAt: new Date().toISOString()
    };
    
    notes.push(newNote);
    await kv.set('recording_notes', notes);
    
    return c.json({ success: true, data: newNote, message: 'Note added successfully' });
  } catch (error) {
    console.error('Error adding recording note:', error);
    return c.json({ success: false, error: 'Failed to add note' }, 500);
  }
});

app.get("/make-server-6023d608/recordings/:recordingId/notes", async (c) => {
  try {
    const recordingId = c.req.param('recordingId');
    const notes = await kv.get('recording_notes') || [];
    const recordingNotes = notes.filter((note: any) => note.recordingId === recordingId);
    
    return c.json({ success: true, data: recordingNotes });
  } catch (error) {
    console.error('Error fetching recording notes:', error);
    return c.json({ success: false, error: 'Failed to fetch notes' }, 500);
  }
});

app.delete("/make-server-6023d608/recordings/notes/:noteId", async (c) => {
  try {
    const noteId = c.req.param('noteId');
    const notes = await kv.get('recording_notes') || [];
    
    const filteredNotes = notes.filter((note: any) => note.id !== noteId);
    
    if (filteredNotes.length === notes.length) {
      return c.json({ success: false, error: 'Note not found' }, 404);
    }
    
    await kv.set('recording_notes', filteredNotes);
    
    return c.json({ success: true, message: 'Note deleted successfully' });
  } catch (error) {
    console.error('Error deleting note:', error);
    return c.json({ success: false, error: 'Failed to delete note' }, 500);
  }
});

// ==================== QUOTES MANAGEMENT ====================

// Get all quotes
app.get("/make-server-6023d608/quotes", async (c) => {
  try {
    const quotes = await kv.get('quotes') || [];
    return c.json({ success: true, data: quotes });
  } catch (error) {
    console.error('Error fetching quotes:', error);
    return c.json({ success: false, error: 'Failed to fetch quotes' }, 500);
  }
});

// Create a new quote
app.post("/make-server-6023d608/quotes", async (c) => {
  try {
    const body = await c.req.json();
    const quotes = await kv.get('quotes') || [];
    
    const quoteNumber = `QUO-${String(quotes.length + 1).padStart(4, '0')}`;
    const newQuote = {
      id: `quote-${Date.now()}`,
      quote_number: quoteNumber,
      public_token: `token-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      customer_id: body.customer_id,
      customer_name: body.customer_name,
      status: body.status || 'draft',
      valid_until: body.valid_until || null,
      subtotal: body.subtotal || 0,
      tax_rate: body.tax_rate || 0,
      tax_amount: body.tax_amount || 0,
      discount_amount: body.discount_amount || 0,
      total: body.total || 0,
      notes: body.notes || '',
      terms: body.terms || '',
      items: body.items || [],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    
    quotes.push(newQuote);
    await kv.set('quotes', quotes);
    
    return c.json({ success: true, data: newQuote, message: 'Quote created successfully' });
  } catch (error) {
    console.error('Error creating quote:', error);
    return c.json({ success: false, error: 'Failed to create quote' }, 500);
  }
});

// Update a quote
app.put("/make-server-6023d608/quotes/:id", async (c) => {
  try {
    const quoteId = c.req.param('id');
    const body = await c.req.json();
    const quotes = await kv.get('quotes') || [];
    
    const quoteIndex = quotes.findIndex((q: any) => q.id === quoteId);
    if (quoteIndex === -1) {
      return c.json({ success: false, error: 'Quote not found' }, 404);
    }
    
    const updatedQuote = {
      ...quotes[quoteIndex],
      ...body,
      updated_at: new Date().toISOString(),
    };
    
    quotes[quoteIndex] = updatedQuote;
    await kv.set('quotes', quotes);
    
    return c.json({ success: true, data: updatedQuote, message: 'Quote updated successfully' });
  } catch (error) {
    console.error('Error updating quote:', error);
    return c.json({ success: false, error: 'Failed to update quote' }, 500);
  }
});

// Delete a quote
app.delete("/make-server-6023d608/quotes/:id", async (c) => {
  try {
    const quoteId = c.req.param('id');
    const quotes = await kv.get('quotes') || [];
    
    const filteredQuotes = quotes.filter((q: any) => q.id !== quoteId);
    if (filteredQuotes.length === quotes.length) {
      return c.json({ success: false, error: 'Quote not found' }, 404);
    }
    
    await kv.set('quotes', filteredQuotes);
    
    return c.json({ success: true, message: 'Quote deleted successfully' });
  } catch (error) {
    console.error('Error deleting quote:', error);
    return c.json({ success: false, error: 'Failed to delete quote' }, 500);
  }
});

// Send quote email
app.post("/make-server-6023d608/quotes/:id/send", async (c) => {
  try {
    const quoteId = c.req.param('id');
    const quotes = await kv.get('quotes') || [];
    const customers = await kv.get('customers') || [];
    
    const quoteIndex = quotes.findIndex((q: any) => q.id === quoteId);
    if (quoteIndex === -1) {
      return c.json({ success: false, error: 'Quote not found' }, 404);
    }
    
    const quote = quotes[quoteIndex];
    const customer = customers.find((c: any) => c.id === quote.customer_id);
    
    if (!customer) {
      return c.json({ success: false, error: 'Customer not found' }, 404);
    }
    
    // Update quote status to sent
    quote.status = 'sent';
    quote.sent_at = new Date().toISOString();
    quotes[quoteIndex] = quote;
    await kv.set('quotes', quotes);
    
    // Send email via Resend
    const resendApiKey = Deno.env.get('RESEND_API_KEY');
    
    if (!resendApiKey) {
      console.warn('RESEND_API_KEY not configured - email not sent');
      return c.json({ 
        success: true, 
        message: 'Quote marked as sent, but email service not configured. Please set RESEND_API_KEY.' 
      });
    }
    
    const emailHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Quote from CIELO OS</title>
        </head>
        <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #0A0A0A; color: #ffffff;">
          <div style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">
            <div style="background: #1A1A1A; border: 1px solid #2A2A2A; border-radius: 12px; padding: 40px;">
              <div style="text-align: center; margin-bottom: 30px;">
                <h1 style="margin: 0; color: #A6E0FF; font-size: 28px;">Quote #${quote.quote_number}</h1>
              </div>
              
              <div style="margin-bottom: 30px;">
                <p style="color: #E0E0E0; font-size: 16px; margin-bottom: 10px;">
                  Hi ${customer.name},
                </p>
                <p style="color: #E0E0E0; font-size: 16px; margin-bottom: 20px;">
                  Thank you for your interest! Please find your quote below.
                </p>
              </div>
              
              <div style="background: #0F0F0F; border: 1px solid #2A2A2A; border-radius: 8px; padding: 20px; margin-bottom: 30px;">
                <table style="width: 100%; color: #E0E0E0;">
                  <tr>
                    <td style="padding: 8px 0;"><strong>Quote Number:</strong></td>
                    <td style="padding: 8px 0; text-align: right;">${quote.quote_number}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0;"><strong>Total:</strong></td>
                    <td style="padding: 8px 0; text-align: right; color: #A6E0FF; font-size: 20px;">$${quote.total.toFixed(2)}</td>
                  </tr>
                  ${quote.valid_until ? `
                  <tr>
                    <td style="padding: 8px 0;"><strong>Valid Until:</strong></td>
                    <td style="padding: 8px 0; text-align: right;">${new Date(quote.valid_until).toLocaleDateString()}</td>
                  </tr>
                  ` : ''}
                </table>
              </div>
              
              <div style="text-align: center; margin-top: 30px;">
                <p style="color: #A0A0A0; font-size: 14px; margin-bottom: 20px;">
                  If you have any questions, please don't hesitate to reach out.
                </p>
                <p style="color: #A0A0A0; font-size: 14px;">
                  Best regards,<br>CIELO OS Team
                </p>
              </div>
            </div>
          </div>
        </body>
      </html>
    `;
    
    const emailResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${resendApiKey}`
      },
      body: JSON.stringify({
        from: 'CIELO OS <onboarding@resend.dev>',
        to: [customer.email],
        subject: `Quote #${quote.quote_number} from CIELO OS`,
        html: emailHtml
      })
    });
    
    if (!emailResponse.ok) {
      const errorText = await emailResponse.text();
      console.error('Email sending failed:', errorText);
      return c.json({ 
        success: true, 
        message: 'Quote marked as sent, but email delivery failed. Please check email configuration.' 
      });
    }
    
    return c.json({ success: true, message: 'Quote sent successfully' });
  } catch (error) {
    console.error('Error sending quote:', error);
    return c.json({ success: false, error: 'Failed to send quote' }, 500);
  }
});

// ==================== CUSTOMERS MANAGEMENT ====================

// Get all customers
app.get("/make-server-6023d608/customers", async (c) => {
  try {
    const customers = await kv.get('customers') || [];
    return c.json({ success: true, data: customers });
  } catch (error) {
    console.error('Error fetching customers:', error);
    return c.json({ success: false, error: 'Failed to fetch customers' }, 500);
  }
});

// Create a new customer
app.post("/make-server-6023d608/customers", async (c) => {
  try {
    const body = await c.req.json();
    const customers = await kv.get('customers') || [];
    
    const newCustomer = {
      id: `customer-${Date.now()}`,
      name: body.name,
      email: body.email,
      company: body.company || '',
      phone: body.phone || '',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    
    customers.push(newCustomer);
    await kv.set('customers', customers);
    
    return c.json({ success: true, data: newCustomer, message: 'Customer created successfully' });
  } catch (error) {
    console.error('Error creating customer:', error);
    return c.json({ success: false, error: 'Failed to create customer' }, 500);
  }
});

// ==================== CATALOG ITEMS MANAGEMENT ====================

// Get all catalog items
app.get("/make-server-6023d608/catalog", async (c) => {
  try {
    const catalogItems = await kv.get('catalog_items') || [];
    return c.json({ success: true, data: catalogItems });
  } catch (error) {
    console.error('Error fetching catalog items:', error);
    return c.json({ success: false, error: 'Failed to fetch catalog items' }, 500);
  }
});

// Create a new catalog item
app.post("/make-server-6023d608/catalog", async (c) => {
  try {
    const body = await c.req.json();
    const catalogItems = await kv.get('catalog_items') || [];
    
    const newItem = {
      id: `item-${Date.now()}`,
      name: body.name,
      description: body.description || '',
      price: body.price || 0,
      sku: body.sku || '',
      category: body.category || '',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    
    catalogItems.push(newItem);
    await kv.set('catalog_items', catalogItems);
    
    return c.json({ success: true, data: newItem, message: 'Catalog item created successfully' });
  } catch (error) {
    console.error('Error creating catalog item:', error);
    return c.json({ success: false, error: 'Failed to create catalog item' }, 500);
  }
});

// ==================== TEAM TOOLS MANAGEMENT ====================

// Get all team tools
app.get("/make-server-6023d608/team-tools", async (c) => {
  try {
    const tools = await kv.get('team_tools') || [];
    return c.json({ success: true, data: tools });
  } catch (error) {
    console.error('Error fetching team tools:', error);
    return c.json({ success: false, error: 'Failed to fetch team tools' }, 500);
  }
});

// Create a new team tool
app.post("/make-server-6023d608/team-tools", async (c) => {
  try {
    const body = await c.req.json();
    const tools = await kv.get('team_tools') || [];
    
    const newTool = {
      id: `tool-${Date.now()}`,
      name: body.name,
      description: body.description,
      type: body.type || 'tool',
      category: body.category || '',
      url: body.url,
      icon: body.icon || 'wrench',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    tools.push(newTool);
    await kv.set('team_tools', tools);
    
    return c.json({ success: true, data: newTool, message: 'Tool created successfully' });
  } catch (error) {
    console.error('Error creating team tool:', error);
    return c.json({ success: false, error: 'Failed to create tool' }, 500);
  }
});

// Update a team tool
app.put("/make-server-6023d608/team-tools/:toolId", async (c) => {
  try {
    const toolId = c.req.param('toolId');
    const body = await c.req.json();
    const tools = await kv.get('team_tools') || [];
    
    const toolIndex = tools.findIndex((t: any) => t.id === toolId);
    if (toolIndex === -1) {
      return c.json({ success: false, error: 'Tool not found' }, 404);
    }
    
    tools[toolIndex] = {
      ...tools[toolIndex],
      name: body.name,
      description: body.description,
      type: body.type,
      category: body.category,
      url: body.url,
      icon: body.icon,
      updatedAt: new Date().toISOString(),
    };
    
    await kv.set('team_tools', tools);
    
    return c.json({ success: true, data: tools[toolIndex], message: 'Tool updated successfully' });
  } catch (error) {
    console.error('Error updating team tool:', error);
    return c.json({ success: false, error: 'Failed to update tool' }, 500);
  }
});

// Delete a team tool
app.delete("/make-server-6023d608/team-tools/:toolId", async (c) => {
  try {
    const toolId = c.req.param('toolId');
    const tools = await kv.get('team_tools') || [];
    
    const updatedTools = tools.filter((t: any) => t.id !== toolId);
    await kv.set('team_tools', updatedTools);
    
    return c.json({ success: true, message: 'Tool deleted successfully' });
  } catch (error) {
    console.error('Error deleting team tool:', error);
    return c.json({ success: false, error: 'Failed to delete tool' }, 500);
  }
});

// ==================== CLIENT FILE MANAGEMENT ====================

// Get file channels for a client
app.get("/make-server-6023d608/clients/:clientId/file-channels", async (c) => {
  try {
    const clientId = c.req.param('clientId');
    const channels = await kv.get(`file_channels_${clientId}`) || [
      { id: 'general', name: 'General', clientId, fileCount: 0, createdAt: new Date().toISOString() }
    ];
    return c.json({ success: true, data: channels });
  } catch (error) {
    console.error('Error fetching file channels:', error);
    return c.json({ success: false, error: 'Failed to fetch file channels' }, 500);
  }
});

// Create a new file channel
app.post("/make-server-6023d608/clients/:clientId/file-channels", async (c) => {
  try {
    const clientId = c.req.param('clientId');
    const body = await c.req.json();
    const channels = await kv.get(`file_channels_${clientId}`) || [];
    
    const newChannel = {
      id: `channel-${Date.now()}`,
      name: body.name,
      clientId: clientId,
      fileCount: 0,
      createdAt: new Date().toISOString()
    };
    
    channels.push(newChannel);
    await kv.set(`file_channels_${clientId}`, channels);
    
    return c.json({ success: true, data: newChannel, message: 'Channel created successfully' });
  } catch (error) {
    console.error('Error creating file channel:', error);
    return c.json({ success: false, error: 'Failed to create channel' }, 500);
  }
});

// Get files for a specific client
app.get("/make-server-6023d608/clients/:clientId/files", async (c) => {
  try {
    const clientId = c.req.param('clientId');
    const files = await kv.get(`client_files_${clientId}`) || [];
    return c.json({ success: true, data: files });
  } catch (error) {
    console.error('Error fetching client files:', error);
    return c.json({ success: false, error: 'Failed to fetch client files' }, 500);
  }
});

// Upload file for a client
app.post("/make-server-6023d608/clients/:clientId/files/upload", async (c) => {
  try {
    const clientId = c.req.param('clientId');
    const formData = await c.req.formData();
    const file = formData.get('file') as File;
    const channelId = formData.get('channelId') as string || 'general';
    const uploadedBy = formData.get('uploadedBy') as string || 'User';
    
    if (!file) {
      return c.json({ success: false, error: 'No file provided' }, 400);
    }

    const fileName = `client-${clientId}/${Date.now()}-${file.name}`;
    const bucketName = 'make-6023d608-files';
    let signedUrl = null;
    let storagePath = null;

    // Try to upload to Supabase Storage if available
    if (storageAvailable) {
      try {
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from(bucketName)
          .upload(fileName, file);

        if (!uploadError) {
          // Create signed URL (7 days)
          const { data: urlData } = await supabase.storage
            .from(bucketName)
            .createSignedUrl(fileName, 60 * 60 * 24 * 7);
          
          signedUrl = urlData?.signedUrl;
          storagePath = fileName;
        } else {
          console.log('Storage upload failed, storing metadata only:', uploadError.message);
        }
      } catch (storageError) {
        console.log('Storage operation failed, storing metadata only:', storageError);
      }
    }

    // Save file metadata
    const files = await kv.get(`client_files_${clientId}`) || [];
    const newFile = {
      id: `file-${Date.now()}`,
      name: file.name,
      size: `${(file.size / 1024 / 1024).toFixed(2)} MB`,
      type: file.type,
      channelId: channelId,
      clientId: clientId,
      storagePath: storagePath,
      url: signedUrl || '#',
      uploadedBy: uploadedBy,
      uploadedAt: new Date().toISOString(),
      storageAvailable: storageAvailable && !!storagePath
    };
    
    files.push(newFile);
    await kv.set(`client_files_${clientId}`, files);

    // Update channel file count
    const channels = await kv.get(`file_channels_${clientId}`) || [];
    const updatedChannels = channels.map((ch: any) => 
      ch.id === channelId ? { ...ch, fileCount: (ch.fileCount || 0) + 1 } : ch
    );
    await kv.set(`file_channels_${clientId}`, updatedChannels);

    return c.json({ 
      success: true, 
      data: newFile,
      message: storageAvailable && storagePath 
        ? 'File uploaded successfully' 
        : 'File metadata saved (storage not available for file content)'
    });
  } catch (error) {
    console.error('Error uploading client file:', error);
    return c.json({ success: false, error: 'Failed to upload file' }, 500);
  }
});

// Add external link for a client
app.post("/make-server-6023d608/clients/:clientId/links", async (c) => {
  try {
    const clientId = c.req.param('clientId');
    const body = await c.req.json();
    
    const files = await kv.get(`client_files_${clientId}`) || [];
    const newLink = {
      id: `link-${Date.now()}`,
      name: body.name || body.url,
      url: body.url,
      type: 'link',
      channelId: body.channelId || 'general',
      clientId: clientId,
      uploadedBy: body.uploadedBy || 'User',
      uploadedAt: new Date().toISOString(),
      isExternalLink: true
    };
    
    files.push(newLink);
    await kv.set(`client_files_${clientId}`, files);

    // Update channel file count
    const channels = await kv.get(`file_channels_${clientId}`) || [];
    const updatedChannels = channels.map((ch: any) => 
      ch.id === newLink.channelId ? { ...ch, fileCount: (ch.fileCount || 0) + 1 } : ch
    );
    await kv.set(`file_channels_${clientId}`, updatedChannels);

    return c.json({ success: true, data: newLink, message: 'Link added successfully' });
  } catch (error) {
    console.error('Error adding link:', error);
    return c.json({ success: false, error: 'Failed to add link' }, 500);
  }
});

// Delete file for a client
app.delete("/make-server-6023d608/clients/:clientId/files/:fileId", async (c) => {
  try {
    const clientId = c.req.param('clientId');
    const fileId = c.req.param('fileId');
    
    const files = await kv.get(`client_files_${clientId}`) || [];
    const fileToDelete = files.find((f: any) => f.id === fileId);
    
    if (!fileToDelete) {
      return c.json({ success: false, error: 'File not found' }, 404);
    }

    // Delete from storage if it was stored there
    if (storageAvailable && fileToDelete.storagePath) {
      try {
        await supabase.storage
          .from('make-6023d608-files')
          .remove([fileToDelete.storagePath]);
      } catch (storageError) {
        console.log('Storage delete failed (non-critical):', storageError);
      }
    }

    // Remove from files list
    const updatedFiles = files.filter((f: any) => f.id !== fileId);
    await kv.set(`client_files_${clientId}`, updatedFiles);

    // Update channel file count
    const channels = await kv.get(`file_channels_${clientId}`) || [];
    const updatedChannels = channels.map((ch: any) => 
      ch.id === fileToDelete.channelId ? { ...ch, fileCount: Math.max(0, (ch.fileCount || 1) - 1) } : ch
    );
    await kv.set(`file_channels_${clientId}`, updatedChannels);

    return c.json({ success: true, message: 'File deleted successfully' });
  } catch (error) {
    console.error('Error deleting client file:', error);
    return c.json({ success: false, error: 'Failed to delete file' }, 500);
  }
});

// ==================== CLIENT PORTAL SETTINGS ====================

// Get client portal settings (social media & brand web URLs)
app.get("/make-server-6023d608/client-portal-settings", async (c) => {
  try {
    // In a real app, this would be per-client. For now, using a single settings object
    const settings = await kv.get('client_portal_settings') || {
      socialMediaUrl: "https://share.plannthat.com/b/6f35260f05f20f99c0a9a88dff06ad11/2042127/grid",
      socialMediaLocked: false,
      brandWebUrl: "https://docs.google.com/spreadsheets/d/1MI7ynnujHwXN91pBVMdQuUmcvmVMI6Vgx4LxoMD9q6E/edit?usp=sharing",
      brandWebLocked: false
    };
    return c.json({ success: true, data: settings });
  } catch (error) {
    console.error('Error fetching client portal settings:', error);
    return c.json({ success: false, error: 'Failed to fetch settings' }, 500);
  }
});

// Get client portal settings for a specific client (management view)
app.get("/make-server-6023d608/clients/:clientId/portal-settings", async (c) => {
  try {
    const clientId = c.req.param('clientId');
    const settings = await kv.get(`client_portal_settings_${clientId}`) || {
      clientId,
      socialMediaUrl: "https://share.plannthat.com/b/6f35260f05f20f99c0a9a88dff06ad11/2042127/grid",
      socialMediaLocked: false,
      brandWebUrl: "https://docs.google.com/spreadsheets/d/1MI7ynnujHwXN91pBVMdQuUmcvmVMI6Vgx4LxoMD9q6E/edit?usp=sharing",
      brandWebLocked: false
    };
    return c.json({ success: true, data: settings });
  } catch (error) {
    console.error('Error fetching client portal settings:', error);
    return c.json({ success: false, error: 'Failed to fetch settings' }, 500);
  }
});

// Update client portal settings
app.put("/make-server-6023d608/clients/:clientId/portal-settings", async (c) => {
  try {
    const clientId = c.req.param('clientId');
    const body = await c.req.json();
    
    const settings = {
      clientId,
      socialMediaUrl: body.socialMediaUrl,
      socialMediaLocked: body.socialMediaLocked,
      brandWebUrl: body.brandWebUrl,
      brandWebLocked: body.brandWebLocked,
      updatedAt: new Date().toISOString()
    };
    
    await kv.set(`client_portal_settings_${clientId}`, settings);
    
    console.log(`Updated portal settings for client ${clientId}`);
    return c.json({ success: true, data: settings });
  } catch (error) {
    console.error('Error updating client portal settings:', error);
    return c.json({ success: false, error: 'Failed to update settings' }, 500);
  }
});

// Key-Value Store API (for automations and general storage)
app.get("/make-server-6023d608/kv/:key", async (c) => {
  try {
    const key = c.req.param('key');
    const value = await kv.get(key);
    
    if (value === null) {
      return c.json({ success: false, error: 'Key not found' }, 404);
    }
    
    return c.json({ success: true, data: value });
  } catch (error) {
    console.error('Error getting KV value:', error);
    return c.json({ success: false, error: 'Failed to get value' }, 500);
  }
});

app.put("/make-server-6023d608/kv/:key", async (c) => {
  try {
    const key = c.req.param('key');
    const body = await c.req.json();
    const value = body.value;
    
    if (typeof value === 'undefined') {
      return c.json({ success: false, error: 'Value is required' }, 400);
    }
    
    await kv.set(key, value);
    return c.json({ success: true, message: 'Value stored successfully' });
  } catch (error) {
    console.error('Error setting KV value:', error);
    return c.json({ success: false, error: 'Failed to store value' }, 500);
  }
});

app.delete("/make-server-6023d608/kv/:key", async (c) => {
  try {
    const key = c.req.param('key');
    await kv.del(key);
    return c.json({ success: true, message: 'Value deleted successfully' });
  } catch (error) {
    console.error('Error deleting KV value:', error);
    return c.json({ success: false, error: 'Failed to delete value' }, 500);
  }
});

Deno.serve(app.fetch);