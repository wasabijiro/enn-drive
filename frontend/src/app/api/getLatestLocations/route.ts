
// import { createClient } from "@supabase/supabase-js";

// const supabaseUrl = process.env.SUPABASE_URL;
// const supabaseKey = process.env.SUPABASE_KEY;
// // @ts-ignore
// const supabase = createClient(supabaseUrl, supabaseKey);

// export async function GET(req) {
//   try {
//     const { data, error } = await supabase.rpc("get_latest_user_locations");

//     if (error) {
//       throw new Error('Error fetching latest user locations');
//     }

//     return new Response(JSON.stringify(data), { status: 200 });
//   } catch (error) {
//     return new Response(JSON.stringify({ error: error.message }), { status: 500 });
//   }
// }
