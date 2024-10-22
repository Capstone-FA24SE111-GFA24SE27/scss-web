import { Role } from '@/shared/types';
import { ArrowForward, CheckCircleOutlineOutlined, ExpandMore, HelpOutlineOutlined, Search, ThumbDownOutlined, ThumbUpOutlined } from '@mui/icons-material';
import { Accordion, AccordionDetails, AccordionSummary, Avatar, Box, Button, FormControlLabel, IconButton, InputAdornment, ListItem, MenuItem, Paper, Rating, Switch, TextField, Typography } from '@mui/material';
import { selectAccount, useAppSelector } from '@shared/store';
import { motion } from 'framer-motion';
import { useGetCounselorFeedbacksQuery } from '../counselors-api';
import { useNavigate, useParams } from 'react-router-dom';
import { SyntheticEvent, useState } from 'react'
import { ContentLoading, ExpandableText, Heading } from '@/shared/components';
import { motionVariants } from '@/shared/configs';
import dayjs from 'dayjs';


const QuestionBoard = () => {
  const role: Role = useAppSelector(selectAccount)?.role
  const { id } = useParams()
  const { data: counselorFeedbacksData, isLoading } = useGetCounselorFeedbacksQuery({ counselorId: Number(id) })
  const counselorFeedbacks = counselorFeedbacksData?.content?.data


  const [expanded, setExpanded] = useState<number | boolean>(false);

  const toggleAccordion = (panel: number) => (_: SyntheticEvent, _expanded: boolean) => {
    setExpanded(_expanded ? panel : false);
  };
  const navigate = useNavigate()


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
    <div className=''>
      {
        counselorFeedbacks?.length > 0 && (
          <motion.div
            variants={motionVariants.container}
            initial="hidden"
            animate="show"
            className=''
          >
            <div className='grid grid-cols-3 gap-16'>
              {counselorFeedbacks?.map((feedback) => (
                <motion.div
                  variants={motionVariants.item}
                  key={feedback.id}
                >
                  <Paper className='bg-background-paper flex justify-between p-16 items-start shadow'>
                    <div className='flex gap-16 items-start'>
                      <Avatar
                        className='size-32'
                        alt={feedback.appointment.studentInfo.profile.fullName}
                        src={feedback.appointment.studentInfo?.profile.avatarLink}
                      />
                      <div>
                        <Typography className='font-semibold'>{feedback.appointment.studentInfo?.profile.fullName}<span className='text-text-disabled font-normal text-sm pl-8'>{ dayjs(feedback.createdAt).format('YYYY-MM-DD HH:mm:ss')}</span></Typography>
                        <Rating value={feedback.rating} readOnly/>
                        <ExpandableText text={feedback.comment} limit={300} />
                      </div>
                    </div>
                  </Paper>

                </motion.div>
              ))
              }
            </div >
          </motion.div >
        )
      }
    </div >
  )
}

export default QuestionBoard