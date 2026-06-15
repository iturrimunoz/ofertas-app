import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://xntqbrfafbwlkczkorpq.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhudHFicmZhZmJ3bGtjemtvcnBxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODEyMDQ1NzAsImV4cCI6MjA5Njc4MDU3MH0.OJ3Utx6U0HUDQkw0BpYpmBTPDqi1LZTqHRO4LM3cAlM'

export const supabase = createClient(supabaseUrl, supabaseKey)