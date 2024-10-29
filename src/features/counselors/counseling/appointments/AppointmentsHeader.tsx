import Input from '@mui/material/Input';
import Typography from '@mui/material/Typography';
import { motion } from 'framer-motion';
import Button from '@mui/material/Button';
import { Heading, NavLinkAdapter } from '@shared/components';
import Box from '@mui/material/Box';
import { CalendarMonth, Search } from '@mui/icons-material';
import { FilterAltOutlined } from '@mui/icons-material';
import { IconButton, Tooltip } from '@mui/material';
import { useState } from 'react';

/**
 * The contacts header.
 */
function AppointmentsHeader() {
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
        <div className='p-32 flex justify-between'>
            <Heading
                title='My Appointments'
                description='Counseling appointments that forwarded to the user'
            />
            <Button
                component={NavLinkAdapter}
                to="../calendar"
                variant='contained'
                color='secondary'
                startIcon={<CalendarMonth />}
            >
                View chedule
            </Button>
        </div>
    );
}

export default AppointmentsHeader;
