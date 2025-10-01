import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://shkwqfggbcqtaedfxvwd.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNoa3dxZmdnYmNxdGFlZGZ4dndkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY2OTY1NTgsImV4cCI6MjA3MjI3MjU1OH0.UY6HBdd0J6p3DP9ihpgJ6XaNHcD_PmdReIIzO8xTcpE';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);