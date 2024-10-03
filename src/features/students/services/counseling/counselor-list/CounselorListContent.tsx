import { motion } from 'framer-motion';
import Typography from '@mui/material/Typography';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import { AppLoading, ContentLoading } from '@shared/components';
import { useAppSelector } from '@shared/store';
import CounselorListItem from './CounselorListItem';
import { useGetCounselorsQuery } from '../counseling-api';

function CounselorListContent() {
    const { data, isLoading } = useGetCounselorsQuery({})
    const counselors = data?.content?.data || []

    console.log(counselors)

    if (!counselors.length ) {
        return (
            <div className="flex flex-1 items-center justify-center">
                <Typography
                    color="text.secondary"
                    variant="h5"
                >
                    There are no counselors!
                </Typography>
            </div>
        );
    }

    if (isLoading) {
        return <ContentLoading />;
    }

    return (
        <div className='flex-1'>
            <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1, transition: { delay: 0.2 } }}
                className="flex flex-col flex-auto w-full max-h-full"
            >
                <List className="w-full m-0 p-0">
                    {counselors.map(item =>
                        <CounselorListItem
                            key={item.id}
                            counselor={item} />
                    )}
                </List>
            </motion.div>
        </div>
    );
}

export default CounselorListContent;
