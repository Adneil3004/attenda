import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://pfrblrqwxxjqvzfiftei.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBmcmJscnF3eHhqcXZ6ZmlmdGVpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU3MDc1MjAsImV4cCI6MjA5MTI4MzUyMH0.9WMYQP_V70JLINzR8LuDaCf_RtmlvWdFefR_UvrhkXI';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
