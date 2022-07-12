import type { NextPage } from 'next'
import Head from 'next/head'
import { DefaultLayout } from '@components';
import { Box, Container } from '@mui/material';

const Tutorial: NextPage = () => {
    return (
        <>
            <Head>
                <title>教程</title>
            </Head>
            <Container maxWidth="sm">
                <Box sx={{bgColor: 'red', height: '100vh'}}></Box>
            </Container>
        </>
    )
}

// @ts-ignore
Tutorial.Layout = DefaultLayout

export default Tutorial
