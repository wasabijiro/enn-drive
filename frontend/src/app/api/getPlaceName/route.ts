// app/api/examplePost.ts
// @ts-ignore
export async function POST(req) {
    try {
        // リクエストからボディを取得します（もしボディがある場合）
        const { lat, lon } = await req.json();

        // 外部APIにPOSTリクエストを送信します
        const response = await fetch(`https://us1.locationiq.com/v1/reverse?key=${process.env.LOCATIONLQ_KEY}&lat=${lat}&lon=${lon}&format=json`, {
            method: 'GET'
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        // レスポンスオブジェクトを返す
        return new Response(JSON.stringify({ neighbourhood: data.address.neighbourhood }), {
            status: 200,
            headers: {
                'Content-Type': 'application/json'
            }
        });
    } catch (error) {
        // @ts-ignore
        return new Response(JSON.stringify({ error: error.message }), {
            status: 500,
            headers: {
                'Content-Type': 'application/json'
            }
        });
    }
}
