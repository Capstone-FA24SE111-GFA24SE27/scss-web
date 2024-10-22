import Button from '@mui/material/Button';
import { ContentLoading, Gender, NavLinkAdapter } from '@shared/components';
import { Link, NavLink, useLocation, useNavigate, useParams } from 'react-router-dom';
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
import { useEffect } from 'react';

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
  const location = useLocation()

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

  const handleLocalNavigate = (route: string) => {
    const pathSegments = location.pathname.split('/').filter(Boolean);

    console.log('segment', pathSegments)
    // Create a new path using the first two segments
     const newPath = `/${pathSegments[0]}/${pathSegments[1]}/${route}`;

    // Navigate to the new path
    navigate(newPath);
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
              src={student.profile.avatarLink}
              alt={student.profile.fullName}
            >
              {student?.profile.fullName?.charAt(0)}
            </Avatar>
            <Gender gender={student.profile.gender} />

            <div className="flex items-center mb-4 ml-auto">
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

          <div className="flex items-center gap-8 mt-16 ">
            <Chip
              label={student.studentCode}
              size="medium"
              className='px-16 text-lg'
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
                <div className="flex items-center justify-between w-full ml-24 leading-6">
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
              <div className='flex flex-col gap-8 mt-8'>
                <Paper className='flex justify-between px-8 py-4 rounded shadow'>
                  <div className='flex gap-8'>
                    <div className='flex items-center gap-8 '>
                      <CalendarMonth fontSize='small' />
                      <Typography className='' fontSize='small' >2024-10-07</Typography>
                    </div>
                    <div className='flex items-center gap-8'>
                      {/* <AccessTime fontSize='small' /> */}
                      <Typography fontSize='small'>09:15 - 10:15</Typography>
                    </div>
                  </div>
                  <Button size='small' className='flex gap-8 px-8' color='secondary' onClick={()=>handleLocalNavigate('1/report')}>
                    {/* <Summarize /> */}
                    View report
                  </Button>
                </Paper>
                <Paper className='flex justify-between px-8 py-4 rounded shadow'>
                  <div className='flex gap-8'>
                    <div className='flex items-center gap-8'>
                      <CalendarMonth fontSize='small' />
                      <Typography className='' fontSize='small' >2024-10-08</Typography>
                    </div>
                    <div className='flex items-center gap-8'>
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
