import { Cake, CakeOutlined, Mail, Phone } from '@mui/icons-material';
import { Avatar, Paper, Rating, Tab, Tabs, Tooltip, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import { AppLoading, Breadcrumbs, Gender, Heading, PageSimple } from '@shared/components';
import { useEffect, useRef, useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { useGetSupportStaffManagementQuery, useGetSupportStaffsManagementQuery } from '../support-staffs-api';
import OverviewTab from './OverviewTab';
import DemandsTab from './DemandTab';
import FollowingStudentsTab from './FollowingStudentsTab';
import dayjs from 'dayjs';


const Root = styled(PageSimple)(({ theme }) => ({
  '& .PageSimple-header': {
    backgroundColor: theme.palette.background.paper
  },
}));


function SupportStaff() {
  const pageLayout = useRef(null);
  const routeParams = useParams()
  const { id } = useParams();
  const [rightSidebarOpen, setRightSidebarOpen] = useState(false);
  const [tabValue, setTabValue] = useState(0);

  const [selectedDay, setSelectedDay] = useState('MONDAY');

  const { data, isLoading } = useGetSupportStaffManagementQuery(id);
  const supportStaffData = data?.content

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
    return <Typography color='text.secondary' variant='h5' className='p-16'>No supportStaff</Typography>;
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
                  label: "Support Staffs",
                  url: `/management/students`
                }
              ]}
              currentPage={supportStaffData?.profile.fullName}
            />
            <div className="flex flex-auto items-center">
              <div className='flex relative'>
                <Avatar
                  sx={{
                    color: (theme) => theme.palette.text.secondary
                  }}
                  className="flex-0 size-72"
                  alt="user photo"
                  src={supportStaffData?.profile.avatarLink}
                >
                  {supportStaffData?.profile.fullName}
                </Avatar>
                <Gender gender={supportStaffData?.profile.gender} className='absolute bottom-0 right-0'/> 
              </div>
              <div className="flex flex-col min-w-0 mx-16">
                <Heading title={`${supportStaffData?.profile.fullName}`} />
                <div className='flex justify-between mt-8 gap-32'>
                  <div
                    className="flex items-center"
                    role="button"
                  >
                    <Phone fontSize='small' />
                    <Typography className="ml-8 leading-6">{supportStaffData?.profile.phoneNumber}</Typography>
                  </div>
                  <div
                    className="flex items-center"
                    role="button"
                  >
                    <Mail fontSize='small' />
                    <Typography className="ml-8 leading-6">{supportStaffData?.profile?.email || ``}</Typography>
                  </div>
                  {/* <div className="flex items-center">
                    <Cake fontSize='small' />
                    <div className="ml-8 leading-6">{dayjs(supportStaffData.profile.dateOfBirth).format('DD-MM-YYYY')}</div>
                  </div> */}
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
              label="Demands"
            />
            <Tab
              className="text-lg font-semibold min-h-40 min-w-64 px-16"
              label="Following students"
            />
          </Tabs>
        </div>
      }
      content={
        <div className='w-full'>
          <div className="w-full p-16 h-full" >
            <Paper className='p-16 h-full shadow'>
              <div className="w-full pr-8">
                {/* {tabValue === 0 && <OverviewTab />} */}
                {tabValue === 0 && <DemandsTab />}
                {tabValue === 1 && <FollowingStudentsTab />}
              </div>
            </Paper>
          </div>
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

export default SupportStaff;
