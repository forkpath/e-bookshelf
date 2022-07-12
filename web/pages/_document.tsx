import Document, { Head, Html, Main, NextScript } from 'next/document';

class MarketDocument extends Document {
    render() {
        return (
            <Html lang='zh-CN'>
                <Head>
                    <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap" />
                    <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons" />
                </Head>
                <body className='loading'>
                <Main />
                <NextScript />
                </body>
            </Html>
        )
    }
}

export default MarketDocument;
