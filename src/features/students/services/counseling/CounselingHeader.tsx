import Input from '@mui/material/Input';
import Typography from '@mui/material/Typography';
import { motion } from 'framer-motion';
import Button from '@mui/material/Button';
import { NavLinkAdapter } from '@shared/components';
import Box from '@mui/material/Box';
import { Search } from '@mui/icons-material';
import { FilterAltOutlined } from '@mui/icons-material';
import { IconButton, Tooltip } from '@mui/material';
import { useState } from 'react';
import { Heading } from '@/shared/components';

/**
 * The contacts header.
 */
function CounselingHeader() {
    // const searchText = useAppSelector(selectSearchText);
    // const { data, isLoading } = useGetContactsListQuery();

    // const filteredData = useAppSelector(selectFilteredContactList(data));

    // useEffect(() => {
    //     return () => {
    //         dispatch(resetSearchText());
    //     };
    // }, []);

    // if (isLoading) {
    //     return null;
    // }
    return (
        <>
            <div className="px-24 py-16 sm:px-32 w-full bg-background-paper">
                <Heading title='Counseling Service' description='Providing personalized guidance and support for students.'/>
            </div>
        </>
    );
}

export default CounselingHeader;
