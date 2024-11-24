import { motion } from 'framer-motion';
import Typography from '@mui/material/Typography';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import { AppLoading, ContentLoading, Pagination } from '@shared/components';
import { useAppSelector } from '@shared/store';
import CounselorListItem from './CounselorListItem';
import { useGetCounselorsAcademicQuery, useGetCounselorsNonAcademicQuery } from '../counseling-api';
import { selectCounselorType, selectFilter, selectSearchTerm } from './counselor-list-slice';
import { useState, ChangeEvent } from 'react'

function CounselorListContent() {
    const [page, setPage] = useState(1);

    const search = useAppSelector(selectSearchTerm)
    const filter = useAppSelector(selectFilter)
    const counselorType = useAppSelector(selectCounselorType)
    const { 
        availableFrom,
        availableTo,
        departmentId,
        majorId,
        specializationId,
        expertiseId
    } = filter
    console.log(availableFrom, availableTo)
    const { data: academicCounselors, isFetching: isFetchingAcademicCounselors } = useGetCounselorsAcademicQuery({
        search,
        page,
        availableFrom,
        availableTo,
        departmentId,
        majorId,
        specializationId,
    })
    const { data: nonAcademicCounselors, isFetching: isFetchingNonAcademicCounselors } = useGetCounselorsNonAcademicQuery({
        search,
        page,
        availableFrom,
        availableTo,
        expertiseId
    })

    const counselors = (counselorType === 'ACADEMIC' ? academicCounselors?.content?.data : nonAcademicCounselors?.content?.data) || []

    const pageCount = counselorType === 'ACADEMIC' ? academicCounselors?.content?.totalPages : nonAcademicCounselors?.content?.totalPages

    const handlePageChange = (event: ChangeEvent<unknown>, value: number) => {
        setPage(value);
    };

    if (isFetchingAcademicCounselors || isFetchingNonAcademicCounselors) {
        return <ContentLoading />;
    }


    return (
        <div className='flex-1'>
            <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1, transition: { delay: 0.2 } }}
                className="flex flex-col flex-auto w-full max-h-full gap-16 pb-16"
            >
                <List className="w-full m-0 p-0">
                    {!counselors?.length
                        ? <div className="flex flex-1 items-center justify-center">
                            <Typography
                                color="text.secondary"
                                variant="h5"
                            >
                                There are no counselors!
                            </Typography>
                        </div>
                        : counselors.map(item =>
                            <CounselorListItem
                                key={item.profile.id}
                                counselor={item} />
                        )}
                </List>
                <Pagination
                    page={page}
                    count={pageCount}
                    handleChange={handlePageChange}
                />
            </motion.div>
        </div>
    );
}

export default CounselorListContent;
