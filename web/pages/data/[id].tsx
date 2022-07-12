import type { NextPage } from 'next'
import Head from 'next/head'
import { DefaultLayout } from '../../components';
import {
    Avatar, Box,
    Card,
    CardActions,
    CardContent,
    CardHeader,
    Collapse,
    Container,
    IconButton,
    IconButtonProps,
    Typography
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import DownloadIcon from '@mui/icons-material/Download';
import ShareIcon from '@mui/icons-material/Share';
import styled from '@emotion/styled';
import { useEffect, useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { useDemoData } from '@mui/x-data-grid-generator';
import axios from 'axios';
import { DataSetItem } from '../index';


export interface DataDetail {
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
    sampleData: string;
}

export async function getStaticPaths() {

    const res = await axios.get('http://localhost:8088/api/v1/dataset/all');

    const dataList: DataSetItem[] = res.data.code === 0 ? res.data.data : [];

    const paths = dataList.map(item => ({
        params: {id: item.id},
    }))

    return {
        paths,
        fallback: false
    }
}

// @ts-ignore
export async function getStaticProps({params}) {
    const res = await axios.get(`http://localhost:8088/api/v1/dataset/${params.id}`)

    let detail: DataDetail = res.data.code === 0 ? res.data.data : null

    const listRaw = detail.sampleData.substr(1, detail.sampleData.length - 3).split('},');

    const list: any[] = [];

    for (const i of listRaw) {
        list.push(JSON.parse(i + '}'));
    }


    return {
        props: {
            detail,
            list
        }
    }
}

interface ExpandMoreProps extends IconButtonProps {
    expand: boolean;
}

const ExpandMore = styled((props: ExpandMoreProps) => {
    const {expand, ...other} = props;
    return <IconButton {...other} />;
})(({theme, expand}) => ({
    transform: !expand ? 'rotate(0deg)' : 'rotate(180deg)',
    marginLeft: 'auto'
}));

// @ts-ignore
const DataInternal: NextPage = ({detail, list}) => {

    console.log(list);
    const keys = Object.keys(list[0]);

    const [col, setCol] = useState([]);

    const [expanded, setExpanded] = useState(false);

    const handleExpandClick = () => {
        setExpanded(!expanded);
    };

    useEffect(() => {
        const newCol = keys.map(key => ({
            field: key,
            width: 150,
        }));
        // @ts-ignore
        setCol(newCol);
    }, [])

    const {data} = useDemoData({
        dataSet: 'Commodity',
        rowLength: 100000,
        editable: true,
    });

    return (
        <>
            <Head>
                <title>{`数据集:[${detail.title}]`}</title>
            </Head>

            <Container maxWidth='lg' sx={{p: 4}}>
                <Card>
                    <CardHeader
                        avatar={<Avatar sx={{backgroundColor: 'black'}} aria-label={detail.price}>{`¥${detail.price}`}</Avatar>}
                        title={detail.title}
                        subheader={detail.publishAt}
                    />
                    <CardContent>
                        <Box sx={{height: 520, width: '100%'}}>
                            <DataGrid
                                rows={list}
                                columns={col}
                                loading={list.length === 0}
                                rowHeight={38}
                                disableSelectionOnClick
                            />
                        </Box>
                    </CardContent>
                    <CardActions disableSpacing>
                        <CardActions disableSpacing>
                            <a href='/assets/books.csv' download>
                                <IconButton aria-label='下载到本地'>
                                    <DownloadIcon />
                                </IconButton>
                            </a>
                            <IconButton aria-label='购买'>
                                <AddShoppingCartIcon />
                            </IconButton>
                            <ExpandMore
                                expand={expanded}
                                onClick={handleExpandClick}
                                aria-expanded={expanded}
                                aria-label='show more'
                            >
                                <ExpandMoreIcon />
                            </ExpandMore>
                        </CardActions>
                        <Collapse in={expanded} timeout='auto' unmountOnExit>
                            <CardContent>
                                <Typography paragraph>数据库地址: 129.119.129.114</Typography>
                                <Typography paragraph>数据库端口: 5433</Typography>
                                <Typography paragraph>数据库名称: Database</Typography>
                                <Typography paragraph>数据库账户: account</Typography>
                                <Typography paragraph>数据库密码: password</Typography>
                            </CardContent>
                        </Collapse>
                    </CardActions>
                </Card>
            </Container>
        </>
    )
}

// @ts-ignore
DataInternal.Layout = DefaultLayout

export default DataInternal
