import {readFile} from "fs";

const fs = require('fs');
const path = require('path');

const shell = require('shelljs');
const JSZip = require('jszip');
const xml2js = require('xml2js');
const {v4: uuid} = require('uuid');
const {promisify} = require('util');

const xmlParserWithoutAttr = new xml2js.Parser({
    ignoreAttrs: true
});

const xmlParser = new xml2js.Parser({});


import {Column, createConnection, PrimaryColumn} from "typeorm";
import {Book} from './entity';

const writeFileAsync = promisify(fs.writeFile);
const readFileAsync = promisify(fs.readFile);

(async () => {

    // 建立数据库连接
    await createConnection(
        {
            name: "default",
            type: "postgres",
            host: "localhost",
            port: 5432,
            username: "spider_user",
            password: "spider_passwd",
            database: "spider",
            synchronize: true,
            logging: false,
            entities: [Book],
            migrations: [],
            subscribers: [],
        }
    )

    /**
     * 具体实现方式：
     * 构建一个扁平化的source目录，目录中均为epub后缀的文件
     * 从source目录下，找到一个epub文件，并将其mv到一个stage目录
     * 在stage目录中，以zip到方式解压该epub，并搜索到content.opf文件
     * 然后利用xml2js，解析content.opf，如果能够成功解析，并且能获得title/cover这两个关键信息，其中cover必须存在
     * 那么将图片重命名为时间戳（为了避免时间戳泄露数据创建信息，统一减去固定值)
     * 将图片成功移动到covers目录，并将原始的epub文件移入到books目录，同时将提取到的元数据信息写入数据库，如果这三个条件都满足，则进行下一个循环
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

            const book = new Book();
            book.id = id;
            book.title = title;
            book.author = author;
            book.publisher = publisher;
            book.link = link;
            book.date = date;
            book.language = language;
            book.coverLink = coverLink;
            await book.save();

            console.log(title, 'has been extract data successfully!');

            await shell.mv(targetFile, `${BOOKS_DIR}/${link}`);
        } catch (e) {
            console.log(e);
            await shell.mv(targetFile, FAILED_DIR);
        }

        i++;
    } // end while


})()



