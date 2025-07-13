const { createClient } = require('@supabase/supabase-js')

// Test Supabase connection
const supabaseUrl = 'https://fyfgsvuenljeiicpwtjg.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ5ZmdzdnVlbmxqZWlpY3B3dGpnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE5MjQzNDYsImV4cCI6MjA2NzUwMDM0Nn0.ouZlOWP0p62hyeQkmsbXV4COWwd9CjQo0ZlXP1GYYWo'

const supabase = createClient(supabaseUrl, supabaseKey)

async function testConnection() {
  try {
    console.log('Testing Supabase connection...')
    
    // Test basic connection
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .limit(1)
    
    if (error) {
      console.log('Error (expected if table doesn\'t exist yet):', error.message)
    } else {
      console.log('✅ Connection successful!')
      console.log('Data:', data)
    }
    
    // Test auth
    const { data: authData, error: authError } = await supabase.auth.getSession()
    console.log('Auth session:', authData)
    
  } catch (error) {
    console.error('Connection failed:', error)
  }
}

testConnection()