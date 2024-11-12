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
import { Paper } from '@mui/material';
import { useGetCounselorByIdQuery } from '../demand-api';
/**
 * The contact view.
 */

interface CounselorViewProps {
    
}
function CounselorView() {
    const routeParams = useParams();
    const { id: counselorId } = routeParams as { id: string };
    const { data, isLoading } = useGetCounselorByIdQuery(counselorId)
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
        <div className='w-md'>
            <Box
                className="relative w-full px-32 h-160 sm:h-192 sm:px-48"
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
            <div className="relative flex flex-col items-center flex-auto p-24 pt-0 sm:p-48 sm:pt-0">
                <div className="w-full max-w-3xl">
                    <div className="flex items-end flex-auto -mt-64">
                        <Avatar
                            sx={{
                                borderWidth: 4,
                                borderStyle: 'solid',
                                borderColor: 'background.paper',
                                backgroundColor: 'background.default',
                                color: 'text.secondary'
                            }}
                            className="font-bold w-128 h-128 text-64"
                            src={counselor?.profile?.avatarLink}
                            alt={counselor?.profile?.fullName}
                        >
                            {counselor?.profile.fullName?.charAt(0)}
                        </Avatar>
                        <Gender gender={counselor?.profile.gender} />
                       
                    </div>

                    <Typography className="mt-12 text-4xl font-bold truncate">{counselor?.profile.fullName}</Typography>

                    <div className="flex items-center gap-8 mt-8 ">
                        <Chip
                            label={counselor?.expertise?.name || counselor?.specialization?.name}
                            size="medium"
                            className='px-16 text-lg'
                        />
                    </div>


                    <Divider className="mt-16 mb-24" />

                    <div className="flex flex-col space-y-16">
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


                    </div>

                    {

                        counselor?.specialization && <div>
                            <Divider className="mt-16 mb-24" />
                            <Typography className='font-semibold'>
                                Academic details
                            </Typography>
                            <Paper className="p-8 mt-8 rounded shadow">

                                <div className="grid grid-cols-3 mb-4 gap-y-2">
                                    <div className="col-span-1 font-medium text-text-secondary">Specialization:</div>
                                    <div className="col-span-2">{counselor?.specialization?.name}</div>
                                </div>

                                {/* Department Section */}
                                <div className="grid grid-cols-3 mb-4 gap-y-2">
                                    <div className="col-span-1 font-medium text-text-secondary">Department:</div>
                                    <div className="col-span-2">
                                        <span>{counselor?.department.name}</span>
                                        {counselor?.department.code && (
                                            <span className="ml-2 text-text-disabled"> ({counselor?.department.code})</span>
                                        )}
                                    </div>
                                </div>

                                {/* Major Section */}
                                <div className="grid grid-cols-3 gap-y-2">
                                    <div className="col-span-1 font-medium text-text-secondary">Major:</div>
                                    <div className="col-span-2">
                                        <span>{counselor?.major.name}</span>
                                        {counselor?.major.code && (
                                            <span className="ml-2 text-text-disabled"> ({counselor?.major.code})</span>
                                        )}
                                    </div>
                                </div>
                            </Paper>
                        </div>
                    }


                </div>
            </div >
        </div>
    );
}

export default memo(CounselorView);
