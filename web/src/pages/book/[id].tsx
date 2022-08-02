import type { GetStaticPropsContext, NextPage } from 'next';
import Head from 'next/head';
import { ReactReader } from 'react-reader';
import { DefaultLayout } from '@components';
import {
    Container,
} from '@mui/material';
import { useCallback, useState } from 'react';
import { queryBookLink, queryIds, url } from '../../api';


export async function getStaticProps(context: GetStaticPropsContext) {
    const book = await queryBookLink(context.params!.id);

    return {
        props: {
            title: book.title,
            link: book.link
        }
    }
}

export async function getStaticPaths() {

    const ids = await queryIds();

    const paths = [];
    for (let i = 0; i < ids.length; i++) {
        paths.push({params: ids[i]})
    }

    return {
        paths,
        fallback: false
    }
}

// @ts-ignore
const BookDetail: NextPage = ({title, link}) => {

    const [location, setLocation] = useState('2');

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
                    url={`${url}/storage/v1/object/public/books/${link}`}
                />
            </div>
        </Container>
    </>
)
}

// @ts-ignore
BookDetail.Layout = DefaultLayout

export default BookDetail
