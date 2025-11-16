import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://uzviszqevkddoszrxwen.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV6dmlzenFldmtkZG9zenJ4d2VuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA2NTU0OTAsImV4cCI6MjA3NjIzMTQ5MH0.2PJ8AyaV7fqDUbcEVF3z_fLGUI-1wBKHwuy9n9cWQoY';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);