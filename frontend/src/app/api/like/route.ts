import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
// @ts-ignore
const supabase = createClient(supabaseUrl, supabaseKey);

// @ts-ignore
export async function POST(req) {
  try {
    const { user_id, latitude, longitude } = await req.json();
    
    console.log("nearbyUsers1");
    // 近隣のユーザーを取得
    const nearbyResponse = await fetch("http://localhost:3000/api/getNearbyLocations", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId: user_id, latitude, longitude }),
    });
    if (!nearbyResponse.ok) {
      throw new Error('Error fetching nearby users');
    }
    console.log("nearbyUsers2");
    
    const nearbyUsers = await nearbyResponse.json();
    
    // 取得したユーザーに対していいねを送る
    for (const user of nearbyUsers) {
      if (user.user_id !== user_id) {
        const likeData = {
          giver_id: user_id,
          taker_id: user.user_id,
          latitude,
          longitude,
          tokens: 1,
          density: 1,
        };
        
        const response = await fetch("http://localhost:3000/api/insertlike", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(likeData),
        });
        
        if (!response.ok) {
          console.error("Error sending like: ", response.statusText);
          continue;
        }
        
        const responseData = await response.json();
        console.log("Like sent:", responseData);
      }
    }
    
    return new Response(JSON.stringify({ message: "Likes sent successfully" }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    // @ts-ignore
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}
