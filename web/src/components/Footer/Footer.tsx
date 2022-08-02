import { FC } from 'react';
import { Box, Divider, Typography } from '@mui/material';
import Link from 'next/link';

const Footer: FC = () => {
    return (
        <Box sx={{width:'100%' ,bottom:'0'}}>
            <Divider />
            <Box sx={{
                display: 'flex',
                flexWrap: 'wrap',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'darkgrey',
                p: 2
            }}>
                <Typography sx={{mr: 2, fontSize: {xs: '0.75rem', sm: '1rem'}}}>
                    Copyright
                    {`© ${new Date().getFullYear()} `}
                    <Link target='_blank' href='https://ipfs.cc/'>
                        <a style={{color: 'black'}}>key7men@gmail.com</a>
                    </Link>
                </Typography>
            </Box>
        </Box>
    )
}

export default Footer;
