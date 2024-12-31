import { Role } from '@/shared/types';
import { ArrowForward, CheckCircleOutlineOutlined, Description, ExpandMore, HelpOutlineOutlined, Search, ThumbDownOutlined, ThumbUpOutlined } from '@mui/icons-material';
import { Accordion, AccordionDetails, AccordionSummary, Avatar, Box, Button, FormControlLabel, IconButton, InputAdornment, ListItem, MenuItem, Paper, Rating, Switch, TextField, Typography } from '@mui/material';
import { selectAccount, useAppDispatch, useAppSelector } from '@shared/store';
import { motion } from 'framer-motion';
import { useGetCounselorAppointmentsManagementQuery, useGetCounselorQuestionCardsManagementQuery } from '../counselors-api';
import { useNavigate, useParams } from 'react-router-dom';
import { SyntheticEvent, useState } from 'react'
import { ContentLoading, ExpandableText, FeedbackItem, Heading, ItemMenu, openDialog } from '@/shared/components';
import { motionVariants } from '@/shared/configs';
import dayjs from 'dayjs';
import { AppointmentDetail, QnaDetail } from '@/shared/pages';
import { firstDayOfMonth, lastDayOfMonth } from '@/shared/constants';


const CounselorRecentQuestionFeedbacks = ({ counselorId }: { counselorId?: string }) => {
  const { id: routeId } = useParams()
  const id = counselorId || routeId
  // const { data: counselorFeedbacksData, isLoading } = useGetCounselorFeedbacksQuery({ counselorId: Number(id) })
  const { data: appointmentsData, isLoading } = useGetCounselorQuestionCardsManagementQuery({
    from: firstDayOfMonth,
    to: lastDayOfMonth,
    counselorId: Number(id),
    size: 9999,
  });
  const counselorAppointmentsWithFeedback = appointmentsData?.content.data?.filter(item => item.feedback)
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
      <Typography className="font-semibold text-2xl">Recent Q&A Feedbacks</Typography>
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
                      feedback={item.feedback}
                      profile={item.student.profile}
                      handleOpenDetail={() =>
                        dispatch(openDialog({
                          children: <QnaDetail questionCard={item} />
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

export default CounselorRecentQuestionFeedbacks