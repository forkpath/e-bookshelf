import { MouseEvent, useEffect } from 'react';
import type { NextPage } from 'next'
import Head from 'next/head'
import { DefaultLayout } from '@components';
import {
    Avatar,
    Box, Card, CardActionArea, CardContent, CardHeader, CardMedia, Divider,
    Grid,
    List,
    ListItemButton,
    ListItemIcon, ListItemText,
    Typography,
} from '@mui/material';
import {
    AccessTimeOutlined,
    TrendingUpOutlined,
    TrendingDownOutlined,
    WhatshotOutlined,
    BarChartOutlined,
    DeveloperModeOutlined,
    PsychologyOutlined,
    StorefrontOutlined,
    SupervisedUserCircleOutlined, AllInboxOutlined
} from '@mui/icons-material';
import { useState } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';

export interface DataSetItem {
    id: string;
    title: string;
    price: string;
    field: string;
    total: string;
    publishAt: string;
    category: string;
    provider: string;
    cover: string;
    desc: string;
}

interface ISearchParam {
    p?: string;
    q?: string;
    c?: string;
    o?: string;
}

export async function getStaticProps() {


    const res = await axios.get('http://localhost:8088/api/v1/dataset/all');

    const dataList: DataSetItem[] = res.data.code === 0 ? res.data.data : [];

    return {
        props: {
            dataList
        },
    };
}

const queryData = async (param: ISearchParam) => {
    await axios({
        method: 'get',
        url: 'http://localhost:8088/api/v1/dataset/all',
        params: param
    });
}

// @ts-ignore
const Home: NextPage = ({ dataList }) => {

    const router = useRouter();

    const [orderBy, setOrderBy] = useState('');
    const [category, setCategory] = useState('');
    const [provider, setProvider] = useState('');
    const [query, setQuery] = useState('');

    useEffect(() => {
        const params: ISearchParam = {};

        console.log(router.query.p)

        if (router.query.c) {
            params.c = String(router.query.c);
            setCategory(String(router.query.c));
        } else {
            setCategory('');
        }

        if (router.query.p) {
            params.p = String(router.query.p);
            setProvider(String(router.query.p));
        } else {
            setProvider('');
        }

        if (router.query.o) {
            params.o = String(router.query.o);
            setOrderBy(String(router.query.o));
        } else {
            setOrderBy('');
        }

        if (router.query.q) {
            params.q = String(router.query.q);
            setQuery(String(router.query.q));
        } else {
            setQuery('');
        }

        queryData(params);
    }, [router.query.p, router.query.q, router.query.o, router.query.c]);

    const orderOptions = [
        {
            name: '最热门',
            value: '',
            icon: <WhatshotOutlined />
        },
        {
            name: '最新发布',
            value: 'latest',
            icon: <AccessTimeOutlined />
        },
        {
            name: '价格从低到高',
            value: 'price-asc',
            icon: <TrendingUpOutlined />
        },
        {
            name: '价格从高到低',
            value: 'price-desc',
            icon: <TrendingDownOutlined />
        }
    ];

    const categories = [
        {
            name: '应用开发',
            value: 'appDev',
            icon: <DeveloperModeOutlined />
        },
        {
            name: '数据分析',
            value: 'dataAnalysis',
            icon: <BarChartOutlined />
        },
        {
            name: '机器学习',
            value: 'ml',
            icon: <PsychologyOutlined />
        }
    ];

    const providers = [
        {
            name: '第三方提供',
            value: 'thirdParty',
            icon: <StorefrontOutlined />
        },
        {
            name: '用户上传',
            value: 'userUpload',
            icon: <SupervisedUserCircleOutlined />
        }
    ];

    const tempList = [
        {
            id: '1',
            title: '五万本epub电子书',
            price: '9.9',
            field: 12,
            total: 39657,
            publishAt: '2012-12-12',
            category: 'appDev',
            provider: 'thirdParty',
            cover: 'https://picsum.photos/200/300',
            desc: '适用于开发一个电子书网站，电子书均来自于阿里云盘，已经完成数据抽取。'
        },
        {
            id: '2',
            title: '豆瓣电影数据库',
            price: '9.9',
            field: 49,
            total: 12291,
            publishAt: '2012-12-12',
            category: 'appDev',
            provider: 'thirdParty',
            cover: 'https://picsum.photos/200/300',
            desc: '适用于开发一个电影讨论社区，甚至复刻一个简单等IMDB应用。'
        },
        {
            id: '3',
            title: '全国高校名称及所在地',
            price: '1.9',
            field: 8,
            total: 8000,
            publishAt: '2012-12-12',
            category: 'appDev',
            provider: 'thirdParty',
            cover: 'https://picsum.photos/200/300',
            desc: '全国高校（本科及以上）名称及所在地，适合开发学校选择模块。'
        },
        {
            id: '4',
            title: '超市通用SKU',
            price: '9.9',
            field: 120,
            total: 8000,
            publishAt: '2012-12-12',
            category: 'appDev',
            provider: 'thirdParty',
            cover: 'https://picsum.photos/200/300',
            desc: '适用于开发超市货品管理系统，货品均包含对应图片实例。'
        },
        {
            id: '5',
            title: '全国省市地区街道信息',
            price: '9.9',
            field: 42,
            total: 39657,
            publishAt: '2012-12-12',
            category: 'appDev',
            provider: 'thirdParty',
            cover: 'https://picsum.photos/200/300',
            desc: '适用于开发收获地址选择模块。'
        },
        {
            id: '6',
            title: '五万本epub电子书',
            price: '9.9',
            field: 12,
            total: 39657,
            publishAt: '2012-12-12',
            category: 'appDev',
            provider: 'thirdParty',
            cover: 'https://picsum.photos/200/300',
            desc: '适用于开发一个电子书网站，电子书均来自于阿里云盘，已经完成数据抽取。'
        },
        {
            id: '7',
            title: '五万本epub电子书',
            price: '9.9',
            field: 12,
            total: 39657,
            publishAt: '2012-12-12',
            category: 'appDev',
            provider: 'thirdParty',
            cover: 'https://picsum.photos/200/300',
            desc: '适用于开发一个电子书网站，电子书均来自于阿里云盘，已经完成数据抽取。'
        },
        {
            id: '8',
            title: '五万本epub电子书',
            price: '9.9',
            field: 12,
            total: 39657,
            publishAt: '2012-12-12',
            category: 'appDev',
            provider: 'thirdParty',
            cover: 'https://picsum.photos/200/300',
            desc: '适用于开发一个电子书网站，电子书均来自于阿里云盘，已经完成数据抽取。'
        }
    ];

    // 热度 最近更新 价格从高到低 价格从低到高

    const handleCatItemClick = (event: MouseEvent<HTMLDivElement | MouseEvent<HTMLAnchorElement>>, target: string) => {
        const query = router.query;
        if (target === '') {
            delete query.c;
        } else {
            query.c = target;
        }
        router.push({query});
    }
    const handleProviderItemClick = (event: MouseEvent<HTMLDivElement | MouseEvent<HTMLAnchorElement>>, target: string) => {
        const query = router.query;
        if (target === '') {
            delete query.p;
        } else {
            query.p = target;
        }
        router.push({query});
    }
    const handleOrderItemClick = (event: MouseEvent<HTMLDivElement | MouseEvent<HTMLAnchorElement>>, target: string) => {
        const query = router.query;
        if (target === '') {
            delete query.o;
        } else {
            query.o = target;
        }
        router.push({query});
    }

    // 进入内页
    const goToDetail = (id: string) => {
        router.push(`/data/${id}`);
    }

    return (
        <>
            <Head>
                <title>首页</title>
            </Head>
            <Grid container>
                {/* 过滤方式 */}
                <Grid item sm={3} md={3} lg={2}
                      sx={{display: {xs: 'none', sm: 'flex'}, minWidth: '140px', justifyContent: 'end'}}>
                    <Box sx={{position: 'fixed', display: {xs: 'none', sm: 'block'}}}>
                        <Box sx={{p: 1, mt: 6, textAlign: 'right', color: 'rgba(0,0,0,.54)'}}>
                            <Typography variant='body1' sx={{px: 4, fontSize: '1rem', color: 'black', fontWeight: 400}}>类型选择</Typography>

                            <List component='nav' aria-label='main filters' className='side-bar-list'>
                                <ListItemButton
                                    sx={{textAlign: 'right'}}
                                    selected={category === ''}
                                    onClick={(event) => handleCatItemClick(event, '')}>
                                    <ListItemText primary='全部' />
                                    <ListItemIcon sx={{minWidth: 32, ml: 1}}>
                                        <AllInboxOutlined />
                                    </ListItemIcon>
                                </ListItemButton>

                                {categories.map((item, index) =>
                                    <ListItemButton
                                        sx={{textAlign: 'right'}}
                                        key={item.value}
                                        selected={category === item.value}
                                        onClick={(event) => handleCatItemClick(event, item.value)}>
                                        <ListItemText primary={item.name} />
                                        <ListItemIcon sx={{minWidth: 32, ml: 1}}>
                                            {item.icon}
                                        </ListItemIcon>
                                    </ListItemButton>
                                )}

                            </List>
                        </Box>

                        <Divider />

                        <Box sx={{p: 1, mt: 6, textAlign: 'right', color: 'rgba(0,0,0,.54)'}}>
                            <Typography variant='body1' sx={{px: 4, fontSize: '1rem', color: 'black', fontWeight: 400}}>数据来源</Typography>

                            <List component='nav' aria-label='main filters' className='side-bar-list'>
                                <ListItemButton
                                    sx={{textAlign: 'right'}}
                                    selected={provider === ''}
                                    onClick={(event) => handleProviderItemClick(event, '')}>
                                    <ListItemText primary='全部' />
                                    <ListItemIcon sx={{minWidth: 32, ml: 1}}>
                                        <AllInboxOutlined />
                                    </ListItemIcon>
                                </ListItemButton>

                                {providers.map((item, index) =>
                                    <ListItemButton
                                        sx={{textAlign: 'right'}}
                                        key={item.value}
                                        selected={provider === item.value}
                                        onClick={(event) => handleProviderItemClick(event, item.value)}>
                                        <ListItemText primary={item.name} />
                                        <ListItemIcon sx={{minWidth: 32, ml: 1}}>
                                            {item.icon}
                                        </ListItemIcon>
                                    </ListItemButton>
                                )}

                            </List>
                        </Box>
                    </Box>
                </Grid>

                {/* 数据列表 */}
                <Grid item container xs={12} sm={6} md={6} lg={8} sx={{p: 2}} spacing={4}>

                    {tempList.map((item, index: number) =>
                        <Grid item key={item.id} xs={12} sm={6} lg={4} xl={3}>
                            <Card sx={{display: 'flex'}} onClick={() => goToDetail(item.id)}>
                                <CardActionArea>
                                    <CardHeader
                                        avatar={
                                            <Avatar sx={{color: 'white', backgroundColor: 'black', fontSize: '16px'}}
                                                    aria-label={item.price}>
                                                {`¥${item.price}`}
                                            </Avatar>
                                        }
                                        title={item.title}
                                        subheader={`发布时间: ${item.publishAt}`}
                                    />
                                    <CardMedia component='img' height='140' image={item.cover} alt={item.title} />
                                    <CardContent>
                                        <Box sx={{display: 'flex', alignItems: 'center', justifyContent: 'space-around'}}>
                                            <Typography component='div' variant='body2' color='text.primary'>{item.field} 个字段</Typography>
                                            <Divider orientation='vertical' flexItem />
                                            <Typography component='div' variant='body2' color='text.primary'>{item.total} 条数据</Typography>
                                        </Box>
                                        <Divider sx={{my: 1}} />
                                        <Typography variant='body2' color='text.secondary'>{item.desc}</Typography>
                                    </CardContent>
                                </CardActionArea>
                            </Card>
                        </Grid>
                    )}
                </Grid>

                {/* 排序方式 */}
                <Grid item sm={3} md={3} lg={2}
                      sx={{display: {xs: 'none', sm: 'flex'}, minWidth: '140px'}}>
                    <Box sx={{position: 'fixed', display: {xs: 'none', sm: 'block'}}}>
                        <Box sx={{p: 1, mt: 6, color: 'rgba(0,0,0,.54)'}}>
                            <Typography sx={{px: 4, fontSize: '1rem', color: 'black', fontWeight: 400}}>排序方式</Typography>

                            <List component='nav' aria-label='main filters' className='side-bar-list'>

                                {orderOptions.map((item, index) =>
                                    <ListItemButton
                                        sx={{}}
                                        key={item.value}
                                        selected={orderBy === item.value}
                                        onClick={(event) => handleOrderItemClick(event, item.value)}>
                                        <ListItemIcon sx={{minWidth: 32}}>
                                            {item.icon}
                                        </ListItemIcon>
                                        <ListItemText primary={item.name} />
                                    </ListItemButton>
                                )}

                            </List>
                        </Box>
                    </Box>
                </Grid>
            </Grid>
        </>
    )
}

// @ts-ignore
Home.Layout = DefaultLayout

export default Home


