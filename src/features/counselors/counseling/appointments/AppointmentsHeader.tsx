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
        <>
            <div className="p-24 sm:p-32 w-full border-b-1 bg-background-paper">
                <div className="flex flex-col">
                    <motion.span
                        initial={{ x: -20 }}
                        animate={{ x: 0, transition: { delay: 0.2 } }}
                    >
                        <Typography className="text-20 md:text-24 font-extrabold tracking-tight leading-none">
                            My Appointments
                        </Typography>
                    </motion.span>
                    <motion.span
                        initial={{ y: -20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1, transition: { delay: 0.2 } }}
                    >
                        <Typography
                            component={motion.span}
                            className="text-14 font-medium ml-2"
                            color="text.secondary"
                        >
                        </Typography>
                    </motion.span>
                </div>
                <div className="flex flex-1 items-center mt-16 -mx-8">
                    <Box
                        // component={motion.div}
                        // initial={{ y: -20, opacity: 0 }}
                        // animate={{ y: 0, opacity: 1, transition: { delay: 0.2 } }}
                        className="flex flex-1 w-full sm:w-auto items-center px-16 mx-8 border-2 rounded-full"
                    >
                        <Search />
                        <Input
                            placeholder="Search counselors"
                            className="flex flex-1 px-16"
                            disableUnderline
                            fullWidth
                            // value={searchText}
                            inputProps={{
                                'aria-label': 'Search'
                            }}
                        // onChange={(ev: ChangeEvent<HTMLInputElement>) => dispatch(setSearchText(ev))}
                        />
                    </Box>
                    <Tooltip title={'Filter'}>
                        <IconButton
                            // onClick={() => setShowFilter(prevState => !prevState)}
                            >
                            <FilterAltOutlined className='size-32' />
                        </IconButton>
                    </Tooltip>
                </div>
            </div>
        </>
    );
}

export default AppointmentsHeader;
