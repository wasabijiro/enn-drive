// app/api/getNearbyLocations/route.ts
import { createClient } from "@supabase/supabase-js";

const supabaseUrl:any = process.env.SUPABASE_URL;
const supabaseKey:any  = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

export async function POST(req:any) {
    try {
        const { taker_id } = await req.json();
        console.log("getLikeInfo",{taker_id});
        const { data, error } = await supabase
            .rpc("get_like_info_by_taker_id", { _taker_id: taker_id });
        if (error) {
            throw new Error('Error fetching latest like');
        }
        return new Response(JSON.stringify(data), { status: 200 });
    } catch (error:any) {
        return new Response(JSON.stringify({ error: error.message }), { status: 500 });
    }
}