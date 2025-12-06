import { createClient } from '@supabase/supabase-js';
import { projectId, publicAnonKey } from './info';

// Create Supabase client
const supabase = createClient(
  `https://${projectId}.supabase.co`,
  publicAnonKey
);

export default supabase;

// API helper functions
const BASE_URL = `https://${projectId}.supabase.co/functions/v1/make-server-6023d608`;

export const api = {
  // Health check
  healthCheck: async () => {
    try {
      const response = await fetch(`${BASE_URL}/health`, {
        headers: { 'Authorization': `Bearer ${publicAnonKey}` }
      });
      const result = await response.json();
      console.log('Server health:', result);
      return result;
    } catch (error) {
      console.error('Health check failed:', error);
      return { status: "error", error: error.message };
    }
  },

  // Brand Information
  getBrandInfo: async () => {
    try {
      const response = await fetch(`${BASE_URL}/brand`, {
        headers: { 'Authorization': `Bearer ${publicAnonKey}` }
      });
      if (!response.ok) {
        console.error(`Brand info fetch failed: HTTP ${response.status}`);
        // Return default empty data instead of throwing
        return {
          success: true,
          data: {
            companyName: '',
            industry: '',
            targetAudience: '',
            brandPersonality: '',
            challenges: ''
          }
        };
      }
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        console.error('Brand info response is not JSON');
        // Return default empty data if response is not JSON (e.g., HTML error page)
        return {
          success: true,
          data: {
            companyName: '',
            industry: '',
            targetAudience: '',
            brandPersonality: '',
            challenges: ''
          }
        };
      }
      return response.json();
    } catch (error) {
      console.error('Error fetching brand info:', error);
      // Return default empty data instead of error
      return {
        success: true,
        data: {
          companyName: '',
          industry: '',
          targetAudience: '',
          brandPersonality: '',
          challenges: ''
        }
      };
    }
  },

  saveBrandInfo: async (data: any) => {
    try {
      const response = await fetch(`${BASE_URL}/brand`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${publicAnonKey}`
        },
        body: JSON.stringify(data)
      });
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      return response.json();
    } catch (error) {
      console.error('Error saving brand info:', error);
      return { success: false, error: error.message };
    }
  },

  // Files
  getFiles: async () => {
    const response = await fetch(`${BASE_URL}/files`, {
      headers: { 'Authorization': `Bearer ${publicAnonKey}` }
    });
    return response.json();
  },

  uploadFile: async (file: File, addedBy?: string) => {
    const formData = new FormData();
    formData.append('file', file);
    if (addedBy) formData.append('addedBy', addedBy);

    const response = await fetch(`${BASE_URL}/files/upload`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${publicAnonKey}` },
      body: formData
    });
    return response.json();
  },

  deleteFile: async (fileId: string) => {
    const response = await fetch(`${BASE_URL}/files/${fileId}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${publicAnonKey}` }
    });
    return response.json();
  },

  // Design Requests
  getRequests: async () => {
    const response = await fetch(`${BASE_URL}/requests`, {
      headers: { 'Authorization': `Bearer ${publicAnonKey}` }
    });
    return response.json();
  },

  createRequest: async (data: any) => {
    const response = await fetch(`${BASE_URL}/requests`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${publicAnonKey}`
      },
      body: JSON.stringify(data)
    });
    return response.json();
  },

  updateRequest: async (requestId: string, data: any) => {
    const response = await fetch(`${BASE_URL}/requests/${requestId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${publicAnonKey}`
      },
      body: JSON.stringify(data)
    });
    return response.json();
  },

  // AI Insights
  getInsights: async () => {
    const response = await fetch(`${BASE_URL}/insights`, {
      headers: { 'Authorization': `Bearer ${publicAnonKey}` }
    });
    return response.json();
  },

  saveInsights: async (data: any) => {
    const response = await fetch(`${BASE_URL}/insights`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${publicAnonKey}`
      },
      body: JSON.stringify(data)
    });
    return response.json();
  },

  // Strategy Data
  getStrategy: async () => {
    const response = await fetch(`${BASE_URL}/strategy`, {
      headers: { 'Authorization': `Bearer ${publicAnonKey}` }
    });
    return response.json();
  },

  saveStrategy: async (data: any) => {
    const response = await fetch(`${BASE_URL}/strategy`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${publicAnonKey}`
      },
      body: JSON.stringify(data)
    });
    return response.json();
  },

  // Meeting Records
  getMeetings: async () => {
    const response = await fetch(`${BASE_URL}/meetings`, {
      headers: { 'Authorization': `Bearer ${publicAnonKey}` }
    });
    return response.json();
  },

  saveMeeting: async (data: any) => {
    const response = await fetch(`${BASE_URL}/meetings`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${publicAnonKey}`
      },
      body: JSON.stringify(data)
    });
    return response.json();
  },

  // Initialize default data
  initializeData: async () => {
    try {
      const response = await fetch(`${BASE_URL}/init`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${publicAnonKey}` }
      });
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      return response.json();
    } catch (error) {
      console.error('Error initializing data:', error);
      return { success: false, error: error.message };
    }
  },

  // Clients
  getClients: async () => {
    try {
      const response = await fetch(`${BASE_URL}/clients`, {
        headers: { 'Authorization': `Bearer ${publicAnonKey}` }
      });
      return response.json();
    } catch (error) {
      console.error('Error fetching clients:', error);
      return { success: false, error: error.message };
    }
  },

  createClient: async (data: any) => {
    try {
      const response = await fetch(`${BASE_URL}/clients`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${publicAnonKey}`
        },
        body: JSON.stringify(data)
      });
      return response.json();
    } catch (error) {
      console.error('Error creating client:', error);
      return { success: false, error: error.message };
    }
  },

  updateClient: async (clientId: string, data: any) => {
    try {
      const response = await fetch(`${BASE_URL}/clients/${clientId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${publicAnonKey}`
        },
        body: JSON.stringify(data)
      });
      return response.json();
    } catch (error) {
      console.error('Error updating client:', error);
      return { success: false, error: error.message };
    }
  },

  sendClientInvitation: async (clientId: string) => {
    try {
      const response = await fetch(`${BASE_URL}/clients/${clientId}/invite`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${publicAnonKey}`
        }
      });
      return response.json();
    } catch (error) {
      console.error('Error sending invitation:', error);
      return { success: false, error: error.message };
    }
  },

  // Tasks
  getTasks: async () => {
    try {
      const response = await fetch(`${BASE_URL}/tasks`, {
        headers: { 'Authorization': `Bearer ${publicAnonKey}` }
      });
      return response.json();
    } catch (error) {
      console.error('Error fetching tasks:', error);
      return { success: false, error: error.message };
    }
  },

  updateTask: async (taskId: string, data: any) => {
    try {
      const response = await fetch(`${BASE_URL}/tasks/${taskId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${publicAnonKey}`
        },
        body: JSON.stringify(data)
      });
      return response.json();
    } catch (error) {
      console.error('Error updating task:', error);
      return { success: false, error: error.message };
    }
  },

  createTask: async (data: any) => {
    try {
      const response = await fetch(`${BASE_URL}/tasks`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${publicAnonKey}`
        },
        body: JSON.stringify(data)
      });
      return response.json();
    } catch (error) {
      console.error('Error creating task:', error);
      return { success: false, error: error.message };
    }
  },

  // Team Members
  getTeamMembers: async () => {
    try {
      const response = await fetch(`${BASE_URL}/team`, {
        headers: { 'Authorization': `Bearer ${publicAnonKey}` }
      });
      return response.json();
    } catch (error) {
      console.error('Error fetching team members:', error);
      return { success: false, error: error.message };
    }
  },

  inviteTeamMember: async (data: any) => {
    try {
      const response = await fetch(`${BASE_URL}/team/invite`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${publicAnonKey}`
        },
        body: JSON.stringify(data)
      });
      return response.json();
    } catch (error) {
      console.error('Error inviting team member:', error);
      return { success: false, error: error.message };
    }
  },

  removeTeamMember: async (memberId: string) => {
    try {
      const response = await fetch(`${BASE_URL}/team/${memberId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${publicAnonKey}` }
      });
      return response.json();
    } catch (error) {
      console.error('Error removing team member:', error);
      return { success: false, error: error.message };
    }
  },

  // Client Plans
  getClientPlans: async () => {
    try {
      const response = await fetch(`${BASE_URL}/plans`, {
        headers: { 'Authorization': `Bearer ${publicAnonKey}` }
      });
      return response.json();
    } catch (error) {
      console.error('Error fetching client plans:', error);
      return { success: false, error: error.message };
    }
  },

  updateClientPlan: async (clientId: string, data: any) => {
    try {
      const response = await fetch(`${BASE_URL}/plans/${clientId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${publicAnonKey}`
        },
        body: JSON.stringify(data)
      });
      return response.json();
    } catch (error) {
      console.error('Error updating client plan:', error);
      return { success: false, error: error.message };
    }
  },

  // Client Assets
  getClientAssets: async (clientId: string) => {
    try {
      const response = await fetch(`${BASE_URL}/clients/${clientId}/assets`, {
        headers: { 'Authorization': `Bearer ${publicAnonKey}` }
      });
      return response.json();
    } catch (error) {
      console.error('Error fetching client assets:', error);
      return { success: false, error: error.message, data: [] };
    }
  },

  uploadClientAsset: async (clientId: string, file: File) => {
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch(`${BASE_URL}/clients/${clientId}/assets`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${publicAnonKey}` },
        body: formData
      });
      return response.json();
    } catch (error) {
      console.error('Error uploading client asset:', error);
      return { success: false, error: error.message };
    }
  },

  deleteClientAsset: async (assetId: string) => {
    try {
      const response = await fetch(`${BASE_URL}/assets/${assetId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${publicAnonKey}` }
      });
      return response.json();
    } catch (error) {
      console.error('Error deleting asset:', error);
      return { success: false, error: error.message };
    }
  },

  // Meetings/Recordings
  getMeetings: async () => {
    try {
      const response = await fetch(`${BASE_URL}/meetings`, {
        headers: { 'Authorization': `Bearer ${publicAnonKey}` }
      });
      return response.json();
    } catch (error) {
      console.error('Error fetching meetings:', error);
      return { success: false, error: error.message, data: [] };
    }
  },

  // Activity Logs
  getActivityLogs: async () => {
    try {
      const response = await fetch(`${BASE_URL}/activity`, {
        headers: { 'Authorization': `Bearer ${publicAnonKey}` }
      });
      return response.json();
    } catch (error) {
      console.error('Error fetching activity logs:', error);
      return { success: false, error: error.message, data: [] };
    }
  },

  logActivity: async (data: any) => {
    try {
      const response = await fetch(`${BASE_URL}/activity`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${publicAnonKey}`
        },
        body: JSON.stringify(data)
      });
      return response.json();
    } catch (error) {
      console.error('Error logging activity:', error);
      return { success: false, error: error.message };
    }
  },

  // Invite Client
  inviteClient: async (data: any) => {
    try {
      const response = await fetch(`${BASE_URL}/clients/invite`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${publicAnonKey}`
        },
        body: JSON.stringify(data)
      });
      return response.json();
    } catch (error) {
      console.error('Error inviting client:', error);
      return { success: false, error: error.message };
    }
  },

  // Initialize Demo Data
  initializeDemoData: async () => {
    try {
      const response = await fetch(`${BASE_URL}/init-demo`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${publicAnonKey}` }
      });
      return response.json();
    } catch (error) {
      console.error('Error initializing demo data:', error);
      return { success: false, error: error.message };
    }
  },

  // Client Services
  getClientServices: async (clientId: string) => {
    try {
      const response = await fetch(`${BASE_URL}/clients/${clientId}/services`, {
        headers: { 'Authorization': `Bearer ${publicAnonKey}` }
      });
      return response.json();
    } catch (error) {
      console.error('Error fetching client services:', error);
      return { success: false, error: error.message, data: [] };
    }
  },

  addClientService: async (clientId: string, data: any) => {
    try {
      const response = await fetch(`${BASE_URL}/clients/${clientId}/services`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${publicAnonKey}`
        },
        body: JSON.stringify(data)
      });
      return response.json();
    } catch (error) {
      console.error('Error adding client service:', error);
      return { success: false, error: error.message };
    }
  },

  // Client Contracts
  getClientContracts: async (clientId: string) => {
    try {
      const response = await fetch(`${BASE_URL}/clients/${clientId}/contracts`, {
        headers: { 'Authorization': `Bearer ${publicAnonKey}` }
      });
      return response.json();
    } catch (error) {
      console.error('Error fetching client contracts:', error);
      return { success: false, error: error.message, data: [] };
    }
  },

  addClientContract: async (clientId: string, data: any) => {
    try {
      const response = await fetch(`${BASE_URL}/clients/${clientId}/contracts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${publicAnonKey}`
        },
        body: JSON.stringify(data)
      });
      return response.json();
    } catch (error) {
      console.error('Error adding client contract:', error);
      return { success: false, error: error.message };
    }
  },

  // Client Comments
  getClientComments: async (clientId: string) => {
    try {
      const response = await fetch(`${BASE_URL}/clients/${clientId}/comments`, {
        headers: { 'Authorization': `Bearer ${publicAnonKey}` }
      });
      return response.json();
    } catch (error) {
      console.error('Error fetching client comments:', error);
      return { success: false, error: error.message, data: [] };
    }
  },

  addClientComment: async (clientId: string, content: string, parentId?: string, images?: any[]) => {
    try {
      const response = await fetch(`${BASE_URL}/clients/${clientId}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${publicAnonKey}`
        },
        body: JSON.stringify({ content, parentId, images })
      });
      return response.json();
    } catch (error) {
      console.error('Error adding client comment:', error);
      return { success: false, error: error.message };
    }
  },

  updateClientComment: async (commentId: string, content: string) => {
    try {
      const response = await fetch(`${BASE_URL}/comments/${commentId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${publicAnonKey}`
        },
        body: JSON.stringify({ content })
      });
      return response.json();
    } catch (error) {
      console.error('Error updating comment:', error);
      return { success: false, error: error.message };
    }
  },

  deleteClientComment: async (commentId: string) => {
    try {
      const response = await fetch(`${BASE_URL}/comments/${commentId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${publicAnonKey}` }
      });
      return response.json();
    } catch (error) {
      console.error('Error deleting comment:', error);
      return { success: false, error: error.message };
    }
  },

  uploadCommentImage: async (commentId: string, file: File) => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      
      const response = await fetch(`${BASE_URL}/comments/${commentId}/images`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${publicAnonKey}` },
        body: formData
      });
      return response.json();
    } catch (error) {
      console.error('Error uploading comment image:', error);
      return { success: false, error: error.message };
    }
  },

  // Client Activity
  getClientActivity: async (clientId: string) => {
    try {
      const response = await fetch(`${BASE_URL}/clients/${clientId}/activity`, {
        headers: { 'Authorization': `Bearer ${publicAnonKey}` }
      });
      return response.json();
    } catch (error) {
      console.error('Error fetching client activity:', error);
      return { success: false, error: error.message, data: [] };
    }
  },

  // Quotes Management
  getQuotes: async () => {
    try {
      const response = await fetch(`${BASE_URL}/quotes`, {
        headers: { 'Authorization': `Bearer ${publicAnonKey}` }
      });
      return response.json();
    } catch (error) {
      console.error('Error fetching quotes:', error);
      return { success: false, error: error.message, data: [] };
    }
  },

  createQuote: async (quoteData: any) => {
    try {
      const response = await fetch(`${BASE_URL}/quotes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${publicAnonKey}`
        },
        body: JSON.stringify(quoteData)
      });
      return response.json();
    } catch (error) {
      console.error('Error creating quote:', error);
      return { success: false, error: error.message };
    }
  },

  updateQuote: async (quoteId: string, quoteData: any) => {
    try {
      const response = await fetch(`${BASE_URL}/quotes/${quoteId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${publicAnonKey}`
        },
        body: JSON.stringify(quoteData)
      });
      return response.json();
    } catch (error) {
      console.error('Error updating quote:', error);
      return { success: false, error: error.message };
    }
  },

  deleteQuote: async (quoteId: string) => {
    try {
      const response = await fetch(`${BASE_URL}/quotes/${quoteId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${publicAnonKey}` }
      });
      return response.json();
    } catch (error) {
      console.error('Error deleting quote:', error);
      return { success: false, error: error.message };
    }
  },

  sendQuoteEmail: async (quoteId: string) => {
    try {
      const response = await fetch(`${BASE_URL}/quotes/${quoteId}/send`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${publicAnonKey}` }
      });
      return response.json();
    } catch (error) {
      console.error('Error sending quote email:', error);
      return { success: false, error: error.message };
    }
  },

  // Customers Management
  getQuoteCustomers: async () => {
    try {
      const response = await fetch(`${BASE_URL}/customers`, {
        headers: { 'Authorization': `Bearer ${publicAnonKey}` }
      });
      return response.json();
    } catch (error) {
      console.error('Error fetching customers:', error);
      return { success: false, error: error.message, data: [] };
    }
  },

  createQuoteCustomer: async (customerData: any) => {
    try {
      const response = await fetch(`${BASE_URL}/customers`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${publicAnonKey}`
        },
        body: JSON.stringify(customerData)
      });
      return response.json();
    } catch (error) {
      console.error('Error creating customer:', error);
      return { success: false, error: error.message };
    }
  },

  // Catalog Items Management
  getCatalogItems: async () => {
    try {
      const response = await fetch(`${BASE_URL}/catalog`, {
        headers: { 'Authorization': `Bearer ${publicAnonKey}` }
      });
      return response.json();
    } catch (error) {
      console.error('Error fetching catalog items:', error);
      return { success: false, error: error.message, data: [] };
    }
  },

  createCatalogItem: async (itemData: any) => {
    try {
      const response = await fetch(`${BASE_URL}/catalog`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${publicAnonKey}`
        },
        body: JSON.stringify(itemData)
      });
      return response.json();
    } catch (error) {
      console.error('Error creating catalog item:', error);
      return { success: false, error: error.message };
    }
  },

  // Recording Notes
  addRecordingNote: async (recordingId: string, content: string, author?: string) => {
    try {
      const response = await fetch(`${BASE_URL}/recordings/${recordingId}/notes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${publicAnonKey}`
        },
        body: JSON.stringify({ content, author })
      });
      return response.json();
    } catch (error) {
      console.error('Error adding recording note:', error);
      return { success: false, error: error.message };
    }
  },

  getRecordingNotes: async (recordingId: string) => {
    try {
      const response = await fetch(`${BASE_URL}/recordings/${recordingId}/notes`, {
        headers: { 'Authorization': `Bearer ${publicAnonKey}` }
      });
      return response.json();
    } catch (error) {
      console.error('Error fetching recording notes:', error);
      return { success: false, error: error.message, data: [] };
    }
  },

  deleteRecordingNote: async (noteId: string) => {
    try {
      const response = await fetch(`${BASE_URL}/recordings/notes/${noteId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${publicAnonKey}` }
      });
      return response.json();
    } catch (error) {
      console.error('Error deleting recording note:', error);
      return { success: false, error: error.message };
    }
  },

  // Client File Management
  getClientFileChannels: async (clientId: string) => {
    try {
      const response = await fetch(`${BASE_URL}/clients/${clientId}/file-channels`, {
        headers: { 'Authorization': `Bearer ${publicAnonKey}` }
      });
      return response.json();
    } catch (error) {
      console.error('Error fetching file channels:', error);
      return { success: false, error: error.message, data: [] };
    }
  },

  createClientFileChannel: async (clientId: string, name: string) => {
    try {
      const response = await fetch(`${BASE_URL}/clients/${clientId}/file-channels`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${publicAnonKey}`
        },
        body: JSON.stringify({ name })
      });
      return response.json();
    } catch (error) {
      console.error('Error creating file channel:', error);
      return { success: false, error: error.message };
    }
  },

  getClientFiles: async (clientId: string) => {
    try {
      const response = await fetch(`${BASE_URL}/clients/${clientId}/files`, {
        headers: { 'Authorization': `Bearer ${publicAnonKey}` }
      });
      return response.json();
    } catch (error) {
      console.error('Error fetching client files:', error);
      return { success: false, error: error.message, data: [] };
    }
  },

  uploadClientFile: async (clientId: string, file: File, channelId?: string, uploadedBy?: string) => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      if (channelId) formData.append('channelId', channelId);
      if (uploadedBy) formData.append('uploadedBy', uploadedBy);

      const response = await fetch(`${BASE_URL}/clients/${clientId}/files/upload`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${publicAnonKey}` },
        body: formData
      });
      return response.json();
    } catch (error) {
      console.error('Error uploading client file:', error);
      return { success: false, error: error.message };
    }
  },

  addClientLink: async (clientId: string, url: string, name: string, channelId?: string, uploadedBy?: string) => {
    try {
      const response = await fetch(`${BASE_URL}/clients/${clientId}/links`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${publicAnonKey}`
        },
        body: JSON.stringify({ url, name, channelId, uploadedBy })
      });
      return response.json();
    } catch (error) {
      console.error('Error adding client link:', error);
      return { success: false, error: error.message };
    }
  },

  deleteClientFile: async (clientId: string, fileId: string) => {
    try {
      const response = await fetch(`${BASE_URL}/clients/${clientId}/files/${fileId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${publicAnonKey}` }
      });
      return response.json();
    } catch (error) {
      console.error('Error deleting client file:', error);
      return { success: false, error: error.message };
    }
  },

  // Team Tools Management
  getTeamTools: async () => {
    try {
      const response = await fetch(`${BASE_URL}/team-tools`, {
        headers: { 'Authorization': `Bearer ${publicAnonKey}` }
      });
      return response.json();
    } catch (error) {
      console.error('Error fetching team tools:', error);
      return { success: false, error: error.message, data: [] };
    }
  },

  createTeamTool: async (toolData: any) => {
    try {
      const response = await fetch(`${BASE_URL}/team-tools`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${publicAnonKey}`
        },
        body: JSON.stringify(toolData)
      });
      return response.json();
    } catch (error) {
      console.error('Error creating team tool:', error);
      return { success: false, error: error.message };
    }
  },

  updateTeamTool: async (toolId: string, toolData: any) => {
    try {
      const response = await fetch(`${BASE_URL}/team-tools/${toolId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${publicAnonKey}`
        },
        body: JSON.stringify(toolData)
      });
      return response.json();
    } catch (error) {
      console.error('Error updating team tool:', error);
      return { success: false, error: error.message };
    }
  },

  deleteTeamTool: async (toolId: string) => {
    try {
      const response = await fetch(`${BASE_URL}/team-tools/${toolId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${publicAnonKey}` }
      });
      return response.json();
    } catch (error) {
      console.error('Error deleting team tool:', error);
      return { success: false, error: error.message };
    }
  },

  // Client Portal Settings
  getClientPortalSettings: async () => {
    try {
      const response = await fetch(`${BASE_URL}/client-portal-settings`, {
        headers: { 'Authorization': `Bearer ${publicAnonKey}` }
      });
      return response.json();
    } catch (error) {
      console.error('Error fetching client portal settings:', error);
      return { success: false, error: error.message, data: null };
    }
  },

  // Key-Value Store Operations (for automations)
  getValue: async (key: string) => {
    try {
      const response = await fetch(`${BASE_URL}/kv/${key}`, {
        headers: { 'Authorization': `Bearer ${publicAnonKey}` }
      });
      if (!response.ok) {
        return null;
      }
      const result = await response.json();
      return result.data;
    } catch (error) {
      console.error('Error getting value:', error);
      return null;
    }
  },

  setValue: async (key: string, value: string) => {
    try {
      const response = await fetch(`${BASE_URL}/kv/${key}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${publicAnonKey}`
        },
        body: JSON.stringify({ value })
      });
      return response.json();
    } catch (error) {
      console.error('Error setting value:', error);
      return { success: false, error: error.message };
    }
  },

  deleteValue: async (key: string) => {
    try {
      const response = await fetch(`${BASE_URL}/kv/${key}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${publicAnonKey}` }
      });
      return response.json();
    } catch (error) {
      console.error('Error deleting value:', error);
      return { success: false, error: error.message };
    }
  },

  getClientPortalSettingsByClientId: async (clientId: string) => {
    try {
      const response = await fetch(`${BASE_URL}/clients/${clientId}/portal-settings`, {
        headers: { 'Authorization': `Bearer ${publicAnonKey}` }
      });
      return response.json();
    } catch (error) {
      console.error('Error fetching client portal settings:', error);
      return { success: false, error: error.message, data: null };
    }
  },

  updateClientPortalSettings: async (clientId: string, settings: any) => {
    try {
      const response = await fetch(`${BASE_URL}/clients/${clientId}/portal-settings`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${publicAnonKey}`
        },
        body: JSON.stringify(settings)
      });
      return response.json();
    } catch (error) {
      console.error('Error updating client portal settings:', error);
      return { success: false, error: error.message };
    }
  }
};