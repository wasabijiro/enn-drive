// src/app/api/like/route.js
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
// @ts-ignore
const supabase = createClient(supabaseUrl, supabaseKey);

// @ts-ignore
export async function POST(request) {
  const body = await request.json();
  const { user_id, latitude, longitude } = body;

  // get_nearby_user_locations関数を呼び出す
  const { data: nearbyUsers, error: nearbyUsersError } = await supabase.rpc(
    "get_nearby_user_locations",
    {
      _user_id: user_id,
      _latitude: latitude,
      _longitude: longitude,
    }
  );

  if (nearbyUsersError) {
    console.error("Error finding nearby users: ", nearbyUsersError);
    return new Response(
      JSON.stringify({ error: "Error finding nearby users" }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }

  // 取得したユーザーデータをコンソールに出力
  console.log("Nearby users:", nearbyUsers);

  // 取得したユーザーに対していいねを送る
  for (const user of nearbyUsers) {
    // 自分自身は除外
    if (user.user_id !== user_id) {
      // putlike APIを呼び出すためのデータを作成
      const likeData = {
        giver_id: user_id,
        taker_id: user.user_id,
        latitude: latitude,
        longitude: longitude,
        // tokensやdensityは適宜設定
        tokens: 1,
        density: 1,
      };

      // putlike APIにPOSTリクエストを送る
      const response = await fetch("/api/putlike", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(likeData),
      });

      // レスポンスの確認
      if (!response.ok) {
        console.error("Error sending like: ", response.statusText);
        continue; // エラーがあったら次のユーザーに進む
      }

      // レスポンスからデータを取得
      const responseData = await response.json();
      console.log("Like sent:", responseData);
    }
  }

  // 全てのいいねの送信が完了したことをレスポンスとして返す
  return new Response(JSON.stringify({ message: "Likes sent successfully" }), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
  });
}
