import '../styles/globals.css'
import type { AppProps } from 'next/app'
import React, { FC, useEffect } from 'react'
import { Header } from '../components';

// @ts-ignore
const Noop: FC = ({ children }) => <>{children}</>

function MarketApp({ Component, pageProps }: AppProps) {
  const Layout = (Component as any).Layout || Noop

  useEffect(() => {
    document.body.classList?.remove('loading')
  }, [])

  return (
      <>
        <Header />
        <Layout pageProps={pageProps}>
          <Component {...pageProps} />
        </Layout>
      </>
  )
}

export default MarketApp
