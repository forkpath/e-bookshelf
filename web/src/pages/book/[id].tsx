import type { GetStaticPropsContext, NextPage } from 'next';
import Head from 'next/head';
import { ReactReader } from 'react-reader';
import { DefaultLayout } from '@components';
import {
    Container,
} from '@mui/material';
import axios from 'axios';
import { useCallback, useState } from 'react';


export async function getStaticProps(context: GetStaticPropsContext) {
    const res = await axios.get(`/api/v1/book/${context.params!.id}`);

    return {
        props: {
            title: res.data.title,
            link: res.data.link
        }
    }
}

export async function getStaticPaths() {

    const res = await axios.get(`/api/v1/books/id`);

    const paths = [];
    for (let i = 0; i < res.data.length; i++) {
        paths.push({params: res.data[i]})
    }

    return {
        paths,
        fallback: false
    }
}

// @ts-ignore
const BookDetail: NextPage = ({title, link}) => {

    const [location, setLocation] = useState('');

    const onLocationChanged = useCallback(
        (location: string) => setLocation(location),
        []
    );

return (
    <>
        <Head>
            <title>{title}</title>
        </Head>
        <Container maxWidth='lg' sx={{p: 4}}>
            <div style={{position: 'relative', height: '800px', width: '100%', boxShadow: '0 0 6px 1px rgba(0,0,0,.3)'}}>
                <ReactReader
                    location={location}
                    locationChanged={onLocationChanged}
                    url={`${link}`}
                />
            </div>
        </Container>
    </>
)
}

// @ts-ignore
BookDetail.Layout = DefaultLayout

export default BookDetail
