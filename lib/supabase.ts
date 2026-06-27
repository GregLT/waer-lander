import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://uagrnylqcgqzkigvbljd.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVhZ3JueWxxY2dxemtpZ3ZibGpkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODI1NTU1NjUsImV4cCI6MjA5ODEzMTU2NX0.I5enEek9KfwCXtILspzTqa6KUJRkAaY_a4aXSzdRjBE'

export function getSupabase() {
  return createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
}
