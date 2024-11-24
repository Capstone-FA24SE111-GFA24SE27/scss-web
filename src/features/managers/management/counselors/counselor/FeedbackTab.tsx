import { Role } from '@/shared/types';
import { ArrowForward, CheckCircleOutlineOutlined, Description, ExpandMore, HelpOutlineOutlined, Search, ThumbDownOutlined, ThumbUpOutlined } from '@mui/icons-material';
import { Accordion, AccordionDetails, AccordionSummary, Avatar, Box, Button, FormControlLabel, IconButton, InputAdornment, ListItem, MenuItem, Paper, Rating, Switch, TextField, Typography } from '@mui/material';
import { selectAccount, useAppDispatch, useAppSelector } from '@shared/store';
import { motion } from 'framer-motion';
import { useGetCounselorFeedbacksQuery } from '../counselors-api';
import { useNavigate, useParams } from 'react-router-dom';
import { SyntheticEvent, useState } from 'react'
import { ContentLoading, ExpandableText, Heading, ItemMenu, openDialog } from '@/shared/components';
import { motionVariants } from '@/shared/configs';
import dayjs from 'dayjs';
import { AppointmentDetail } from '@/shared/pages';


const FeedbackTab = () => {
  const role: Role = useAppSelector(selectAccount)?.role
  const { id } = useParams()
  const { data: counselorFeedbacksData, isLoading } = useGetCounselorFeedbacksQuery({ counselorId: Number(id) })
  const counselorFeedbacks = counselorFeedbacksData?.content?.data
  const dispatch = useAppDispatch()

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
                  <Paper className='bg-background-paper flex justify-between items-start shadow'>
                    <div className='flex gap-16 items-start  p-16'>
                      <Avatar
                        className='size-32'
                        alt={feedback.appointment.studentInfo.profile.fullName}
                        src={feedback.appointment.studentInfo?.profile.avatarLink}
                      />
                      <div>
                        <Typography className='font-semibold'>{feedback.appointment.studentInfo?.profile.fullName}</Typography>
                        <Typography className='text-text-disabled font-normal text-sm'>{dayjs(feedback.createdAt).format('YYYY-MM-DD HH:mm:ss')}</Typography>
                        <Rating value={feedback.rating} readOnly />
                        <ExpandableText text={feedback.comment} limit={300} />
                      </div>
                    </div>
                    <ListItem
                      className='bg-black p-0 mt-32'
                      secondaryAction={
                        <ItemMenu
                          menuItems={[
                            {
                              label: 'View Appointment',
                              onClick: () => {
                                dispatch(openDialog({
                                  children: <AppointmentDetail id={feedback.appointment.id.toString()} />
                                }))
                              },
                              icon: <Description fontSize='small' />
                            },
                          ]}
                        />
                      }
                    >

                    </ListItem>
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

export default FeedbackTab