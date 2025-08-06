const { createClient } = require('@supabase/supabase-js')

// Check if Supabase environment variables are set
const supabaseUrl = process.env.SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

let supabase = null

if (supabaseUrl && supabaseServiceKey) {
  try {
    supabase = createClient(supabaseUrl, supabaseServiceKey)
    console.log('✅ Supabase client initialized successfully')
  } catch (error) {
    console.error('❌ Error initializing Supabase client:', error.message)
  }
} else {
  console.log('⚠️  Supabase environment variables not set - using mock data')
}

module.exports = { supabase } 