import { Heading } from '@/shared/components';
import { Chip, Typography } from '@mui/material';
import { useCountOpenAppointmentsQuery, useCountOpenRequestsQuery } from './counseling-api';
import { selectAccount, useAppSelector } from '@shared/store';

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
    const account = useAppSelector(selectAccount)
    const { data: countOpenAppointment } = useCountOpenAppointmentsQuery(account.profile.id)
    const { data: countOpenRequest } = useCountOpenRequestsQuery(account.profile.id)
    const reachingPendingAppointmentsLimit = (countOpenAppointment?.content || 0) >= 3 || ((countOpenRequest?.content || 0) >= 3)

    return (
        <>
            <div className="px-24 py-16 sm:px-32 w-full bg-background-paper">
                <div className='flex justify-between items-start'>
                    <Heading title='Counseling Service' description='Providing personalized guidance and support for students.' />
                    <div className='flex flex-col items-end'>
                        <div className='flex gap-32'>
                            <div className='flex gap-8 items-center'>
                                <Typography className='text-lg font-semibold'>
                                    Pending  Requests:
                                </Typography>
                                <Chip label={`${countOpenRequest?.content === undefined ? `-` : countOpenRequest?.content}/3`} />
                            </div>
                            <div className='flex gap-8 items-center'>
                                <Typography className='text-lg font-semibold'>
                                    Waiting Appointments:
                                </Typography>
                                <Chip label={`${countOpenAppointment?.content === undefined ? `-` : countOpenAppointment?.content}/3`} />
                            </div>
                        </div>
                        {reachingPendingAppointmentsLimit && <Typography color='error' className='font-semibold'>
                            You have reached the limit of pending appointments, please wait for others to be resolved.
                        </Typography>}
                    </div>
                </div>
            </div>
        </>
    );
}

export default CounselingHeader;
