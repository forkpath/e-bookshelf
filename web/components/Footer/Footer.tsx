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
                    <Link target='_blank' href='https://memfiredb.com/'>
                        <a style={{color: 'black'}}>memfiredb.com{' '}</a>
                    </Link>
                    版权所有 ICP 证:{' '}
                    <Link target='_blank' href='https://beian.miit.gov.cn/'>
                        <a style={{color: 'black'}}>鄂ICP备17029935号-2</a>
                    </Link>
                </Typography>
            </Box>
        </Box>
    )
}

export default Footer;
