## 基于MemFireCloud的电子图书馆开发指南（三）
### TL;DR
[上一篇教程](https://github.com/key7men/e-bookshelf/blob/class2/docs/class2.md)讲解了获取并使用MemFireCloud基于表结构生成的`CRUD`接口，同时演示了其云存储的基本使用方式。
到目前为止，应用数据、业务接口、界面设计均已准备完毕，本篇将介绍如何进行界面开发，并最终利用MemFireCloud提供的静态托管能力。

### 仓库地址
[https://github.com/key7men/e-bookshelf](https://github.com/key7men/e-bookshelf)

### 开发依赖
* next.js 核心开发框架
* mui 组件库
* react-reader epub在线阅读组件

### 核心组件开发
针对功能界面进行分析，判定需要开发的组件主要如图：
![功能拆分](http://static.langnal.com/ebook-shelf/component-layers.png?x-oss-process=k7m)

#### 业务接口代码
```typescript
import { createClient } from '@supabase/supabase-js'

export const url = 'your_memfire_application_url';
const key = 'your_memfire_application_anon_key';
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

```

#### 组件代码示例
> 以搜索组件和首页列表布局为样例，具体可执行代码请查看Github仓库

##### 搜索组件
```tsx
const Navbar: FC = () => {

    const router = useRouter();

    // 防抖
    const doSearch = debounce(async (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
        const {value} = event.target;
        const query = router.query;
        if (value === '') {
            delete query.search;
        } else {
            query.search = value;
        }
        await router.push({query, pathname: '/'});
    }, 200);

    return (
        <AppBar position='sticky' color='transparent'
                sx={{backgroundColor: 'white', borderBottom: '1px solid rgba(0, 0, 0, .12)', boxShadow: 'none'}}>
            <Container maxWidth='xl'>
                <Toolbar disableGutters>

                    {/* icon与应用名称，在小屏幕下隐藏 */}
                    <SvgIcon sx={{mr: 1}} viewBox="0 0 490 490">
                        <g>
                            <g>
                                <g>
                                    <path d='M415,0H75c-5.523,0-10,4.478-10,10v420c0,5.523,4.477,10,10,10h10v40c0,5.523,4.477,10,10,10h40c5.523,0,10-4.477,10-10
				v-40h200v40c0,5.523,4.477,10,10,10h40c5.523,0,10-4.477,10-10v-40h10c5.523,0,10-4.477,10-10V10C425,4.478,420.523,0,415,0z
				 M125,470h-20v-30h20V470z M235,420H85V315h150V420z M385,470h-20v-30h20V470z M405,420H255V315h150V420z M405,295H85v-60h320
				V295z M405,215H85v-10h320V215z M405,185H85v-60h320V185z M405,105H85V95h320V105z M405,75H85V20h320V75z' />
                                    <rect x='270' y='355' width='30' height='20' />
                                    <rect x='190' y='355' width='30' height='20' />
                                </g>
                            </g>
                        </g>
                    </SvgIcon>
                    <Typography
                        variant='h6'
                        noWrap
                        component='a'
                        href='/'
                        sx={{
                            mr: 2,
                            display: {xs: 'none', md: 'flex'},
                            fontWeight: 300,
                            letterSpacing: '.1rem',
                            color: 'black',
                            textDecoration: 'none',
                        }}
                    >
                        E-BookShelf
                    </Typography>

                    {/* 搜索框 */}
                    <Search sx={{flexGrow: 1}}>
                        <SearchIconWrapper>
                            <SearchIcon />
                        </SearchIconWrapper>
                        <StyledInputBase
                            placeholder='书籍名称关键字'
                            inputProps={{'aria-label': 'search'}}
                            onChange={(e) => doSearch(e)}
                        />
                    </Search>

                </Toolbar>
            </Container>
        </AppBar>
    );
};
```

##### 首页布局
```tsx
const Home: NextPage = ({}) => {

    const router = useRouter();

    const [dataList, setDataList] = useState<BookItem[]>([]);
    const [total, setTotal] = useState(0);
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState('');

    useEffect(() => {
        const params: ISearchParam = {
            page: 1,
            search: ''
        };


        if (router.query.page) {
            params.page = Number(router.query.page);
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

        queryBooks(params).then(res => {
            setDataList(res.data || []);
            setTotal(Math.ceil(Number(res.count) / 24));
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
    const downloadBook = (link: string) => {
        window.open(`${url}/storage/v1/object/public/books/${link}`, '_blank');
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
                                <CardMedia component='img' image={`${url}/storage/v1/object/public/covers/${item.cover_link}`} alt={item.title}
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
                                    downloadBook(item.link)
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
```

### 如何部署
由于我使用MemFireBase生成的接口来完成应用的全部功能，所以是不需要部署后端服务的。
但前端打包后的页面仍然需要找个服务器部署啊！好在，MemFireCloud一并提供了静态托管服务，可以直接将前端部署上去。

#### step1 前端页面本地打包
![静态打包](http://static.langnal.com/ebook-shelf/bundle-page.png?x-oss-process=k7m)

#### step2 压缩zip的技巧
**这里千万要注意，必须保证`index.html`在压缩根目录**  
**这里千万要注意，必须保证`index.html`在压缩根目录**  
**这里千万要注意，必须保证`index.html`在压缩根目录**  
笔者在这里**卡了1个小时才弄明白：压缩的zip文件必须能够直接解压得到index.html，不然MemFireCloud找不到入口**，说实话，我个人觉得这里不好理解，MemFireCloud的产品还有待改进。

我的压缩方式是这样的：右键框选所有我需要打包的内容，然后直接压缩
![压缩技巧](http://static.langnal.com/ebook-shelf/compress.png?x-oss-process=k7m)

#### step3 上传即是部署
上传压缩包后，会自动解压，解压完成后，即可得到访问地址
![上传](http://static.langnal.com/ebook-shelf/static-web.png?x-oss-process=k7m)

### 小结
整个电子图书馆的开发部署，我个人的开发体验就一个字儿：快。
当然这得益于MemFire提供的服务，整个开发过程，**不用安装数据库**，**不用学习ORM**，**不用写接口**，**不用买OSS**，**不用找服务器部署静态页面**。 省下来的时间都够我上王者了。

话又说回来，其实我很早就知道国外的开发者用`Google FireBase`一把梭了，奈何国内的开发者无法使用。现在流行的低代码平台、CloudBase、MemFireCloud、Apifox都值得去体验，去使用，只有这样才能让国内开发者的工具链更完善，毕竟中国人不骗中国人，中国人了解中国人。





