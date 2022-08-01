## 基于MemFireCloud的电子图书馆开发指南（一）

### TL;DR

系列文章介绍了如何从epub格式文件中提取结构化数据，并存入在线数据库（MemFireDB），进而利用该数据库自带的接口生成能力，在无需后端编码的情况下，完成自用电子图书馆的开发。

### 最终效果

![最终效果](http://static.langnal.com/ebook-shelf/result.gif)
仓库地址: []()


### 数据元数据信息提取

明确epub本身是个**压缩文件**，解压后包含了一些基本的文件结构，如下图所示：

![epub文件结构](http://static.langnal.com/ebook-shelf/epub-structure.jpg?x-oss-process=style/k7m)

其中`OEBPS`文件夹下的`content.opf`文件是标准的`XML`文件，文件的根元素是**<package>**，该文件的`<metadata>`标签下的内容包含了许多书籍元数据信息，如下图所示：

```xml

<meta name= cover content="cover.jpg">书籍封面
    <dc:title>书名
        <dc:creator>制作人
            <dc:subject>主题关键词
                <dc:description>描述
                    <dc:publisher>出版商
                        <dc:contributor>贡献者
                            <dc:date>发布日期
                                <dc:type>类型
                                    <dc:format>格式
                                        <dc:identifier>唯一标识符
                                            <dc:source>来源
                                                <dc:language>语言
                                                    <dc:relation>关联
                                                        <dc:coverage>覆盖范围
                                                            <dc:rights>权责描述
```

既然每本epub格式的电子书都包含书籍元数据信息，那就可以写个程序提取这些数据信息存入到数据库中，后续写个接口来检索就行。

那问题来了：**哪来的那么多epub格式电子书啊？**
> 写个爬虫去爬？额，法律风险太大，一不小心就让你去局子里写《铁窗泪》，不值当。

![爬虫违法](http://static.langnal.com/ebook-shelf/illegal-crawler.png?x-oss-process=style/k7m)

> 从网盘上下载人家分享的书籍压缩包，然后写程序提取？我用的是阿里云盘（下载不限速），[书籍压缩包链接](https://www.aliyundrive.com/s/2LGsgQY6dHs)是从网上搜的。

![阿里云盘资料](http://static.langnal.com/ebook-shelf/alidrive.png?x-oss-process=style/k7m)

### 提取数据

```ts
    /**
 * 具体实现方式：
 * 构建一个扁平化的source目录，目录中均为epub后缀的文件
 * 从source目录下，找到一个epub文件，并将其mv到一个stage目录
 * 在stage目录中，以zip到方式解压该epub，并搜索到content.opf文件
 * 然后利用xml2js，解析content.opf，如果能够成功解析，并且能获得title/cover这两个关键信息，其中cover必须存在
 * 那么将图片重命名为时间戳（为了避免时间戳泄露数据创建信息，统一减去固定值)
 * 将图片成功移动到covers目录，并将原始的epub文件重命名后移入到books目录，同时将提取到的元数据信息写入数据库，如果这三个条件都满足，则进行下一个循环
 * 如果上述三个条件不满足，则回滚操作，将从covers目录移除图片，将epub文件从books目录移动到failed目录
 */

const SOURCE_DIR = path.resolve(__dirname, 'source');
const STAGE_DIR = path.resolve(__dirname, 'stage');
const COVERS_DIR = path.resolve(__dirname, 'covers');
const FAILED_DIR = path.resolve(__dirname, 'failed');
const BOOKS_DIR = path.resolve(__dirname, 'books');


// 定义需要处理到文件名
let targetFile;

// 读取目录下到文件名，并留存为列表
let files = fs.readdirSync(SOURCE_DIR);
files = files.filter(item => !(/(^|\/)\.[^\/\.]/g).test(item)); // 过滤隐藏文件

let i = 0;
// 遍历source下到文件，开始提取信息
while (i < files.length) {

    await shell.mv(path.join(SOURCE_DIR, files[i]), STAGE_DIR);
    console.log('mv stage');

    targetFile = path.join(STAGE_DIR, files[i]);

    // step 2: 利用jszip读取文件
    try {
        const data = await readFileAsync(targetFile);
        const zip = await JSZip.loadAsync(data);

        console.log('-------- start extracting ----------')
        const metaFileIndex = Object.keys(zip.files).findIndex((item => item.includes("content.opf")));
        const metaFileName = Object.keys(zip.files)[metaFileIndex];
        let coverLink = '';
        let cover = '';
        const content = await zip.file(metaFileName).async('text');
        let id = '';
        let title = '';
        let author = '';
        let publisher = '';
        let link = '';
        let date = '';
        let language = '';

        const metaResult = await xmlParserWithoutAttr.parseStringPromise(content)
        const metadata = metaResult.package.metadata[0];

        id = uuid();
        title = metadata['dc:title'] ? metadata['dc:title'][0] : '';
        author = metadata['dc:author'] ? metadata['dc:author'][0] : '';
        publisher = metadata['dc:publisher'] ? metadata['dc:publisher'][0] : '';
        link = `${uuid()}.epub`;
        date = metadata['dc:date'] ? metadata['dc:date'][0] : '';
        language = metadata['dc:language'] ? metadata['dc:language'][0] : '';


        const maniResult = await xmlParser.parseStringPromise(content);
        const maniMeta = maniResult.package.metadata[0];
        const manifest = maniResult.package.manifest[0].item;

        let coverId;
        for (let i = 0; i < maniMeta['meta'].length; i++) {
            const child = maniMeta['meta'][i];
            if (child.$.name === 'cover') {
                console.log(child);
                coverId = child.$.content;
                break;
            }
        }

        for (let item of manifest) {
            if (item.$.id === coverId) {
                cover = item.$.href;
                break;
            }
        }

        if (cover) {
            coverLink = uuid() + cover.substring(cover.lastIndexOf('.'));
            const coverIndex = Object.keys(zip.files).findIndex((item => item.includes(cover)));
            const coverName = Object.keys(zip.files)[coverIndex];
            const coverContent = await zip.file(coverName).async('uint8array');
            await writeFileAsync(path.join(COVERS_DIR, coverLink), coverContent);
        }

        // TODO: 写入到数据库

        console.log(title, 'has been extract data successfully!');

        await shell.mv(targetFile, `${BOOKS_DIR}/${link}`);
    } catch (e) {
        console.log(e);
        await shell.mv(targetFile, FAILED_DIR);
    }

    i++;
} // end while
```

### 写入数据库

> 上述代码已经可以提取书籍元数据， 而我我需要将每一次提取的数据元数据写入数据库，但我又不想在本地安装一个数据库，更不想去学一个ORM来琢磨如何连接并访问数据库。

恰好我找到了[MemFireCloud](https://cloud.memfiredb.com)这个**免费在线数据库**。它能基于我建的表，**直接生成数据库访问接口**
，而接口调用是直接使用它提供的SDK，简直不要太爽。

#### step1

直接微信扫码登录后（似乎扫码就完成了注册和登录），创建一个应用，取名叫`ebook`。  
应用创建完，直接进入应用，根据我需要的数据结构创建一张表

![书籍元数据表](http://static.langnal.com/ebook-shelf/ebook-table.png?x-oss-process=style/k7m)

#### step2

切换到API页面，按照要求安装`@supabase/supabase-js`，并复制初始化`supabaseClient`的代码到之前的代码中

![复制代码](http://static.langnal.com/ebook-shelf/sdk-init.png?x-oss-process=style/k7m)

替换上述代码的`// TODO: 写入到数据库`为下述代码

```ts
try {
    const {error} = await client.from('book').insert([
        {
            id,
            title,
            author,
            publisher,
            link,
            date,
            language,
            cover_link: coverLink
        }
    ])
    if (!error) {
        console.log(title, 'write to db failed!');
    } else {
        console.log(title, 'has been extract data successfully!');
    }
} catch (e) {
    console.log(title, 'write to db failed!');
}
```
#### step3
在仓库根目录下执行`yarn run extractor`即可从epub文件中提取元数据并最终写入刚才在线数据库中：
![写入数据](http://static.langnal.com/ebook-shelf/insert-result.png?x-oss-process=style/k7m)

### 小结
> 本文介绍了epub格式文件的组成部分，创建了一个可从XML中提取元数据并写入在线数据库的代码样例，在不学习任何第三方ORM，也无需掌握SQL，甚至连本地数据库都不创建的情况下更简单的完成了数据提取与写入的工作。更神奇的是，后续我会演示如何在无需开发后端接口的情况下，完成数据检索、分页等功能。 





















