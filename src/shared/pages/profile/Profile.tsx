import { CakeOutlined, CalendarMonth, Edit, EmailOutlined, LocalPhoneOutlined } from '@mui/icons-material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Accordion, AccordionDetails, AccordionSummary, Paper } from '@mui/material';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import Box from '@mui/system/Box';
import { ContentLoading, Gender, NavLinkAdapter, openDialog } from '@shared/components';
import dayjs from 'dayjs';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useAppDispatch } from '@shared/store';
import { useGetProfileQuery } from './profile-api';
/**
 * The contact view.
 */

interface ProfileProps {
}
function Profile({ }: ProfileProps) {
  const routeParams = useParams();
  const { data, isLoading } = useGetProfileQuery();
  const userProfile = data?.content
  const navigate = useNavigate();
  const location = useLocation()

  const dispatch = useAppDispatch();

  if (isLoading) {
    return <ContentLoading className='m-32 w-md' />
  }

  if (!userProfile) {
    return <div className='relative p-48 w-md'>
      <Typography
        color="text.secondary"
        variant="h5"
      >
        Invalid profile!
      </Typography>
    </div>
  }

  return (
    <div className='w-full'>
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
        <div className="w-full max-w-3xl space-y-16">
          <div className="flex items-end flex-auto -mt-52 gap-8">
            <Avatar
              sx={{
                borderWidth: 4,
                borderStyle: 'solid',
                borderColor: 'background.paper',
                backgroundColor: 'background.default',
                color: 'text.secondary'
              }}
              className="font-bold w-128 h-128 text-64"
              src={userProfile.avatarLink}
              alt={userProfile.fullName}
            >
              {userProfile.fullName?.charAt(0)}
            </Avatar>
            <div className=''>
              <Typography className="mt-12 text-4xl font-bold truncate">{userProfile.fullName}</Typography>
            </div>
          </div>
          <div className="flex flex-col space-y-16">
            <div>
              <Paper className="shadow p-16 mt-8">
                <Typography className='font-semibold text-xl mb-16'>
                  General Infomation
                </Typography>
                <div className="grid grid-cols-3 gap-y-2 mb-4">
                  <div className="col-span-1 font-medium text-text-secondary">Gender:</div>
                  <div className="col-span-2 capitalize">{userProfile.gender.toLocaleLowerCase()}</div>
                </div>
                {/* <div className="grid grid-cols-3 gap-y-2 mb-4">
                  <div className="col-span-1 font-medium text-text-secondary">Email:</div>
                  <div className="col-span-2">{userProfile?.email}</div>
                </div> */}

                <div className="grid grid-cols-3 gap-y-2 mb-4">
                  <div className="col-span-1 font-medium text-text-secondary">Phone Number:</div>
                  <div className="col-span-2">{userProfile.phoneNumber}</div>
                </div>

                <div className="grid grid-cols-3 gap-y-2">
                  <div className="col-span-1 font-medium text-text-secondary">Date of Birth:</div>
                  <div className="col-span-2">
                    {userProfile.dateOfBirth
                      ? dayjs(userProfile.dateOfBirth).format('DD-MM-YYYY')
                      : 'N/A'}
                  </div>
                </div>

              </Paper>
            </div>


          </div>
        </div>
      </div>
    </div >
  );
}

export default Profile;
