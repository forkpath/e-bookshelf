import { createClient } from '@supabase/supabase-js'

export const url = 'https://cbjkria5g6hdakke0no0.baseapi.memfiredb.com';
const key = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImV4cCI6MzE5NzI0NTk0NSwiaWF0IjoxNjU5MzI1OTQ1LCJpc3MiOiJzdXBhYmFzZSJ9.Y1T2eLYwkQqnXVRmRK4H9M5--dY6CF1ELfDjYkDnnX0'
const client = createClient(url, key);

export interface BookItem {
    id: string;
    title: string;
    link: string;
    cover_link: string;
    date: string;
    publisher: string;
}

export interface ISearchParam {
    page: number;
    search?: string;
}

export const queryBooks = async (param: ISearchParam) => {
    const {data, error, count} = await client.from('book')
        .select('*', {count: 'exact'})
        .range((param.page - 1) * 24, param.page * 23)
        .ilike('title', `%${param.search}%`)

    if (!error) {
        return {
            data,
            count
        }
    } else {
        return {
            data: [],
            count: 0
        }
    }

}

export const queryIds = async () => {
    const {data, error} = await client.from('book')
        .select('id')
    if (!error) {
        return data || [];
    } else {
        return []
    }
}

export const queryBookLink = async (id: string | string[] | undefined) => {
    const {data, error } = await client.from('book')
        .select('title, link')
        .eq('id', id)
        .single()

    if (!error) {
        return data
    } else {
        return {
            title: '',
            link: ''
        }
    }
}


