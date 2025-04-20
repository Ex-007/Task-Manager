import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://laclwtyfydcegfoaxslz.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxhY2x3dHlmeWRjZWdmb2F4c2x6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDUxMzY1MDAsImV4cCI6MjA2MDcxMjUwMH0.ewvjnOTET5sWNis32QmqvzgBu7Hrgacs6nR5T0p1ydI';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);