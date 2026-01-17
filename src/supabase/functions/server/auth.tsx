import { Hono } from "npm:hono";
import { createClient } from "npm:@supabase/supabase-js";
import * as kv from "./kv_store.tsx";

const authApp = new Hono();

// Initialize Supabase client
const supabase = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
);

// Sign up endpoint (creates user in Supabase Auth and stores profile in KV)
authApp.post("/signup", async (c) => {
  try {
    const { email, password, name, userType = 'client' } = await c.req.json();
    
    if (!email || !password || !name) {
      return c.json({ 
        success: false, 
        error: 'Email, password, and name are required' 
      }, 400);
    }

    // Create user in Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email: email,
      password: password,
      email_confirm: true, // Auto-confirm since email server may not be configured
      user_metadata: { 
        name: name,
        userType: userType
      }
    });

    if (authError) {
      console.error('Supabase auth error:', authError);
      return c.json({ 
        success: false, 
        error: authError.message || 'Failed to create user' 
      }, 400);
    }

    // Store user profile in KV store
    const userProfile = {
      id: authData.user.id,
      email: email,
      name: name,
      userType: userType,
      companyName: '',
      role: userType === 'client' ? 'Client' : userType === 'team' ? 'Team Member' : 'Admin',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      lastLoginAt: null
    };

    await kv.set(`user_profile:${authData.user.id}`, userProfile);

    // Also add to users list for easy lookup
    const allUsers = await kv.get('all_users') || [];
    allUsers.push({
      id: authData.user.id,
      email: email,
      name: name,
      userType: userType
    });
    await kv.set('all_users', allUsers);

    console.log(`✓ User created: ${email} (${userType})`);

    return c.json({ 
      success: true, 
      message: 'User created successfully',
      data: {
        user: authData.user,
        profile: userProfile
      }
    });
  } catch (error) {
    console.error('Error creating user:', error);
    return c.json({ 
      success: false, 
      error: error?.message || 'Failed to create user' 
    }, 500);
  }
});

// Sign in endpoint (returns access token and user profile)
authApp.post("/signin", async (c) => {
  try {
    const { email, password } = await c.req.json();
    
    if (!email || !password) {
      return c.json({ 
        success: false, 
        error: 'Email and password are required' 
      }, 400);
    }

    // Sign in with Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email: email,
      password: password
    });

    if (authError) {
      console.error('Sign in error:', authError);
      return c.json({ 
        success: false, 
        error: 'Invalid email or password' 
      }, 401);
    }

    // Get user profile from KV store
    const userProfile = await kv.get(`user_profile:${authData.user.id}`);

    // Update last login time
    if (userProfile) {
      userProfile.lastLoginAt = new Date().toISOString();
      await kv.set(`user_profile:${authData.user.id}`, userProfile);
    }

    console.log(`✓ User signed in: ${email}`);

    return c.json({ 
      success: true, 
      message: 'Sign in successful',
      data: {
        accessToken: authData.session.access_token,
        user: authData.user,
        profile: userProfile || {
          id: authData.user.id,
          email: email,
          name: authData.user.user_metadata?.name || email,
          userType: authData.user.user_metadata?.userType || 'client'
        }
      }
    });
  } catch (error) {
    console.error('Error signing in:', error);
    return c.json({ 
      success: false, 
      error: error?.message || 'Failed to sign in' 
    }, 500);
  }
});

// Google OAuth sign in (initiates OAuth flow)
authApp.post("/google", async (c) => {
  try {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${c.req.header('origin')}/auth/callback`
      }
    });

    if (error) {
      console.error('Google OAuth error:', error);
      return c.json({ 
        success: false, 
        error: error.message 
      }, 400);
    }

    return c.json({ 
      success: true, 
      data: {
        url: data.url
      }
    });
  } catch (error) {
    console.error('Error initiating Google OAuth:', error);
    return c.json({ 
      success: false, 
      error: error?.message || 'Failed to initiate Google sign in' 
    }, 500);
  }
});

// Get or create user profile after Google OAuth
authApp.post("/google-callback", async (c) => {
  try {
    const { accessToken } = await c.req.json();
    
    if (!accessToken) {
      return c.json({ 
        success: false, 
        error: 'Access token is required' 
      }, 400);
    }

    // Get user from access token
    const { data: { user }, error: userError } = await supabase.auth.getUser(accessToken);

    if (userError || !user) {
      return c.json({ 
        success: false, 
        error: 'Invalid access token' 
      }, 401);
    }

    // Check if user profile exists
    let userProfile = await kv.get(`user_profile:${user.id}`);

    // If not, create it
    if (!userProfile) {
      userProfile = {
        id: user.id,
        email: user.email,
        name: user.user_metadata?.name || user.user_metadata?.full_name || user.email,
        userType: 'client', // Default to client for new Google sign-ins
        companyName: '',
        role: 'Client',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        lastLoginAt: new Date().toISOString()
      };

      await kv.set(`user_profile:${user.id}`, userProfile);

      // Add to users list
      const allUsers = await kv.get('all_users') || [];
      allUsers.push({
        id: user.id,
        email: user.email,
        name: userProfile.name,
        userType: 'client'
      });
      await kv.set('all_users', allUsers);

      console.log(`✓ New Google user profile created: ${user.email}`);
    } else {
      // Update last login
      userProfile.lastLoginAt = new Date().toISOString();
      await kv.set(`user_profile:${user.id}`, userProfile);
    }

    return c.json({ 
      success: true, 
      data: {
        user: user,
        profile: userProfile
      }
    });
  } catch (error) {
    console.error('Error handling Google callback:', error);
    return c.json({ 
      success: false, 
      error: error?.message || 'Failed to complete Google sign in' 
    }, 500);
  }
});

// Get user profile
authApp.get("/profile", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    
    if (!accessToken) {
      return c.json({ 
        success: false, 
        error: 'Access token is required' 
      }, 401);
    }

    // Verify token and get user
    const { data: { user }, error: userError } = await supabase.auth.getUser(accessToken);

    if (userError || !user) {
      return c.json({ 
        success: false, 
        error: 'Invalid or expired token' 
      }, 401);
    }

    // Get user profile from KV store
    const userProfile = await kv.get(`user_profile:${user.id}`);

    if (!userProfile) {
      return c.json({ 
        success: false, 
        error: 'User profile not found' 
      }, 404);
    }

    return c.json({ 
      success: true, 
      data: userProfile
    });
  } catch (error) {
    console.error('Error fetching profile:', error);
    return c.json({ 
      success: false, 
      error: error?.message || 'Failed to fetch profile' 
    }, 500);
  }
});

// Update user profile
authApp.put("/profile", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    
    if (!accessToken) {
      return c.json({ 
        success: false, 
        error: 'Access token is required' 
      }, 401);
    }

    // Verify token and get user
    const { data: { user }, error: userError } = await supabase.auth.getUser(accessToken);

    if (userError || !user) {
      return c.json({ 
        success: false, 
        error: 'Invalid or expired token' 
      }, 401);
    }

    const body = await c.req.json();

    // Get existing profile
    const existingProfile = await kv.get(`user_profile:${user.id}`);

    if (!existingProfile) {
      return c.json({ 
        success: false, 
        error: 'User profile not found' 
      }, 404);
    }

    // Update profile
    const updatedProfile = {
      ...existingProfile,
      ...body,
      id: user.id, // Prevent ID change
      email: user.email, // Prevent email change
      updatedAt: new Date().toISOString()
    };

    await kv.set(`user_profile:${user.id}`, updatedProfile);

    return c.json({ 
      success: true, 
      message: 'Profile updated successfully',
      data: updatedProfile
    });
  } catch (error) {
    console.error('Error updating profile:', error);
    return c.json({ 
      success: false, 
      error: error?.message || 'Failed to update profile' 
    }, 500);
  }
});

// Admin: Invite new user (creates user and stores invitation)
authApp.post("/invite", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    
    if (!accessToken) {
      return c.json({ 
        success: false, 
        error: 'Access token is required' 
      }, 401);
    }

    // Verify requester is admin/management
    const { data: { user }, error: userError } = await supabase.auth.getUser(accessToken);

    if (userError || !user) {
      return c.json({ 
        success: false, 
        error: 'Unauthorized' 
      }, 401);
    }

    const adminProfile = await kv.get(`user_profile:${user.id}`);
    if (!adminProfile || adminProfile.userType !== 'management') {
      return c.json({ 
        success: false, 
        error: 'Only administrators can invite users' 
      }, 403);
    }

    const { email, userType = 'client', name } = await c.req.json();
    
    if (!email) {
      return c.json({ 
        success: false, 
        error: 'Email is required' 
      }, 400);
    }

    // Generate a temporary password
    const tempPassword = `${Math.random().toString(36).slice(-8)}${Date.now().toString().slice(-4)}`;

    // Create user in Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email: email,
      password: tempPassword,
      email_confirm: false, // Require email confirmation for invites
      user_metadata: { 
        name: name || email.split('@')[0],
        userType: userType,
        invitedBy: adminProfile.email,
        invitedAt: new Date().toISOString()
      }
    });

    if (authError) {
      console.error('Error creating invited user:', authError);
      return c.json({ 
        success: false, 
        error: authError.message || 'Failed to invite user' 
      }, 400);
    }

    // Create user profile
    const userProfile = {
      id: authData.user.id,
      email: email,
      name: name || email.split('@')[0],
      userType: userType,
      companyName: '',
      role: userType === 'client' ? 'Client' : userType === 'team' ? 'Team Member' : 'Admin',
      status: 'invited',
      invitedBy: adminProfile.email,
      invitedAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      lastLoginAt: null
    };

    await kv.set(`user_profile:${authData.user.id}`, userProfile);

    // Add to users list
    const allUsers = await kv.get('all_users') || [];
    allUsers.push({
      id: authData.user.id,
      email: email,
      name: userProfile.name,
      userType: userType
    });
    await kv.set('all_users', allUsers);

    // Store invitation for tracking
    const invitations = await kv.get('user_invitations') || [];
    invitations.push({
      id: authData.user.id,
      email: email,
      name: userProfile.name,
      userType: userType,
      invitedBy: adminProfile.email,
      invitedAt: new Date().toISOString(),
      status: 'pending'
    });
    await kv.set('user_invitations', invitations);

    console.log(`✓ User invited: ${email} (${userType}) by ${adminProfile.email}`);

    // TODO: Send invitation email via Resend
    // For now, return the temp password for development
    return c.json({ 
      success: true, 
      message: 'User invited successfully',
      data: {
        user: authData.user,
        profile: userProfile,
        tempPassword: tempPassword // In production, this should be sent via email only
      }
    });
  } catch (error) {
    console.error('Error inviting user:', error);
    return c.json({ 
      success: false, 
      error: error?.message || 'Failed to invite user' 
    }, 500);
  }
});

// Get all users (admin only)
authApp.get("/users", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    
    if (!accessToken) {
      return c.json({ 
        success: false, 
        error: 'Access token is required' 
      }, 401);
    }

    // Verify requester is admin/management
    const { data: { user }, error: userError } = await supabase.auth.getUser(accessToken);

    if (userError || !user) {
      return c.json({ 
        success: false, 
        error: 'Unauthorized' 
      }, 401);
    }

    const adminProfile = await kv.get(`user_profile:${user.id}`);
    if (!adminProfile || adminProfile.userType !== 'management') {
      return c.json({ 
        success: false, 
        error: 'Only administrators can view all users' 
      }, 403);
    }

    // Get all user profiles
    const allUsers = await kv.get('all_users') || [];
    
    // Fetch full profiles for each user
    const userProfiles = [];
    for (const userRef of allUsers) {
      const profile = await kv.get(`user_profile:${userRef.id}`);
      if (profile) {
        userProfiles.push(profile);
      }
    }

    return c.json({ 
      success: true, 
      data: userProfiles
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    return c.json({ 
      success: false, 
      error: error?.message || 'Failed to fetch users' 
    }, 500);
  }
});

// Sign out endpoint
authApp.post("/signout", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    
    if (!accessToken) {
      return c.json({ 
        success: false, 
        error: 'Access token is required' 
      }, 401);
    }

    // Sign out from Supabase Auth
    const { error } = await supabase.auth.admin.signOut(accessToken);

    if (error) {
      console.error('Sign out error:', error);
      // Continue anyway as the token may already be invalid
    }

    console.log('✓ User signed out');

    return c.json({ 
      success: true, 
      message: 'Signed out successfully'
    });
  } catch (error) {
    console.error('Error signing out:', error);
    return c.json({ 
      success: false, 
      error: error?.message || 'Failed to sign out' 
    }, 500);
  }
});

export default authApp;
