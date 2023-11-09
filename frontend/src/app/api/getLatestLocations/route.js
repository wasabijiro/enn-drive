// src/app/api/getLatestLocations/route.js
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

export async function GET() {
    const { data, error } = await supabase
        .rpc('get_latest_user_locations');

    if (error) {
        console.error('Error fetching latest user locations: ', error);
        return new Response(JSON.stringify({ error: 'Error fetching latest user locations' }), {
            status: 500,
            headers: {
                'Content-Type': 'application/json',
            },
        });
    }

    return new Response(JSON.stringify(data), {
        status: 200,
        headers: {
            'Content-Type': 'application/json',
        },
    });
}
