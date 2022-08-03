## e-bookshelf
> 基于next.js构建的简易电子图书馆，支持图书搜索下载和在线阅读两个核心功能。电子书格式都是epub，均从阿里云盘下载得来。

![效果图](./web/public/preview.gif)

#### 本地部署方式
* 克隆仓库到本地后，在根目录下执行 `yarn install` 安装项目依赖
* 在本地创建一个可连接的Postgres数据库，并根据数据库实际配置信息修改项目根目录下的`.env.sample`文件内容
```dotenv
DBHOST=localhost
DBPORT=5432
DBNAME=ebookshelf
DBUSER=ebookshelf_db_username
DBPASSWD=ebookshelf_db_password
APIPORT=3001
```
* 将`.env.sample`重命名为`.env`
* 从阿里云盘上下载电子书（大概400多G，共50000本书)到项目子目录`extractor/source`下，并在根目录下执行 `yarn run extractor`，完成电子书元数据的提取（抽取完的数据在数据库中可见）
* 在项目根目录执行 `yarn run web` 和 `yarn run api` 分别启动前端和后端，访问`http://localhost:3000`即可使用电子图书馆
* 执行 `yarn run web:build && yarn run web:export` 可完成前端打包
