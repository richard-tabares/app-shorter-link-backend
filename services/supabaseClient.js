import { createClient } from "@supabase/supabase-js"
import dotenv from 'dotenv'

dotenv.config()

const supabaseDb = process.env.SUPABASE_DB
const supabaseApiKey = process.env.SUPABASE_API_KEY

export const supabase = createClient(supabaseDb,supabaseApiKey)