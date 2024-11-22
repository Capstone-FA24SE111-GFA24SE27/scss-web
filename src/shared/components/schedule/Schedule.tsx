import { PageSimple } from '@/shared/components';
import { Appointment } from '@/shared/types';
import { DatesSetArg } from '@fullcalendar/core';
import FullSchedule from '@fullcalendar/react';
import { styled } from '@mui/material';
import { useAppDispatch } from '@shared/store';
import { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import ScheduleBody from './ScheduleBody';
import ScheduleHeader from './ScheduleHeader';
import { addScheduleData, resetSchedule } from './schedule-slice';
// import ScheduleSidebarContent from './Schedule-components/ScheduleSidebarContent';

const Root = styled(PageSimple)(({ theme }) => ({
  '& .PageSimple-header': {
    backgroundColor: theme.palette.background.paper,
  },
}));

const Schedule = ({getScheduleHook, id}: {getScheduleHook, id: number}) => {
  const [currentDate, setCurrentDate] = useState<DatesSetArg>();
  const [rightSidebarOpen, setRightSidebarOpen] = useState(false);

  const ScheduleRef = useRef<FullSchedule>(null);
  const pageLayout = useRef(null);
  const navigate = useNavigate()
  const routeParams = useParams();

  const isMobile = false;
  useEffect(() => {
    if (routeParams.id || routeParams.date) {
      setRightSidebarOpen(true);
    } else {
      setRightSidebarOpen(false)
    }
  }, [routeParams]);

  const handleCloseRightSideBar = () => {
    navigate('')
  }

  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(resetSchedule)
    return () => {
      dispatch(addScheduleData([]))
    }
  }, []);
  return (
    <div>
      <ScheduleHeader
        calendarRef={ScheduleRef}
        currentDate={currentDate!}
      />
      <ScheduleBody
        handleDates={setCurrentDate}
        currentDate={currentDate}
        calendarRef={ScheduleRef}
        getScheduleHook={getScheduleHook}
        id={id}
      />
    </div>
  )
  // return (
  //   <Root
  //   className='bg-black h-screen'
  //     header={
  //       <ScheduleHeader
  //         calendarRef={ScheduleRef}
  //         currentDate={currentDate!}
  //       />
  //     }
  //     content={
  //       <ScheduleBody
  //         handleDates={setCurrentDate}
  //         currentDate={currentDate}
  //         calendarRef={ScheduleRef}
  //       />
  //     }
  //     ref={pageLayout}
  //     // rightSidebarContent={<ScheduleSidebarContent />}
  //     rightSidebarOpen={rightSidebarOpen}
  //     rightSidebarOnClose={handleCloseRightSideBar}
  //     rightSidebarWidth={640}
  //     rightSidebarVariant='temporary'
  //     scroll={isMobile ? 'normal' : 'content'}
  //   />
  // );
};

export default Schedule;
