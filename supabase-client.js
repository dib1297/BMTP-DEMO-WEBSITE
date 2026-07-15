const SUPABASE_URL = 'https://vpeojsxpruhulzmzvbca.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZwZW9qc3hwcnVodWx6bXp2YmNhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODM3ODQ0OTksImV4cCI6MjA5OTM2MDQ5OX0.6mTX4iDjdVuAzis-rbxerkNMvUCYJZJ5Dtd4tvv_i-o';

// Initialize the Supabase client
window.supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
