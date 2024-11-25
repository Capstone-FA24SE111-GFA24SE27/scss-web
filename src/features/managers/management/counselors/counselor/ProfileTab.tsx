import { CakeOutlined, CalendarMonth, Edit, EmailOutlined, LocalPhoneOutlined } from '@mui/icons-material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Accordion, AccordionDetails, AccordionSummary, Paper } from '@mui/material';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import Box from '@mui/system/Box';
import { ContentLoading, Gender, NavLinkAdapter, WeeklySlots, openDialog } from '@shared/components';
import dayjs from 'dayjs';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { selectAccount, useAppDispatch, useAppSelector } from '@shared/store';
import { useGetCounselorProfileQuery, useGetWeeklySlotsQuery } from '@/shared/pages';
import { useGetCounselorManagementQuery } from '../counselors-api';
/**
 * The contact view.
 */

function ProfileTab() {
  const { id } = useParams();
  const { data, isLoading } = useGetCounselorManagementQuery(Number(id));

  const counselor = data?.content.profile

  console.log(counselor)
  const navigate = useNavigate();
  const location = useLocation()
  const dispatch = useAppDispatch();

  const { data: counselorCounselingSlotsData, isLoading: isLoadingCounselorCounselingSlotsData } = useGetWeeklySlotsQuery(Number(id))
  const counselorCounselingSlots = counselorCounselingSlotsData?.content

  if (isLoading) {
    return <ContentLoading className='m-32 w-md' />
  }

  if (!counselor) {
    return <div className='relative p-48 w-md'>
      <Typography
        color="text.secondary"
        variant="h5"
      >
        Invalid counselor!
      </Typography>
    </div>
  }

  return (
    <div className='w-full bg-background'>
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

          <div className="flex flex-col space-y-16 -mt-96">
            <div>
              <Paper className="shadow p-16 mt-8">
                <Typography className='font-semibold text-xl mb-16'>
                  General Infomation
                </Typography>
                <div className="grid grid-cols-3 gap-y-2 mb-4">
                  <div className="col-span-1 font-medium text-text-secondary">Gender:</div>
                  <div className="col-span-2 capitalize">{counselor?.profile.gender.toLocaleLowerCase()}</div>
                </div>
                {/* Email Section */}
                <div className="grid grid-cols-3 gap-y-2 mb-4">
                  <div className="col-span-1 font-medium text-text-secondary">Email:</div>
                  <div className="col-span-2">{counselor?.email}</div>
                </div>

                {/* Phone Number Section */}
                <div className="grid grid-cols-3 gap-y-2 mb-4">
                  <div className="col-span-1 font-medium text-text-secondary">Phone Number:</div>
                  <div className="col-span-2">{counselor?.profile.phoneNumber}</div>
                </div>

                {/* Date of Birth Section */}
                <div className="grid grid-cols-3 gap-y-2">
                  <div className="col-span-1 font-medium text-text-secondary">Date of Birth:</div>
                  <div className="col-span-2">
                    {counselor?.profile.dateOfBirth
                      ? dayjs(counselor.profile.dateOfBirth).format('DD-MM-YYYY')
                      : 'N/A'}
                  </div>
                </div>

              </Paper>
            </div>

            <div>
              {
                counselor?.department
                  ? <Paper className="shadow p-16 mt-8">
                    <Typography className='font-semibold mb-16 text-xl'>
                      Academic details
                    </Typography>

                    <div className="grid grid-cols-3 gap-y-2 mb-4">
                      <div className="col-span-1 font-medium text-text-secondary">Academic Degree:</div>
                      <div className="col-span-2">{counselor.academicDegree}</div>
                    </div>

                    <div className="grid grid-cols-3 gap-y-2 mb-4">
                      <div className="col-span-1 font-medium text-text-secondary">Specialization:</div>
                      <div className="col-span-2">{counselor.specialization?.name}</div>
                    </div>

                    {/* Department Section */}
                    <div className="grid grid-cols-3 gap-y-2 mb-4">
                      <div className="col-span-1 font-medium text-text-secondary">Department:</div>
                      <div className="col-span-2">
                        <span>{counselor.department.name}</span>
                        {counselor.department.code && (
                          <span className="ml-2 text-text-disabled"> ({counselor.department.code})</span>
                        )}
                      </div>
                    </div>

                    {/* Major Section */}
                    <div className="grid grid-cols-3 gap-y-2">
                      <div className="col-span-1 font-medium text-text-secondary">Major:</div>
                      <div className="col-span-2">
                        <span>{counselor.major.name}</span>
                        {counselor.major.code && (
                          <span className="ml-2 text-text-disabled"> ({counselor.major.code})</span>
                        )}
                      </div>
                    </div>
                  </Paper>
                  : <Paper className="shadow p-16 mt-8">
                    <Typography className='font-semibold text-xl mb-16'>
                      Experience
                    </Typography>
                    <div className="grid grid-cols-3 gap-y-2 mb-4">
                      <div className="col-span-1 font-medium text-text-secondary">Expertise</div>
                      <div className="col-span-2">{counselor?.expertise?.name}</div>
                    </div>
                  </Paper>
              }

            </div>
            <Paper className="shadow p-16 mt-8">
              <Typography className='font-semibold mb-16 text-xl'>
                Weekly Schedule
              </Typography>
              <WeeklySlots slots={counselorCounselingSlots} />
            </Paper>

          </div>
        </div>
      </div>
    </div >
  );
}

export default ProfileTab;
