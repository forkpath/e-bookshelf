import NextHead from 'next/head'
import { FC } from "react";

const Header: FC = () => {
  return (
    <>
        <NextHead>
            <meta name='viewport' content='width=device-width, initial-scale=1' />
        </NextHead>
    </>
  )
}

export default Header
