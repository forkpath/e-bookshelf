import React, { FC } from 'react';
import { Navbar } from '../index';

interface Props {
    children: React.ReactNode;
}

const DefaultLayout: FC<Props> = ({children}) => {
    return (
        <>
            <Navbar />
            <main style={{minHeight: 'calc(100vh - 122px)'}}>{children}</main>
        </>
    )
}


export default DefaultLayout
