// app/api/getNearbyLocations/route.ts
import { createClient } from "@supabase/supabase-js";

const supabaseUrl:any = process.env.SUPABASE_URL;
const supabaseKey:any = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

export async function POST(req:any) {
  try {
    const { user_id, latitude, longitude } = await req.json();
    console.log("getNearbyLocations");
    const { data, error } = await supabase
    .rpc("get_nearby_user_locations", { _user_id: user_id, _latitude: latitude, _longitude: longitude });
    if (error) {
      throw new Error('Error fetching nearby locations');
    }
    
    return new Response(JSON.stringify(data), { status: 200 });
  } catch (error:any) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}

// curl -X POST 'http://localhost:3000/api/getNearbyLocations' \
//   -H 'Content-Type: application/json' \
//   -d '{"user_id": 2, "latitude": 35.664604, "longitude": 139.738182}'