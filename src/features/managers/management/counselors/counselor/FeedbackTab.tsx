import { Role } from '@/shared/types';
import { ArrowForward, CheckCircleOutlineOutlined, Description, ExpandMore, HelpOutlineOutlined, Search, ThumbDownOutlined, ThumbUpOutlined } from '@mui/icons-material';
import { Accordion, AccordionDetails, AccordionSummary, Avatar, Box, Button, Divider, FormControlLabel, IconButton, InputAdornment, ListItem, MenuItem, Paper, Rating, Switch, TextField, Typography } from '@mui/material';
import { selectAccount, useAppDispatch, useAppSelector } from '@shared/store';
import { motion } from 'framer-motion';
import { useGetCounselorFeedbacksQuery, useGetCounselorQnaFeedbacksQuery } from '../counselors-api';
import { useNavigate, useParams } from 'react-router-dom';
import { ChangeEvent, SyntheticEvent, useState } from 'react'
import { ContentLoading, ExpandableText, FeedbackItem, Heading, ItemMenu, Pagination, SubHeading, openDialog } from '@/shared/components';
import { motionVariants } from '@/shared/configs';
import dayjs from 'dayjs';
import { AppointmentDetail } from '@/shared/pages';


const FeedbackTab = () => {
  const role: Role = useAppSelector(selectAccount)?.role
  const { id } = useParams()
  const { data: counselorFeedbacksData, isLoading } = useGetCounselorFeedbacksQuery({ counselorId: Number(id) })
  const counselorFeedbacks = counselorFeedbacksData?.content?.data

  const { data: counselorQnaFeedbacksData, isLoading: isLoadingQnaFeedback } = useGetCounselorQnaFeedbacksQuery({ counselorId: Number(id) })
  const counselorQnaFeedbacks = counselorQnaFeedbacksData?.content?.data

  const dispatch = useAppDispatch()
  const [page, setPage] = useState(1);

  const handlePageChange = (event: ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };
  if (isLoading) {
    return <ContentLoading />
  }

  if (!counselorFeedbacks?.length) {
    return (
      <div className='text-center p-32'>
        <Typography variant='h5' className='text-text-disabled'>No feedbacks found</Typography>
      </div>

    )
  }
  return (
    <div className='grid grid-cols-2 gap-16 divide-x-2'>

      <div className='space-y-16'>
        <SubHeading title='Appointment Feedbacks' />
        {
          counselorFeedbacks?.length > 0 && (
            <motion.div
              variants={motionVariants.container}
              initial="hidden"
              animate="show"
              className=''
            >
              <div className='grid grid-cols-2 md:grid-cols-3 gap-16'>
                {counselorFeedbacks?.map((feedback) => (
                  <FeedbackItem
                    feedback={feedback?.appointment?.appointmentFeedback}
                    profile={feedback?.appointment?.studentInfo?.profile}
                  />
                ))
                }
              </div>
            </motion.div >
          )
        }
        <Pagination
          page={page}
          count={counselorFeedbacksData?.content.totalPages}
          handleChange={handlePageChange}
        />
      </div >
      <div className='space-y-16 pl-16'>
        <SubHeading title='Qna Feedbacks' />
        {
          counselorQnaFeedbacks?.length > 0 && (
            <motion.div
              variants={motionVariants.container}
              initial="hidden"
              animate="show"
              className=''
            >
              <div className='grid grid-cols-2 md:grid-cols-3 gap-16'>
                {counselorQnaFeedbacks?.map((feedback) => (
                  <FeedbackItem
                    feedback={feedback?.questionCard?.feedback}
                    profile={feedback?.questionCard?.student?.profile}
                  />
                ))
                }
              </div>
            </motion.div >
          )
        }
        <Pagination
          page={page}
          count={counselorFeedbacksData?.content.totalPages}
          handleChange={handlePageChange}
        />
      </div >
    </div>

  )
}

export default FeedbackTab