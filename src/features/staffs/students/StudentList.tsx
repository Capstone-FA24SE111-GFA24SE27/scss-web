import { Pagination, StudentListItem, useGetStudentsListQuery } from '@/shared/components';
import { Box, List, Typography } from '@mui/material';
import { motion } from 'framer-motion';
import React, { ChangeEvent, useState } from 'react'

type Props = {}

const StudentList = (props: Props) => {
    const [page, setPage] = useState(1);
    const handlePageChange = (event: ChangeEvent<unknown>, value: number) => {
        setPage(value);
    };
    const { data } = useGetStudentsListQuery({
        page
    })
    const students = data?.data
    return (
        <div className='flex flex-col flex-1 gap-16 pb-16'>
            <Box>
                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1, transition: { delay: 0.2 } }}
                    className="flex flex-col flex-auto w-full max-h-full gap-16"
                >
                    <List className="w-full p-0 m-0">
                        {!students?.length
                            ? <div className="flex items-center justify-center flex-1">
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

export default StudentList