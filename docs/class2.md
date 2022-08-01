## 基于MemFireCloud的电子图书馆开发指南（二）
### TL;DR
[上一篇教程](https://github.com/key7men/e-bookshelf/blob/class1/docs/class1.md)中已经实现了从epub文件中提取元数据并写入数据库，本篇内容会基于业务需求，利用MemFireCloud快速生成业务接口，并利用其云存储的能力，实现文件静态托管。

### 仓库地址
[https://github.com/key7men/e-bookshelf](https://github.com/key7men/e-bookshelf)

### 业务需求带来的接口需求

#### 功能设计
我想要的电子图书馆，就两个核心功能：
* 可以通过书名模糊搜索，并实时显示搜索结果
* 命中搜索目标后，可以直接阅读或离线下载

#### 界面设计
明确了功能点，对应的页面设计如下：

* 搜索列表页面

![首页](http://static.langnal.com/ebook-shelf/index-page.png?x-oss-process=style/k7m)

* 在线阅读页面

![阅读页面](http://static.langnal.com/ebook-shelf/read-page.png?x-oss-process=style/k7m)

#### 接口需求
通过上述界面的分析，我们仅仅需要实现以下接口，即可完成业务
* 一个可以分页返回搜索结果列表的接口
* 一个可以获得具体书籍地址的接口

### 接口实现
当我在上一篇文章中创建`ebook`应用及数据表的时候，MemFireCloud就已经为我创建的表生成了`CRUD`接口，切换到`API文档`这个界面，很容易就能找到过滤数据的接口调用方式。

![过滤接口](http://static.langnal.com/ebook-shelf/filter-api.png?x-oss-process=style/k7m)

那我们照葫芦画瓢，写一个书名中包含数字"2"，且只返回前两项结果的接口试试，创建一个名为`api.ts`的文件：
```typescript
import { createClient } from '@supabase/supabase-js'

const url = 'your_url';
const key = 'your_key';
const client = createClient(url, key);

(async () => {
    let {data, error} = await client
        .from('book')
        .select('*')
        .range(0,1)
        // Filters
        .ilike('title', '%%')

    if (error) {
        console.error(error)
    } else {
        console.log(data)
    }
})();
```
将上述ts文件编译成js后执行，`tsc api.ts && node api.js`，可以看到输出了如下结果：

![输出](http://static.langnal.com/ebook-shelf/output.png?x-oss-process=style/k7m)

### 云存储的使用
仔细观察结果，你会发现上述输出中，书籍文件路径`link`和封面文件路径`cover_link`都能拿到，但问题是这些文件不是在本地吗？（上一篇文章中已经提取了相应数据）？
无妨，可以将本地图书与封面文件悉数上传到MemFireCloud提供的云存储服务中。

#### Bucket创建
**bucket**本质就是带有权限的根目录。我们创建两个`bucket`并上传对应的文件，一个用于存储图书，叫作`books`；一个用于存储封面，叫作`covers`。
**同时设置这两个bucket公开化，以确保访问不受任何权限限制。**
![创建公开访问的bucket](http://static.langnal.com/ebook-shelf/cloud-storage.png?x-oss-process=style/k7m)

#### 尝试访问
切换到`covers`这个bucket，任意选择一个文件，复制链接，打开浏览器隐匿模式发现依然可以访问即可。

![封面文件预览](http://static.langnal.com/ebook-shelf/cover-image-preview.png?x-oss-process=style/k7m)


### 小结
本文介绍了如何利用MemFireCloud基于创建的表结构快速生成`CRUD`接口，同时尝试使用云存储来实现文件的持久化，最终能通过接口返回的文件路径拼接一个前置URL，来达到查看封面，下载文件的目的。
