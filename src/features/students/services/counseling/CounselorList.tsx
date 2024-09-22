import { motion } from 'framer-motion';
import Typography from '@mui/material/Typography';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import { AppLoading } from '@shared/components';
import { useAppSelector } from '@shared/store';
import CounselorListItem from './CounselorListItem';

function CounselorList() {
    // const { data, isLoading } = useGetContactsListQuery();
    const filteredData = [
        {
            "id": 4,
            "email": "counselor@example.com",
            "avatarLink": "https://arknights.wiki.gg/images/0/02/Ho%27olheyak_icon.png",
            "rating": 4.6,
            "fullName": "Counselor",
            "phoneNumber": "1234567890",
            "dateOfBirth": 315532800000
        },
        {
            "id": 5,
            "email": "counselor@example.com",
            "avatarLink": "https://cdn.donmai.us/original/7d/54/7d54b13167b0a0292fbe140f3fb8fb76.jpg",
            "rating": 4.6,
            "fullName": "Phat",
            "phoneNumber": "1234567890",
            "dateOfBirth": 315532800000
        },
    ]
    // const groupedFilteredContacts = useAppSelector(selectGroupedFilteredContacts(filteredData));

    // if (isLoading) {
    //     return <FuseLoading />;
    // }

    if (filteredData.length === 0) {
        return (
            <div className="flex flex-1 items-center justify-center h-full">
                <Typography
                    color="text.secondary"
                    variant="h5"
                >
                    There are no counselors!
                </Typography>
            </div>
        );
    }

    return (
        <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1, transition: { delay: 0.2 } }}
            className="flex flex-col flex-auto w-full max-h-full px-4"
        >
            <List className="w-full m-0 p-0">
                {filteredData.map(item =>
                    <CounselorListItem
                        key={item.id}
                        counselor={item} />
                )}
            </List>
        </motion.div>
    );
}

export default CounselorList;
