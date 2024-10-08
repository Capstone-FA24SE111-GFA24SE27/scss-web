import Button from '@mui/material/Button';
import { ContentLoading, Gender, NavLinkAdapter } from '@shared/components';
import { Link, NavLink, useNavigate, useParams } from 'react-router-dom';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import Box from '@mui/system/Box';
import _ from 'lodash';
import { AccessTime, CakeOutlined, CalendarMonth, EmailOutlined, LocalPhoneOutlined, NotesOutlined, Summarize, SchoolOutlined } from '@mui/icons-material';
import { ListItemButton, Paper, Rating } from '@mui/material';
import dayjs from 'dayjs';
import { useGetStudentQuery } from './student-api';

/**
 * The contact view.
 */

interface StudentViewProps {
}
function StudentView({ }: StudentViewProps) {
  const routeParams = useParams();
  const { id: studentId } = routeParams as { id: string };
  const { data, isLoading } = useGetStudentQuery(studentId);
  const student = data?.content
  const navigate = useNavigate();

  if (isLoading) {
    return <ContentLoading className='m-32 w-md' />
  }

  if (!student) {
    return <div className='relative p-48 w-md'>
      <Typography
        color="text.secondary"
        variant="h5"
      >
        Invalid student!
      </Typography>
    </div>
  }

  return (
    <div className='w-md'>
      <Box
        className="relative w-full h-160 sm:h-192 px-32 sm:px-48"
        sx={{
          backgroundColor: 'background.default'
        }}
      >
        <img
          className="absolute inset-0 object-cover w-full h-full"
          src={'/assets/images/fptu-cover.png'}
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
              src={student.profile.avatarLink}
              alt={student.profile.fullName}
            >
              {student?.profile.fullName?.charAt(0)}
            </Avatar>
            <Gender gender={student.profile.gender} />

            <div className="flex items-center ml-auto mb-4">
              <Button
                variant="contained"
                color="secondary"
                sx={{ color: 'white' }}
                component={NavLinkAdapter}
                to="booking"
              >
                <span className="mx-8">Create an appointment</span>
              </Button>
            </div>


          </div>

          <Typography className="mt-12 text-4xl font-bold truncate">{student.profile.fullName}</Typography>

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
              label={student.studentCode}
              size="medium"
              className='text-lg px-16'
            />
          </div>


          <Divider className="mt-16 mb-24" />

          <div className="flex flex-col space-y-32">
            {student.email && (
              <div className="flex items-center">
                <EmailOutlined />
                <div className="ml-24 leading-6">{student.email}</div>
              </div>
            )}

            {student.profile.phoneNumber && (
              <div className="flex items-center">
                <LocalPhoneOutlined />
                <div className="ml-24 leading-6">{student.profile.phoneNumber}</div>
              </div>
            )}


            {student.profile.dateOfBirth && (
              <div className="flex items-center">
                <CakeOutlined />
                <div className="ml-24 leading-6">{dayjs(student.profile.dateOfBirth).format('DD-MM-YYYY')}</div>
              </div>
            )}

            {student.profile.phoneNumber && (
              <div className="flex items-center">
                {/* <SchoolOutlined /> */}
                <span className='font-semibold'>GPA</span>
                <div className="ml-24 leading-6 flex items-center justify-between w-full">
                  6.9/10
                  <Button variant='outlined' color='secondary' onClick={() => navigate('academic-transcript')}>View academic transcript</Button>
                </div>
              </div>
            )}

            <Divider />

            <div>
              <Typography className='font-semibold'>
                History of couseling
              </Typography>
              <div className='mt-8 flex flex-col gap-8'>
                <Paper className='shadow py-4 px-8 rounded flex justify-between'>
                  <div className='flex gap-8'>
                    <div className='flex gap-8 items-center '>
                      <CalendarMonth fontSize='small' />
                      <Typography className='' fontSize='small' >2024-10-07</Typography>
                    </div>
                    <div className='flex gap-8 items-center'>
                      {/* <AccessTime fontSize='small' /> */}
                      <Typography fontSize='small'>09:15 - 10:15</Typography>
                    </div>
                  </div>
                  <Button size='small' className='flex gap-8 px-8' color='secondary' onClick={() => navigate('/counseling/appointments/1/report')}>
                    {/* <Summarize /> */}
                    View report
                  </Button>
                </Paper>
                <Paper className='shadow py-4 px-8 rounded flex justify-between'>
                  <div className='flex gap-8'>
                    <div className='flex gap-8 items-center'>
                      <CalendarMonth fontSize='small' />
                      <Typography className='' fontSize='small' >2024-10-08</Typography>
                    </div>
                    <div className='flex gap-8 items-center'>
                      {/* <AccessTime fontSize='small' /> */}
                      <Typography fontSize='small'>09:15 - 10:15</Typography>
                    </div>
                  </div>
                  <Button size='small' className='flex gap-8 px-8' color='secondary'>
                    {/* <Summarize /> */}
                    View report
                  </Button>
                </Paper>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

export default StudentView;
