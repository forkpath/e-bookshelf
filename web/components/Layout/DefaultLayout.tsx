import React, { FC } from 'react';
import { Footer, Navbar } from '../index';

interface Props {
    children: React.ReactNode;
}

const DefaultLayout: FC<Props> = ({children}) => {
    return (
        <>
            <Navbar />
            <main style={{minHeight: 'calc(100vh - 122px)'}}>{children}</main>
            <Footer />
        </>
    )
}


export default DefaultLayout
