import { Mail, Phone } from '@mui/icons-material';
import { Paper, Rating, Tab, Tabs, Tooltip, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import { AppLoading, Breadcrumbs, Gender, Heading, PageSimple } from '@shared/components';
import { useEffect, useRef, useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import AppointmentsTable from './AppointmentsTab';
import RequestsTable from './RequestsTab';
import { useGetStudentDetailQuery } from '@/shared/pages';
import ScheduleTab from './ScheduleTab';
import GeneralInformation from './GeneralTab';
import LearningProcess from './LearningProcessTab';


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
        <div className=''>
          <div className='p-16 px-32 space-y-16'>
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
            <div className='flex relative gap-32 md:gap-64'>
              <div className='flex gap-32'>
                <div className='w-full h-full relative'>
                  <img src={studentData?.profile.avatarLink} className='size-144 border rounded-full' />
                  <div className='absolute top-112 bg-white rounded-full border left-112'>
                    <Gender gender={studentData?.profile.gender} />
                  </div>
                </div>
                <div className='flex flex-col gap-8 w-full mt-8'>
                  <Heading
                    title={studentData?.profile.fullName}
                    description={studentData?.studentCode.toString()}
                  />
                  <div className='flex justify-between divide-x-1 border-t mt-16'>
                    <div
                      className="flex flex-1 items-center p-8 min-w-136"
                      role="button"
                    >
                      <Phone fontSize='small' />
                      <Typography className="ml-8">{studentData?.profile.phoneNumber}</Typography>
                    </div>
                    <div
                      className="flex flex-1 items-center p-8 min-w-136"
                      role="button"
                    >
                      <Mail fontSize='small' />
                      <Typography className="ml-8">{studentData?.email}</Typography>
                    </div>
                  </div>
                </div>
              </div>

              <div className="min-w-sm h-full">
                <Typography className='font-semibold mb-16 text-xl'>
                  Field of study
                </Typography>
                <div className="grid grid-cols-3 gap-y-2 mb-4">
                  <div className="col-span-1 font-medium text-text-secondary">Specialization:</div>
                  <div className="col-span-2">{studentData.specialization?.name}</div>
                </div>

                {/* Department Section */}
                <div className="grid grid-cols-3 gap-y-2 mb-4">
                  <div className="col-span-1 font-medium text-text-secondary">Department:</div>
                  <div className="col-span-2">
                    <span>{studentData.department.name}</span>
                    {studentData.department.code && (
                      <span className="ml-2 text-text-disabled"> ({studentData.department.code})</span>
                    )}
                  </div>
                </div>

                {/* Major Section */}
                <div className="grid grid-cols-3 gap-y-2">
                  <div className="col-span-1 font-medium text-text-secondary">Major:</div>
                  <div className="col-span-2">
                    <span>{studentData.major.name}</span>
                    {studentData.major.code && (
                      <span className="ml-2 text-text-disabled"> ({studentData.major.code})</span>
                    )}
                  </div>
                </div>
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
        <div className="w-full p-16 h-fit" >
          <Paper className='p-16 h-fit shadow'>
            <div className="w-full pr-8">
              {tabValue === 0 && <GeneralInformation />}
              {tabValue === 1 && <LearningProcess />}
            </div>
          </Paper>
        </div >
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
