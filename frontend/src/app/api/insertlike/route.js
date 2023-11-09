// src/app/api/putlike/route.js
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

export async function POST(request) {
    // リクエストからJSONボディを解析します
    const body = await request.json();

    // SupabaseにINSERTクエリを実行します
    const { data, error } = await supabase
        .from('likes')
        .insert([
            {
                giver_id: body.giver_id,
                taker_id: body.taker_id,
                latitude: body.latitude,
                longitude: body.longitude,
                tokens: body.tokens,
                density: body.density
            }
        ]);

    // エラーが発生した場合、エラーメッセージをレスポンスとして返します
    if (error) {
        console.error('Error inserting data: ', error);
        return new Response(JSON.stringify({ error: 'Error inserting data' }), {
            status: 500,
            headers: {
                'Content-Type': 'application/json',
            },
        });
    }

    // データの挿入に成功した場合、挿入されたデータをレスポンスとして返します
    return new Response(JSON.stringify(data), {
        status: 201,
        headers: {
            'Content-Type': 'application/json',
        },
    });
}
