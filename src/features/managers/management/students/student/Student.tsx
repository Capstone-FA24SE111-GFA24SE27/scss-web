import { Mail, Phone } from '@mui/icons-material';
import { Avatar, Paper, Rating, Tab, Tabs, Tooltip, Typography } from '@mui/material';
import { darken, styled } from '@mui/material/styles';
import { AppLoading, Breadcrumbs, Gender, Heading, PageSimple } from '@shared/components';
import { useEffect, useRef, useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import AppointmentsTable from './AppointmentsTab';
import RequestsTable from './RequestsTab';
import { useGetStudentDetailQuery } from '@/shared/pages';
import ScheduleTab from './ScheduleTab';
import CounselingProfile from './CounselingProfile';
import LearningProcess from './LearningProcessTab';
import GeneralInformation from './GeneralInformation';


const Root = styled(PageSimple)(({ theme }) => ({
  '& .PageSimple-header': {
    backgroundColor: theme.palette.background.paper
  },
}));


function Student() {
  const pageLayout = useRef(null);
  const routeParams = useParams()
  const { id } = useParams();
  const [rightSidebarOpen, setRightSidebarOpen] = useState(false);
  const [tabValue, setTabValue] = useState(0);

  const [selectedDay, setSelectedDay] = useState('MONDAY');

  const { data, isLoading } = useGetStudentDetailQuery(id);
  const studentData = data?.content

  const handleChangeTab = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const isMobile = false

  const location = useLocation();

  useEffect(() => {
    setRightSidebarOpen(Boolean(routeParams.appointmentId));
  }, [routeParams]);

  if (isLoading) {
    return <AppLoading />;
  }
  if (!data) {
    return <Typography color='text.secondary' variant='h5' className='p-16'>No student</Typography>;
  }

  return (
    <Root
      header={
        <div className='bg-white w-full'>
          <div className='px-24 py-16 space-y-16 w-full'>
            <Breadcrumbs
              parents={[
                {
                  label: "Management",
                  url: `${location.pathname}`
                },
                {
                  label: "Students",
                  url: `/management/students`
                }
              ]}
              currentPage={studentData?.profile.fullName}
            />
            <div className="flex flex-auto items-center">
              <div>
                <Avatar
                  sx={{
                    color: (theme) => theme.palette.text.secondary
                  }}
                  className="flex-0 size-72"
                  alt="user photo"
                  src={studentData?.profile.avatarLink}
                >
                  {studentData?.profile.fullName}
                </Avatar>
                {/* <Gender gender={studentData?.profile.gender} className='absolute bottom-0 right-0' /> */}
              </div>
              <div className="flex flex-col min-w-0 mx-16">
                <Typography className='text-4xl font-semibold'>
                  {`${studentData?.profile.fullName}`}
                </Typography>
                <Typography className='text-lg'>
                  {studentData?.studentCode}
                </Typography>
              </div>
            </div>
          </ div>
          <Tabs
            value={tabValue}
            onChange={handleChangeTab}
            indicatorColor="secondary"
            textColor="secondary"
            variant="scrollable"
            scrollButtons="auto"
            classes={{ root: 'w-full h-32 border-b bg-background-paper px-16' }}
          >
            <Tab
              className="text-lg font-semibold min-h-40 min-w-64 px-16"
              label="General Information"
            />
            <Tab
              className="text-lg font-semibold min-h-40 min-w-64 px-16"
              label="Counseling Profile"
            />
            <Tab
              className="text-lg font-semibold min-h-40 min-w-64 px-16"
              label="Learning Process"
            />
          </Tabs>
        </div>
      }
      content={
        <div className='w-full'>
          <div className="w-full p-16 h-fit" >
            <Paper className='p-16 h-fit shadow'>
              <div className="w-full pr-8">
                {tabValue === 0 && <GeneralInformation />}
                {tabValue === 1 && <CounselingProfile />}
                {tabValue === 2 && <LearningProcess />}
              </div>
            </Paper>
          </div >
        </div>
      }
      ref={pageLayout}
      rightSidebarOpen={rightSidebarOpen}
      rightSidebarOnClose={() => setRightSidebarOpen(false)}
      rightSidebarWidth={640}
      rightSidebarVariant="temporary"
      scroll={isMobile ? 'normal' : 'content'}
    />
  );
}

export default Student;
