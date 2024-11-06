import { motion } from 'framer-motion';
import Typography from '@mui/material/Typography';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import { AppLoading, ContentLoading, Pagination } from '@shared/components';
import { useAppSelector } from '@shared/store';
import StudentListItem from './StudentListItem';
import { useState, ChangeEvent } from 'react'
import { useGetStudentsFilterQuery } from '../counselor-students-api';
import { Box } from '@mui/material';


function StudentListContent() {
    const [page, setPage] = useState(1);
    const handlePageChange = (event: ChangeEvent<unknown>, value: number) => {
        setPage(value);
    };
    const { data } = useGetStudentsFilterQuery({
        page
    })
    const students = data?.data
    return (
        <div className='flex-1 flex flex-col gap-16 pb-16'>
            <Box>
                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1, transition: { delay: 0.2 } }}
                    className="flex flex-col flex-auto w-full max-h-full gap-16"
                >
                    <List className="w-full m-0 p-0">
                        {!students?.length
                            ? <div className="flex flex-1 items-center justify-center">
                                <Typography
                                    color="text.secondary"
                                    variant="h5"
                                >
                                    There are no students!
                                </Typography>
                            </div>
                            : students.map(item =>
                                <StudentListItem
                                    key={item.id}
                                    student={item} />
                            )}
                    </List>
                </motion.div>
            </Box>

            <Pagination
                page={page}
                count={data?.totalPages}
                handleChange={handlePageChange}
            />
        </div>

    );
}
export default StudentListContent;
