import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
// @ts-ignore
const supabase = createClient(supabaseUrl, supabaseKey);

export async function POST(request) {
  try {
    const body = await request.json();

    const { data, error } = await supabase.from("likes").insert([
      {
        giver_id: body.giver_id,
        taker_id: body.taker_id,
        latitude: body.latitude,
        longitude: body.longitude,
        tokens: body.tokens,
        density: body.density,
      },
    ]);

    if (error) {
      throw new Error(`Error inserting data: ${error.message}`);
    }

    return new Response(JSON.stringify(data), {
      status: 201,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
}
