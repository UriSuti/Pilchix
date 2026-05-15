import { createClient } from '@supabase/supabase-js';

const supabaseUrl = "https://ezbdtbgjkfgelrbfzjid.supabase.co";
const supabaseKey = "sb_publishable_Dmw63ySW2jp_QEvclXwkIg_8p4KRCTN";

export const supabase = createClient(supabaseUrl, supabaseKey);