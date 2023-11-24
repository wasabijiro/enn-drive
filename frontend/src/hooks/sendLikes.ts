// frontend/src/app/api/like/route.ts
import { createClient } from "@supabase/supabase-js";
import { NFT_TYPE } from "@/config";
import { getOwnedDriveObjectId } from "@/utils/getObject";
import { TransactionBlock } from "@mysten/sui.js/transactions";
import { moveCallSponsoredLike } from "@/libs/sponsoredZkLogin";
import { suiClient } from "@/config/sui";

const supabaseUrl:any = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey:any = process.env.NEXT_PUBLIC_SUPABASE_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

export default async function sendLikes(user_id:any, latitude:any, longitude:any, account:any) {

  console.log({ user_id });

  const obj_id = await getOwnedDriveObjectId(user_id, NFT_TYPE);
  const field: any = await suiClient.getObject({
    id: obj_id,
    options: {
      showContent: true,
      showType: true,
    },
  });

  console.log({ field });

  const nft_id = field.data?.content.fields.nft;

  console.log({ nft_id });

  console.log("nearbyUsers1");
  const nearbyResponse = await fetch(
    "http://localhost:3000/api/getNearbyLocations",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user_id, latitude, longitude }),
    }
  );
  if (!nearbyResponse.ok) {
    throw new Error("Error fetching nearby users");
  }
  console.log("nearbyUsers2");

  const nearbyUsers = await nearbyResponse.json();

  console.log({ nearbyResponse });

  // 取得したユーザーに対していいねを送る
  for (const user of nearbyUsers) {
    console.log("test-test",user);
    if (user.user_id !== user_id) {
      const obj_id = await getOwnedDriveObjectId(user.user_id, NFT_TYPE);
      const field: any = await suiClient.getObject({
        id: obj_id,
        options: {
          showContent: true,
          showType: true,
        },
      });

      console.log({ field });

      const nft_id = field.data?.content.fields.nft;

      console.log({ nft_id });

      const txb = new TransactionBlock();
      const result = await moveCallSponsoredLike(txb, account, nft_id);
      console.log(result.effects?.status.status);

      const likeData = {
        giver_id: user_id,
        taker_id: user.user_id,
        latitude,
        longitude,
      };

      const response = await fetch("http://localhost:3000/api/insertlike", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
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
}