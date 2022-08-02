import { ChangeEvent, useEffect } from 'react';
import type { NextPage } from 'next'
import Head from 'next/head'
import { DefaultLayout } from '@components';
import {
    Avatar, Box, Button, Card, CardActionArea, CardActions, CardContent, CardHeader, CardMedia, Divider, Grid, Pagination,
    Typography
} from '@mui/material';
import { AutoStoriesOutlined, DownloadForOfflineOutlined } from '@mui/icons-material';
import { useState } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';

interface BookItem {
    id: string;
    title: string;
    coverLink: string;
    date: string;
    publisher: string;
}

interface ISearchParam {
    page?: string;
    search?: string;
}

const queryData = async (param: ISearchParam) => {
    const res = await axios({
        method: 'get',
        url: '/api/v1/books',
        params: param
    });
    return {
        data: res.data[0],
        count: res.data[1]
    }
}

// @ts-ignore
const Home: NextPage = ({}) => {

    const router = useRouter();

    const [dataList, setDataList] = useState<BookItem[]>([]);
    const [total, setTotal] = useState(0);
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState('');

    useEffect(() => {
        const params: ISearchParam = {};


        if (router.query.page) {
            params.page = String(router.query.page);
            setPage(Number(router.query.page));
        } else {
            setPage(1);
        }

        if (router.query.search) {
            params.search = String(router.query.search);
            setSearch(String(router.query.search));
        } else {
            setSearch('');
        }

        queryData(params).then(res => {
            setDataList(res.data);
            setTotal(Math.ceil(res.count / 24));
        })
    }, [router.query.search, router.query.page]);

    // 进入内页
    const goToDetail = (id: string) => {
        router.push(`/book/${id}`);
    }

    // 翻页
    const handlePageChange = (e: ChangeEvent<unknown>, pageIndex: number) => {
        const query = router.query;
        query.page = String(pageIndex);
        router.push({query});
    }

    // 下载
    const downloadBook = (id: string) => {
        window.open(`/api/v1/download/${id}`, '_blank');
    }

    // 在线阅读
    const readBook = (id: string) => {
        router.push(`/book/${id}`);
    }

    return (
        <>
            <Head>
                <title>首页</title>
            </Head>
            <Grid container sx={{p: 2}} spacing={4}>
                {/* 数据列表 */}
                {dataList.map((item: BookItem, index: number) =>
                    <Grid item key={item.id} xs={12} sm={4} lg={3} xl={2}>
                        <Card sx={{boxShadow: '0 0 6px 1px rgba(0,0,0,.2)'}} >
                            <CardActionArea onClick={() => goToDetail(item.id)}>
                                <CardHeader
                                    avatar={<Avatar sx={{backgroundColor: '#333', fontSize: '0.8rem'}} aria-label='format'>epub</Avatar>} />
                                <CardMedia component='img' image={item.coverLink} alt={item.title}
                                           sx={{height: {xs: 320, sm: 240, lg: 320}}} />
                                <CardContent>
                                    <Typography variant='body2' color='text.primary' sx={{
                                        whiteSpace: 'nowrap',
                                        width: '100%',
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis'
                                    }}>{item.title}</Typography>
                                    <Divider sx={{my: 1}} />
                                    <Typography variant='body2' color='text.secondary' sx={{
                                        whiteSpace: 'nowrap',
                                        width: '100%',
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis'
                                    }}>出版单位: {item.publisher || '未知'}</Typography>
                                    <Typography variant='body2' color='text.secondary' sx={{
                                        whiteSpace: 'nowrap',
                                        width: '100%',
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis'
                                    }}>发布时间: {item.date || '未知'}</Typography>
                                </CardContent>
                            </CardActionArea>
                            <CardActions sx={{float: 'right'}}>
                                <Button aria-label='download' sx={{color: '#000', borderColor: '#000', ':hover': 'red'}}
                                        startIcon={<DownloadForOfflineOutlined />} onClick={(e) => {
                                    downloadBook(item.id)
                                }}>直接下载
                                </Button>
                                <Button aria-label='read online' sx={{color: '#000', borderColor: '#000'}}
                                        startIcon={<AutoStoriesOutlined />} onClick={(e) => {
                                    readBook(item.id)
                                }}>在线阅读
                                </Button>
                            </CardActions>
                        </Card>
                    </Grid>
                )}
            </Grid>
            <Box sx={{textAlign: 'center', my: 2, width: '100%', display: 'flex', justifyContent: 'center'}}>
                { total > 0 ? <Pagination count={total} page={page} shape='rounded' variant='outlined' onChange={handlePageChange} /> : null }
            </Box>
        </>
    )
}

// @ts-ignore
Home.Layout = DefaultLayout

export default Home


