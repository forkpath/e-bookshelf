import type { NextPage } from 'next'
import Head from 'next/head'
import { DefaultLayout } from '@components';
import { Box, Container } from '@mui/material';

const Faq: NextPage = () => {
    return (
        <>
            <Head>
                <title>常见问题</title>
            </Head>
            <Container maxWidth="sm">
                <Box sx={{bgColor: 'red', height: '100vh'}}></Box>
            </Container>
        </>
    )
}

// @ts-ignore
Faq.Layout = DefaultLayout

export default Faq
