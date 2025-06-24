// src/lib/supabaseClient.js
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://sivcpdjtgysnryvfbcvw.supabase.co';

const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNpdmNwZGp0Z3lzbnJ5dmZiY3Z3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg1MTEyOTQsImV4cCI6MjA2NDA4NzI5NH0.P30L2h9NnsnSccm5NXWeIEMldZ6Tb54uA4zxoaSES1s';
    
export const supabase = createClient(
  supabaseUrl,
  supabaseAnonKey,
  {
    auth: {
      redirectTo: 'http://localhost:8080/reset-password',
      flowType: 'pkce'
    }
  }
);


