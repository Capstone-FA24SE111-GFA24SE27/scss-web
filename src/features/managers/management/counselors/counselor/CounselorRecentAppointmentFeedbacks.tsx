import { Role } from '@/shared/types';
import { ArrowForward, CheckCircleOutlineOutlined, Description, ExpandMore, HelpOutlineOutlined, Search, ThumbDownOutlined, ThumbUpOutlined } from '@mui/icons-material';
import { Accordion, AccordionDetails, AccordionSummary, Avatar, Box, Button, FormControlLabel, IconButton, InputAdornment, ListItem, MenuItem, Paper, Rating, Switch, TextField, Typography } from '@mui/material';
import { selectAccount, useAppDispatch, useAppSelector } from '@shared/store';
import { motion } from 'framer-motion';
import { useGetCounselorAppointmentsManagementQuery, useGetCounselorFeedbacksQuery } from '../counselors-api';
import { useNavigate, useParams } from 'react-router-dom';
import { SyntheticEvent, useState } from 'react'
import { ContentLoading, ExpandableText, FeedbackItem, Heading, ItemMenu, openDialog } from '@/shared/components';
import { motionVariants } from '@/shared/configs';
import dayjs from 'dayjs';
import { AppointmentDetail } from '@/shared/pages';
import { firstDayOfMonth, lastDayOfMonth } from '@/shared/constants';


const CounselorRecentAppointmentFeedbacks = ({ counselorId }: { counselorId?: string }) => {
  const { id: routeId } = useParams()
  const id = counselorId || routeId
  // const { data: counselorFeedbacksData, isLoading } = useGetCounselorFeedbacksQuery({ counselorId: Number(id) })
  const { data: appointmentsData, isLoading } = useGetCounselorAppointmentsManagementQuery({
    // fromDate: dayjs().subtract(3, 'month').startOf('month').format("YYYY-MM-DD"),
    // toDate: dayjs().add(1, 'month').endOf("month").format("YYYY-MM-DD"),
    fromDate: firstDayOfMonth,
    toDate: lastDayOfMonth,
    counselorId: Number(id),
    size: 9999,
  });
  const counselorAppointmentsWithFeedback = appointmentsData?.content.data?.filter(item => item.appointmentFeedback)?.slice(9)
  const dispatch = useAppDispatch()

  const [expanded, setExpanded] = useState<number | boolean>(false);

  const toggleAccordion = (panel: number) => (_: SyntheticEvent, _expanded: boolean) => {
    setExpanded(_expanded ? panel : false);
  };
  const navigate = useNavigate()


  if (isLoading) {
    return <ContentLoading />
  }
  
  return (
    <Paper className='p-16 shadow space-y-16 h-sm'>
      <Typography className="font-semibold text-2xl">Recent Appointment Feedbacks</Typography>
      {
        !counselorAppointmentsWithFeedback?.length
          ? <div className='text-center p-32'>
            <Typography variant='h5' className='text-text-disabled'>No feedbacks found</Typography>
          </div>
          : (
            <motion.div
              variants={motionVariants.container}
              initial="hidden"
              animate="show"
              className=''
            >
              <div className='grid grid-cols-3 gap-16 divide-x-'>
                {counselorAppointmentsWithFeedback?.map((item) => (
                  <motion.div
                    variants={motionVariants.item}
                    key={item.id}
                  >
                    <FeedbackItem
                      feedback={item.appointmentFeedback}
                      profile={item.studentInfo.profile}
                      handleOpenDetail={() =>
                        dispatch(openDialog({
                          children: <AppointmentDetail id={item.id.toString()} />
                        }))}
                    />

                  </motion.div>
                ))
                }
              </div >
            </motion.div >
          )
      }
    </Paper >
  )
}

export default CounselorRecentAppointmentFeedbacks