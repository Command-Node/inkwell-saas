const express = require('express');
const cors = require('cors');
const multer = require('multer');
const helmet = require('helmet');
const morgan = require('morgan');
const path = require('path');
const fs = require('fs');
require('dotenv').config();
// Use environment variable for Stripe secret key
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const { supabase } = require('./supabase');

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(helmet());
app.use(morgan('combined'));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadsDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 100 * 1024 * 1024, // 100MB limit
  },
  fileFilter: (req, file, cb) => {
    // Accept audio, text, and document files
    const allowedTypes = [
      'audio/mpeg', 'audio/wav', 'audio/mp4', 'audio/x-m4a',
      'text/plain', 'application/pdf',
      'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];
    
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type'), false);
    }
  }
});

// Mock data for projects
let projects = [
  {
    id: 1,
    title: "The Art of AI Writing",
    status: "In Progress",
    progress: 67,
    type: "book"
  },
  {
    id: 2,
    title: "Marketing Mastery Guide",
    status: "Completed",
    progress: 100,
    type: "book",
    published: "Amazon KDP"
  }
];

// Make projects available globally for mock data fallback
global.mockProjects = projects;

// Routes

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'InkFlow API is running',
    timestamp: new Date().toISOString()
  });
});

// Test database schema
app.get('/api/test-schema', async (req, res) => {
  try {
    if (!supabase) {
      return res.json({ error: 'Supabase not configured' });
    }

    // Test users table
    const { data: users, error: usersError } = await supabase
      .from('users')
      .select('*')
      .limit(1);

    // Test projects table
    const { data: projects, error: projectsError } = await supabase
      .from('projects')
      .select('*')
      .limit(1);

    // Test creating a simple project
    const testProject = {
      title: 'Test Project',
      status: 'draft',
      type: 'book',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    const { data: createdProject, error: createError } = await supabase
      .from('projects')
      .insert([testProject])
      .select()
      .single();

    res.json({
      users: {
        data: users,
        error: usersError
      },
      projects: {
        data: projects,
        error: projectsError
      },
      testCreate: {
        data: createdProject,
        error: createError
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get user dashboard data
app.get('/api/dashboard', async (req, res) => {
  try {
    if (!supabase) {
      // Return mock data if Supabase is not configured
      return res.json({
        projects: global.mockProjects,
        stats: {
          totalBooks: global.mockProjects.length,
          completedBooks: global.mockProjects.filter(p => p.status === 'Completed').length,
          inProgressBooks: global.mockProjects.filter(p => p.status === 'In Progress').length,
          totalUsers: 0
        }
      });
    }

    // Get user ID from request (in production, this would come from auth token)
    const userId = req.query.userId || req.headers['user-id'] || null;

    // Get user's projects from Supabase
    let projectsQuery = supabase
      .from('projects')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (userId) {
      projectsQuery = projectsQuery.eq('user_id', userId);
    }
    
    const { data: projects, error: projectsError } = await projectsQuery;

    if (projectsError) {
      console.error('Error fetching projects:', projectsError);
      return res.status(500).json({ error: 'Failed to fetch projects' });
    }

    // Get user info (only if userId is provided)
    let user = null;
    if (userId) {
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();

      if (userError && userError.code !== 'PGRST116') { // PGRST116 = not found
        console.error('Error fetching user:', userError);
      } else {
        user = userData;
      }
    }

    // Get total user stats (for admin purposes)
    const { data: allUsers, error: usersError } = await supabase
      .from('users')
      .select('id');

    if (usersError) {
      console.error('Error fetching users:', usersError);
    }

    // Transform projects to match frontend expectations
    const transformedProjects = (projects || []).map(project => ({
      id: project.id,
      title: project.title,
      status: project.status === 'completed' ? 'Completed' : 
              project.status === 'processing' ? 'In Progress' : 
              project.status === 'draft' ? 'Draft' : 'In Progress',
      progress: project.status === 'completed' ? 100 : 
                project.status === 'processing' ? 67 : 
                project.status === 'draft' ? 0 : 0,
      type: project.type || 'book',
      published: project.status === 'completed' ? 'Ready for Publishing' : undefined,
      createdAt: project.created_at,
      updatedAt: project.updated_at
    }));

    const stats = {
      totalBooks: transformedProjects.length,
      completedBooks: transformedProjects.filter(p => p.status === 'Completed').length,
      inProgressBooks: transformedProjects.filter(p => p.status === 'In Progress').length,
      totalUsers: allUsers?.length || 0
    };

    res.json({
      projects: transformedProjects,
      stats
    });
  } catch (error) {
    console.error('Dashboard error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get projects
app.get('/api/projects', async (req, res) => {
  try {
    if (!supabase) {
      // Return mock data if Supabase is not configured
      return res.json(global.mockProjects);
    }

    // Get user ID from request
    const userId = req.query.userId || req.headers['user-id'] || null;

    let projectsQuery = supabase
      .from('projects')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (userId) {
      projectsQuery = projectsQuery.eq('user_id', userId);
    }
    
    const { data: projects, error } = await projectsQuery;

    if (error) {
      console.error('Error fetching projects:', error);
      return res.status(500).json({ error: 'Failed to fetch projects' });
    }

    // Transform projects to match frontend expectations
    const transformedProjects = (projects || []).map(project => ({
      id: project.id,
      title: project.title,
      status: project.status === 'completed' ? 'Completed' : 
              project.status === 'processing' ? 'In Progress' : 
              project.status === 'draft' ? 'Draft' : 'In Progress',
      progress: project.status === 'completed' ? 100 : 
                project.status === 'processing' ? 67 : 
                project.status === 'draft' ? 0 : 0,
      type: project.type || 'book',
      writingStyle: project.writing_style,
      createdAt: project.created_at,
      updatedAt: project.updated_at
    }));

    res.json(transformedProjects);
  } catch (error) {
    console.error('Projects error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create new project
app.post('/api/projects', async (req, res) => {
  try {
    const { title, type, writingStyle } = req.body;
    
    if (!supabase) {
      // Create mock project if Supabase is not configured
      const newProject = {
        id: global.mockProjects.length + 1,
        title: title || 'Untitled Project',
        status: 'In Progress',
        progress: 0,
        type: type || 'book',
        writingStyle: writingStyle || 'Professional',
        createdAt: new Date().toISOString()
      };
      
      global.mockProjects.push(newProject);
      return res.status(201).json(newProject);
    }

    // Get user ID from request
    const userId = req.query.userId || req.headers['user-id'] || null;
    
    const newProject = {
      title: title || 'Untitled Project',
      status: 'draft',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    // Only add optional fields if they exist in your schema
    if (writingStyle) {
      newProject.writing_style = writingStyle;
    }
    
    // Only add user_id if provided (using the actual user ID from the database)
    if (userId) {
      newProject.user_id = userId;
    }
    
    const { data, error } = await supabase
      .from('projects')
      .insert([newProject])
      .select()
      .single();

    if (error) {
      console.error('Error creating project:', error);
      return res.status(500).json({ error: 'Failed to create project' });
    }
    
    // Transform the response to match frontend expectations
    const transformedProject = {
      id: data.id,
      title: data.title,
      status: 'Draft',
      progress: 0,
      type: data.type || 'book', // Default to 'book' if type doesn't exist
      writingStyle: data.writing_style,
      createdAt: data.created_at,
      updatedAt: data.updated_at
    };
    
    res.status(201).json(transformedProject);
  } catch (error) {
    console.error('Create project error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// User management endpoints
app.post('/api/users', async (req, res) => {
  try {
    const { email, plan_id } = req.body;
    
    if (!supabase) {
      return res.status(500).json({ error: 'Supabase not configured' });
    }

    const newUser = {
      email: email,
      subscription_status: 'inactive',
      subscription_plan: plan_id || 'starter',
      usage_books: 0,
      usage_revisions: 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    const { data, error } = await supabase
      .from('users')
      .insert([newUser])
      .select()
      .single();

    if (error) {
      console.error('Error creating user:', error);
      return res.status(500).json({ error: 'Failed to create user' });
    }
    
    res.status(201).json(data);
  } catch (error) {
    console.error('Create user error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/users/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!supabase) {
      return res.status(500).json({ error: 'Supabase not configured' });
    }

    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching user:', error);
      return res.status(500).json({ error: 'Failed to fetch user' });
    }

    if (!data) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.json(data);
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update project
app.put('/api/projects/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!supabase) {
      // Update mock project if Supabase is not configured
      const project = global.mockProjects.find(p => p.id === parseInt(id));
      
      if (!project) {
        return res.status(404).json({ error: 'Project not found' });
      }
      
      Object.assign(project, req.body);
      return res.json(project);
    }
    
    // Transform frontend status to database status
    const updates = { ...req.body };
    if (updates.status === 'Completed') updates.status = 'completed';
    if (updates.status === 'In Progress') updates.status = 'processing';
    if (updates.status === 'Draft') updates.status = 'draft';
    
    updates.updated_at = new Date().toISOString();
    
    const { data, error } = await supabase
      .from('projects')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating project:', error);
      return res.status(500).json({ error: 'Failed to update project' });
    }

    if (!data) {
      return res.status(404).json({ error: 'Project not found' });
    }
    
    // Transform response to match frontend expectations
    const transformedProject = {
      id: data.id,
      title: data.title,
      status: data.status === 'completed' ? 'Completed' : 
              data.status === 'processing' ? 'In Progress' : 
              data.status === 'draft' ? 'Draft' : 'In Progress',
      progress: data.status === 'completed' ? 100 : 
                data.status === 'processing' ? 67 : 
                data.status === 'draft' ? 0 : 0,
      type: data.type || 'book',
      writingStyle: data.writing_style,
      createdAt: data.created_at,
      updatedAt: data.updated_at
    };
    
    res.json(transformedProject);
  } catch (error) {
    console.error('Update project error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// File upload endpoint
app.post('/api/upload', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }
    
    const fileInfo = {
      originalName: req.file.originalname,
      filename: req.file.filename,
      size: req.file.size,
      mimetype: req.file.mimetype,
      uploadedAt: new Date().toISOString()
    };
    
    // Get user ID from request
    const userId = req.query.userId || req.headers['user-id'] || null;
    
    // Create or update project record in Supabase
    if (supabase) {
      try {
        const projectData = {
          title: req.body.title || req.file.originalname,
          status: 'processing',
          type: 'book',
          file_url: `/uploads/${req.file.filename}`,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };
        
        // Only add user_id if provided
        if (userId) {
          projectData.user_id = userId;
        }
        
        const { data: project, error } = await supabase
          .from('projects')
          .insert([projectData])
          .select()
          .single();
          
        if (error) {
          console.error('Error creating project record:', error);
        } else {
          console.log('Project record created:', project.id);
        }
      } catch (dbError) {
        console.error('Database error during upload:', dbError);
      }
    }
    
    // Simulate processing delay
    setTimeout(() => {
      console.log('File uploaded:', fileInfo);
    }, 1000);
    
    res.json({
      message: 'File uploaded successfully',
      file: fileInfo
    });
  } catch (error) {
    res.status(500).json({ error: 'Upload failed', details: error.message });
  }
});

// Start AI processing
app.post('/api/process', (req, res) => {
  const { projectId, writingStyle } = req.body;
  
  // Simulate AI processing
  res.json({
    message: 'AI processing started',
    projectId: projectId,
    writingStyle: writingStyle,
    status: 'processing'
  });
});

// Get processing status
app.get('/api/process/:projectId/status', (req, res) => {
  const { projectId } = req.params;
  
  // Mock processing status
  const progress = Math.floor(Math.random() * 100);
  
  res.json({
    projectId: projectId,
    progress: progress,
    status: progress >= 100 ? 'completed' : 'processing',
    steps: [
      { name: 'Transcribing audio', status: 'complete' },
      { name: 'Analyzing content structure', status: progress > 30 ? 'complete' : 'in-progress' },
      { name: 'Generating chapters', status: progress > 60 ? 'complete' : 'in-progress' },
      { name: 'Formatting book', status: progress > 90 ? 'complete' : 'pending' }
    ]
  });
});

// Stripe configuration
const STRIPE_PLANS = {
  starter: {
    name: 'Starter',
    price: 2000, // $20.00 in cents
    priceId: 'price_starter_monthly', // You'll need to create this in Stripe
    features: [
      '5 books per month',
      '3 revisions per book',
      '2 audiobooks',
      '2 AI outline credits'
    ]
  },
  professional: {
    name: 'Professional',
    price: 4900, // $49.00 in cents
    priceId: 'price_professional_monthly',
    features: [
      '15 books per month',
      '5 revisions per book',
      '7 audiobooks',
      '5 AI outline credits',
      'Marketplace access'
    ]
  },
  creator: {
    name: 'Creator',
    price: 7900, // $79.00 in cents
    priceId: 'price_creator_monthly',
    popular: true,
    features: [
      '30 books per month',
      '10 revisions per book',
      '15 audiobooks',
      '10 AI outline credits',
      'Advanced AI agents',
      'Priority support'
    ]
  },
  publisher: {
    name: 'Publisher',
    price: 19900, // $199.00 in cents
    priceId: 'price_publisher_monthly',
    features: [
      '80 books per month',
      '12 revisions per book',
      '40 audiobooks',
      'Unlimited credits',
      '8 team members',
      'White-label option'
    ]
  }
};

// Pricing plans
app.get('/api/pricing', (req, res) => {
  res.json({
    plans: Object.values(STRIPE_PLANS),
    publishableKey: process.env.STRIPE_PUBLISHABLE_KEY
  });
});

// Create Stripe checkout session
app.post('/api/create-checkout-session', async (req, res) => {
  try {
    const { planId } = req.body;
    const plan = STRIPE_PLANS[planId];
    
    if (!plan) {
      return res.status(400).json({ error: 'Invalid plan selected' });
    }

        // For testing, create a mock checkout session
    // In production, you would use real Stripe keys
    const mockSession = {
      id: `cs_test_${Date.now()}`,
      url: 'https://checkout.stripe.com/pay/cs_test_mock#fidkdX0dJdGVjaHRkNTdpY3p1YdE',
      status: 'open'
    };
    
    console.log('Created mock checkout session for plan:', plan.name);
    
    // In production, uncomment this:
    // const session = await stripe.checkout.sessions.create({
    //   payment_method_types: ['card'],
    //   line_items: [
    //     {
    //       price_data: {
    //         currency: 'usd',
    //         product_data: {
    //           name: `${plan.name} Plan`,
    //           description: `InkFlow ${plan.name} Plan - ${plan.features.join(', ')}`,
    //         },
    //         unit_amount: plan.price,
    //         recurring: {
    //           interval: 'month',
    //         },
    //       },
    //       quantity: 1,
    //     },
    //   ],
    //   mode: 'subscription',
    //   success_url: 'http://localhost:3000/success?session_id={CHECKOUT_SESSION_ID}',
    //   cancel_url: 'http://localhost:3000/cancel',
    //   metadata: {
    //     planId: planId,
    //     planName: plan.name
    //   }
    // });
    
    const session = mockSession;

    res.json({ sessionId: session.id });
  } catch (error) {
    console.error('Stripe checkout error:', error);
    console.error('Error details:', error.message);
    console.error('Error type:', error.type);
    res.status(500).json({ 
      error: 'Failed to create checkout session',
      details: error.message,
      type: error.type
    });
  }
});

// Stripe webhook for successful payments
app.post('/api/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET || 'whsec_test_secret';

  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the event
  switch (event.type) {
    case 'checkout.session.completed':
      const session = event.data.object;
      console.log('Payment successful for session:', session.id);
      console.log('Plan:', session.metadata.planName);
      // Here you would typically create a user account, etc.
      break;
    case 'customer.subscription.created':
      const subscription = event.data.object;
      console.log('Subscription created:', subscription.id);
      break;
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  res.json({ received: true });
});

// Error handling middleware
app.use((error, req, res, next) => {
  console.error(error.stack);
  res.status(500).json({ 
    error: 'Something went wrong!',
    message: error.message 
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 InkFlow Backend running on port ${PORT}`);
  console.log(`📁 Upload directory: ${uploadsDir}`);
  console.log(`🔗 Health check: http://localhost:${PORT}/api/health`);
}); 