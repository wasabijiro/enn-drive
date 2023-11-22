// app/api/location/route.js
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
// @ts-ignore
const supabase = createClient(supabaseUrl, supabaseKey);

export async function GET() {
  const { data, error } = await supabase.from("locations").select("*");

  if (error) {
    console.error("Error fetching data: ", error);
    return new Response(JSON.stringify({ error: "Error fetching data" }), {
      status: 500,
    });
  }

  return new Response(JSON.stringify(data), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
  });
}
// @ts-ignore
export async function POST(request) {
  console.log("location post -start-");
  const { user_id, latitude, longitude } = await request.json();
  console.log({user_id});
  const { data, error } = await supabase
    .from("locations")
    .insert([{ user_id, latitude, longitude }]);

  if (error) {
    console.error("Error posting data: ", error);
    return new Response(JSON.stringify({ error: "Error posting data" }), {
      status: 500,
    });
  }

  console.log("location post -end-");

  return new Response(JSON.stringify(data), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
  });
}
