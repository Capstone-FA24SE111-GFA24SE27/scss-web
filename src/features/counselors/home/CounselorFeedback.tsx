import { Role } from '@/shared/types';
import { ArrowForward, CheckCircleOutlineOutlined, Description, ExpandMore, HelpOutlineOutlined, Search, ThumbDownOutlined, ThumbUpOutlined } from '@mui/icons-material';
import { Accordion, AccordionDetails, AccordionSummary, Avatar, Box, Button, FormControlLabel, IconButton, InputAdornment, ListItem, MenuItem, Paper, Rating, Switch, TextField, Typography } from '@mui/material';
import { selectAccount, useAppDispatch, useAppSelector } from '@shared/store';
import { motion } from 'framer-motion';
import { useGetCounselorFeedbacksQuery } from '@/features/managers/management/counselors/counselors-api';
import { useNavigate, useParams } from 'react-router-dom';
import { SyntheticEvent, useState } from 'react'
import { ContentLoading, ExpandableText, Heading, ItemMenu, openDialog } from '@/shared/components';
import { motionVariants } from '@/shared/configs';
import dayjs from 'dayjs';
import { AppointmentDetail } from '@/shared/pages';
import { openStudentView } from '../counselors-layout-slice';


const CounselorFeedbackTab = () => {
  const account = useAppSelector(selectAccount)
  const id = account?.profile.id
  const { data: counselorFeedbacksData, isLoading } = useGetCounselorFeedbacksQuery({ counselorId: Number(id) })
  const counselorFeedbacks = counselorFeedbacksData?.content?.data.slice(0, 6)
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
            <div className='grid grid-cols-3 gap-16 '>
              {counselorFeedbacks?.map((feedback) => (
                <motion.div
                  variants={motionVariants.item}
                  key={feedback.id}
                >
                  <Paper className='bg-background-paper flex justify-between items-start shadow '>
                    <div className='flex gap-16 items-start p-16 '>
                      <Avatar
                        className='size-48'
                        alt={feedback.appointment.studentInfo.profile.fullName}
                        src={feedback.appointment.studentInfo?.profile.avatarLink}
                      />
                      <div className='flex flex-col gap-4'>
                        <Typography
                          className='font-semibold cursor-pointer hover:underline'
                          onClick={() => dispatch(openStudentView(feedback.appointment.studentInfo?.profile.id.toString()))}
                        >{feedback.appointment.studentInfo?.profile.fullName}</Typography>
                        <Typography className='text-text-disabled font-normal text-sm'>{dayjs(feedback.createdAt).format('YYYY-MM-DD HH:mm:ss')}</Typography>
                        <Rating value={feedback.rating} readOnly size='small'/>
                        <div className='flex-1 '>
                          <ExpandableText text={feedback.comment} limit={80} />
                        </div>
                      </div>
                    </div>
                    <ListItem
                      className='bg-black p-0 mt-32 w-0'
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

export default CounselorFeedbackTab