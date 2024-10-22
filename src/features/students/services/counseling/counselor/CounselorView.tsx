import { CounselingType } from '@/shared/types';
import { CakeOutlined, EmailOutlined, LocalPhoneOutlined, NotesOutlined } from '@mui/icons-material';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import Box from '@mui/system/Box';
import { ContentLoading, Gender, NavLinkAdapter } from '@shared/components';
import dayjs from 'dayjs';
import { memo } from 'react';
import { useParams } from 'react-router-dom';
import { useGetCounselorQuery } from '../counseling-api';
/**
 * The contact view.
 */

interface CounselorViewProps {
    shouldShowBooking?: boolean,
    counselingType?: CounselingType
}
function CounselorView({ shouldShowBooking = true }: CounselorViewProps) {
    const routeParams = useParams();
    const { id: counselorId } = routeParams as { id: string };
    const { data, isLoading } = useGetCounselorQuery(counselorId)
    const counselor = data?.content
    console.log(counselor)

    if (isLoading) {
        return <ContentLoading className='m-32' />
    }

    if (!counselor) {
        return <div className='relative p-48'>
            <Typography
                color="text.secondary"
                variant="h5"
            >
                Invalid counselor!
            </Typography>
        </div>
    }

    return (
        <>
            <Box
                className="relative w-full h-160 sm:h-192 px-32 sm:px-48"
                sx={{
                    backgroundColor: 'background.default'
                }}
            >
                <img
                    className="absolute inset-0 object-cover w-full h-full"
                    src={'/assets/images/fptu-cover.jpeg'}
                    alt="user background"
                />
            </Box>
            <div className="relative flex flex-col flex-auto items-center p-24 pt-0 sm:p-48 sm:pt-0">
                <div className="w-full max-w-3xl">
                    <div className="flex flex-auto items-end -mt-64">
                        <Avatar
                            sx={{
                                borderWidth: 4,
                                borderStyle: 'solid',
                                borderColor: 'background.paper',
                                backgroundColor: 'background.default',
                                color: 'text.secondary'
                            }}
                            className="w-128 h-128 text-64 font-bold"
                            src={counselor?.profile?.avatarLink}
                            alt={counselor?.profile?.fullName}
                        >
                            {counselor?.profile.fullName?.charAt(0)}
                        </Avatar>
                        <Gender gender={counselor.profile.gender} />

                        {
                            shouldShowBooking && (
                                <div className="flex items-center ml-auto mb-4">
                                    <Button
                                        variant="contained"
                                        color="secondary"
                                        sx={{ color: 'white' }}
                                        component={NavLinkAdapter}
                                        to="booking"
                                    >
                                        <span className="mx-8">Book Appointment</span>
                                    </Button>
                                </div>
                            )

                        }
                    </div>

                    <Typography className="mt-12 text-4xl font-bold truncate">{counselor.profile.fullName}</Typography>

                    {/* <div className='flex items-end gap-8 text-lg text-gray-500'>
                        <Rating
                            name="simple-controlled"
                            value={4.6}
                            readOnly
                            precision={0.5}
                        />
                        <div>(116)</div>
                    </div> */}

                    <div className="flex items-center mt-16 gap-8 ">
                        <Chip
                            label={counselor.expertise?.name || counselor.specialization?.name}
                            size="medium"
                            className='text-lg px-16'
                        />
                    </div>


                    <Divider className="mt-16 mb-24" />

                    <div className="flex flex-col space-y-32">
                        {counselor.email && (
                            <div className="flex items-center">
                                <EmailOutlined />
                                <div className="ml-24 leading-6">{counselor.email}</div>
                            </div>
                        )}

                        {counselor.profile.phoneNumber && (
                            <div className="flex items-center">
                                <LocalPhoneOutlined />
                                <div className="ml-24 leading-6">{counselor.profile.phoneNumber}</div>
                            </div>
                        )}


                        {counselor.profile.dateOfBirth && (
                            <div className="flex items-center">
                                <CakeOutlined />
                                <div className="ml-24 leading-6">{dayjs(counselor.profile.dateOfBirth).format('DD-MM-YYYY')}</div>
                            </div>
                        )}

                        {counselor.profile.dateOfBirth && (
                            <div className="flex items-center">
                                <NotesOutlined />
                                <div className="ml-24 leading-6">
                                    Adipisicing exercitation dolor nisi ipsum nostrud anim dolore sint veniam consequat lorem sit ex commodo nostrud occaecat elit magna magna commodo incididunt laborum ad irure pariatur et sit ullamco adipisicing.

                                    Ullamco in dolore amet est quis consectetur fugiat non nisi incididunt id laborum adipisicing dolor proident velit ut quis aliquip dolore id anim sit adipisicing nisi incididunt enim amet pariatur.
                                </div>
                            </div>
                        )}

                    </div>
                </div>
            </div>
        </>
    );
}

export default memo(CounselorView);
