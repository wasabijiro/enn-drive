// app/api/getNearbyLocations/route.ts
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
// @ts-ignore
const supabase = createClient(supabaseUrl, supabaseKey);

// @ts-ignore
export async function POST(req) {
    try {
        const { taker_id } = await req.json();
        // console.log("getNearbyLocations");
        const { data, error } = await supabase
            .rpc("get_total_tokens_by_taker_id", { _taker_id: taker_id });
        if (error) {
            throw new Error('Error fetching sum token');
        }
        return new Response(JSON.stringify(data), { status: 200 });
    } catch (error) {
        // @ts-ignore
        return new Response(JSON.stringify({ error: error.message }), { status: 500 });
    }
}


// curl -X POST \
// -H "apikey: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndscmRvaGZ0aGR1ZmNmaHdqeHFhIiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTkzMDYxNjksImV4cCI6MjAxNDg4MjE2OX0.lPk25mvpCoEyaawiMpzx9mUeU1-WaJPYkLK6Lo8T60E" \
// -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndscmRvaGZ0aGR1ZmNmaHdqeHFhIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTY5OTMwNjE2OSwiZXhwIjoyMDE0ODgyMTY5fQ.LugIYid9GzoLHYAr6Ey9a98pNozKwmwVFWRnUUZUH9I" \
// -H "Content-Type: application/json" \
// -d '{"takerId": 2}' \
// "https://wlrdohfthdufcfhwjxqa.supabase.co/rpc/get_total_tokens_by_taker_id"