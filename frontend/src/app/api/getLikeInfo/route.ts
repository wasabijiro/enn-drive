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
            .rpc("get_like_info_by_taker_id", { _taker_id: taker_id });
        if (error) {
            throw new Error('Error fetching latest like');
        }
        return new Response(JSON.stringify(data), { status: 200 });
    } catch (error) {
        // @ts-ignore
        return new Response(JSON.stringify({ error: error.message }), { status: 500 });
    }
}