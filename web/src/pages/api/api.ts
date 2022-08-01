import { createClient } from '@supabase/supabase-js'

const url = 'https://cbjkria5g6hdakke0no0.baseapi.memfiredb.com';
const key = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImV4cCI6MzE5NzI0NTk0NSwiaWF0IjoxNjU5MzI1OTQ1LCJpc3MiOiJzdXBhYmFzZSJ9.Y1T2eLYwkQqnXVRmRK4H9M5--dY6CF1ELfDjYkDnnX0'
const client = createClient(url, key);

(async () => {
    let {data, error} = await client
        .from('book')
        .select('*')
        .range(0,1)
        // Filters
        .ilike('title', '%2%')

    if (error) {
        console.error(error)
    } else {
        console.log(data)
    }
})();
