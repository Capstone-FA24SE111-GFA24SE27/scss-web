import { motion } from 'framer-motion';
import Typography from '@mui/material/Typography';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import { AppLoading, ContentLoading, FilterTabs, ListSkeleton, Pagination, SearchField, SortingToggle } from '@shared/components';
import { useAppSelector } from '@shared/store';
import StudentDemandsItem from './StudentDemandsItem';
import { useState, ChangeEvent } from 'react'
import { Box } from '@mui/material';
import { useGetCounselingDemandCounselorsFilterQuery } from './student-demands-api';
import { useNavigate } from 'react-router-dom';


function StudentDemandsContent() {
    const [page, setPage] = useState(1);

    const [searchTerm, setSearchTerm] = useState('');

    const [sortDirection, setSortDirection] = useState<'ASC' | 'DESC'>('DESC');

    const [tabValue, setTabValue] = useState(0);

    const handleSearch = (searchTerm: string) => {
        setSearchTerm(searchTerm);
    }

    const handleChangeTab = (event: React.SyntheticEvent, newValue: number) => {
        setTabValue(newValue);
    };

    const handlePageChange = (event: ChangeEvent<unknown>, value: number) => {
        setPage(value);
    }

    const handleSortChange = (newSortDirection: 'ASC' | 'DESC') => {
        setSortDirection(newSortDirection);
    };

    const statusTabs = [
        { label: 'All', value: '' },
        { label: 'Processing', value: 'PROCESSING' },
        // { label: 'Waiting', value: 'WAITING' },
        { label: 'Done', value: 'DONE' },
    ];

    const { data, isLoading } = useGetCounselingDemandCounselorsFilterQuery({
        keyword: searchTerm,
        status: statusTabs[tabValue]?.value,
        sortDirection,
        page
    })
    const counselingDemands = data?.content?.data
    return (
        <div className='flex flex-col flex-1 gap-16 p-32 pb-16'>
            <div className='flex gap-16'>
                <SearchField
                    onSearch={handleSearch}
                    className=''
                />
                <SortingToggle
                    onSortChange={handleSortChange}
                    initialSort='DESC'
                />
            </div>
            <FilterTabs tabs={statusTabs} tabValue={tabValue} onChangeTab={handleChangeTab} />

            <Box>
                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1, transition: { delay: 0.2 } }}
                    className="flex flex-col flex-auto w-full max-h-full gap-16"
                >
                    <List className="flex flex-col w-full gap-16 p-0 m-0">
                        {
                            isLoading ? <ListSkeleton />
                                : !counselingDemands?.length
                                    ? <div className="flex items-center justify-center flex-1">
                                        <Typography
                                            color="text.secondary"
                                            variant="h5"
                                        >
                                            There are no demands!
                                        </Typography>
                                    </div>
                                    : counselingDemands.map(item =>
                                        <StudentDemandsItem
                                            key={item.id}
                                            demand={item} />
                                    )}
                    </List>
                </motion.div>
            </Box>

            <Pagination
                page={page}
                count={data?.content?.totalPages}
                handleChange={handlePageChange}
            />
        </div>

    );
}
export default StudentDemandsContent;
