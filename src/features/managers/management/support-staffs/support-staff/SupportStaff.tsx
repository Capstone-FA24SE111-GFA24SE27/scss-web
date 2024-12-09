import { Mail, Phone } from '@mui/icons-material';
import { Paper, Rating, Tab, Tabs, Tooltip, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import { AppLoading, Breadcrumbs, Gender, Heading, PageSimple } from '@shared/components';
import { useEffect, useRef, useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { useGetSupportStaffManagementQuery, useGetSupportStaffsManagementQuery } from '../support-staffs-api';
import OverviewTab from './OverviewTab';
import DemandsTab from './DemandTab';
import FollowingStudentsTab from './FollowingStudentsTab';


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
      content={
        <div className='w-full'>
          <div className='bg-white'>
            <div className='p-16 px-32 space-y-16 '>
              <Breadcrumbs
                parents={[
                  {
                    label: "Management",
                    url: `${location.pathname}`
                  },
                  {
                    label: "Support Staffs",
                    url: `/management/supportStaffs`
                  }
                ]}
                currentPage={supportStaffData?.profile.fullName}
              />
              <div className='flex relative gap-32 md:gap-64'>
                <div className='flex gap-32'>
                  <div className='w-full h-full relative'>
                    <img src={supportStaffData?.profile.avatarLink} className='size-144 border rounded-full object-cover' />
                    <div className='absolute top-112 bg-white rounded-full border left-112'>
                      <Gender gender={supportStaffData?.profile.gender} />
                    </div>
                  </div>
                  <div className='flex flex-col gap-8 w-full mt-8 '>
                    <Heading
                      title={supportStaffData?.profile.fullName}
                    />
                    <div className='flex justify-between divide-x-1 border-t mt-16'>
                      <div
                        className="flex flex-1 items-center p-8 min-w-136"
                        role="button"
                      >
                        <Phone fontSize='small' />
                        <Typography className="ml-8">{supportStaffData?.profile.phoneNumber}</Typography>
                      </div>
                      <div
                        className="flex flex-1 items-center p-8 min-w-136"
                        role="button"
                      >
                        <Mail fontSize='small' />
                        <Typography className="ml-8">{supportStaffData?.profile?.email || ``}</Typography>
                      </div>
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
              {/* <Tab
              className="text-lg font-semibold min-h-40 min-w-64 px-16"
              label="Overview"
            /> */}
              <Tab
                className="text-lg font-semibold min-h-40 min-w-64 px-16"
                label="Demands"
              />
              <Tab
                className="text-lg font-semibold min-h-40 min-w-64 px-16"
                label="Following students"
              />
              {/* <Tab
              className="text-lg font-semibold min-h-40 min-w-64 px-16"
              label="Profile"
            /> */}
            </Tabs>
          </div>
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
