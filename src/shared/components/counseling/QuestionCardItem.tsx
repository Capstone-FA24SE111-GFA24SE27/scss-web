import { ExpandableText, RenderHTML, UserLabel, openDrawer } from '@/shared/components';
import { Question } from '@/shared/types';
import {
  CheckCircleOutlineOutlined,
  ExpandMore,
  HelpOutlineOutlined,
  Lock,
  ThumbUpOutlined
} from '@mui/icons-material';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Chip,
  Divider,
  Paper,
  Rating,
  Typography
} from '@mui/material';
import { motion } from 'framer-motion';
import { SyntheticEvent } from 'react';

import { difficultyColor, statusColor } from '@/shared/constants';
import { useAppDispatch } from '@shared/store';
import { StudentView } from '@/shared/pages';
import dayjs from 'dayjs';

type Props = {
  qna: Question;
};
const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

const QuestionCardItem = (props: Props) => {
  const { qna } = props;
  const dispatch = useAppDispatch()
  return (
    <motion.div variants={item}>
      <Paper className='overflow-hidden shadow'>
        <Accordion
          className='shadow'
        >
          <AccordionSummary expandIcon={<ExpandMore />}>
            <div className='flex flex-col gap-8'>
              <div className='flex justify-between'>
                <Typography className='w-full pr-8 font-semibold text-lg'>
                  {qna.title}
                </Typography>
              </div>
              <div className='flex gap-8 items-center'>
                <UserLabel
                  profile={qna?.student?.profile}
                  label='Questioned by'
                  email={qna?.student.email}
                  onClick={() => {
                    dispatch(
                      openDrawer({
                        children: <StudentView id={qna?.student?.id.toString()} />
                      })
                    );
                  }}
                />
                <span className='text-text-secondary' >•</span>
                <Typography color='textSecondary'>{`${dayjs(qna.createdDate).format('YYYY-MM-DD HH:mm:ss')}`}</Typography>
              </div>
              <div className='flex gap-8'>
                <Chip
                  label={qna.difficultyLevel}
                  color={difficultyColor[qna.difficultyLevel as string]}
                  size='small'
                />
                <Chip
                  label={qna.status.toLocaleLowerCase()}
                  color={statusColor[qna.status as string]}
                  size='small'
                  className='capitalize'
                  variant='outlined'
                />
                {qna.answer ? (
                  <Chip icon={<CheckCircleOutlineOutlined />} label='Answered' color='success' size='small' variant='outlined' />
                ) : (
                  <Chip icon={<HelpOutlineOutlined />} label='Not Answered' size='small' variant='outlined' />

                )}

                {/* <Chip label={qna.topic?.name} size='small' /> */}
                {/* {qna.taken && <Chip label={`Taken by ${qna?.counselor.profile.fullName}`} variant='outlined' color={'success'} size='small' />} */}
                {qna.closed && (
                  <Chip
                    icon={<Lock />}
                    label={'Closed'}
                    variant='outlined'
                    size='small'
                  />
                )}
                {
                  qna.accepted && (
                    < Chip
                      icon={<ThumbUpOutlined />}
                      label={`Accepted by ${qna?.student.profile.fullName}`}
                      size='small'
                      variant='filled'
                    />
                  )
                }
              </div>
            </div>

          </AccordionSummary>

          <AccordionDetails className='flex flex-col gap-8'>
            {RenderHTML(qna.content)}
            <Divider />
            <div className='flex flex-col gap-8'>
              {
                qna.counselor && (
                  <UserLabel
                    label='Answered by'
                    profile={qna?.counselor.profile}
                    email={qna?.counselor?.email}
                    onClick={() => {
                      // dispatch(
                      //   openCounselorView(
                      //     qna?.counselor.profile.id.toString()
                      //   )
                      // );
                    }}
                  />
                )
              }
              {!qna.counselor ? (
                <Typography
                  className='px-8 italic'
                  color='textDisabled'
                >
                  {'No counselor has taken this question'}
                </Typography>
              ) : qna.answer ? (
                <div>
                  {/* <Typography className='px-8 text-sm italic' color='textDisabled'>Answered at 4:20 11/10/2024</Typography> */}
                  <Typography className=''>
                    {RenderHTML(qna.answer)}
                  </Typography>
                </div>
              ) : (
                <div>
                  <Typography
                    className='italic'
                    color='textDisabled'
                  >
                    {'The counselor has not answer yet'}
                  </Typography>
                </div>
              )}

              {
                qna.feedback && (
                  <>
                    <Divider />
                    <div className='flex items-start gap-16'>
                      <Typography color='textSecondary' className='pt-2 w-60'>Feedback:</Typography>
                      <div className='flex-1'>
                        <div>
                          <div className='flex items-center gap-8'>
                            <Rating
                              size='medium'
                              value={qna.feedback?.rating}
                              readOnly
                            />
                            <Typography color='text.secondary'>{dayjs(qna.feedback?.createdAt).format('YYYY-MM-DD HH:mm:ss')}</Typography>
                          </div>
                        </div>
                        <ExpandableText className='pl-4 mt-8' text={qna.feedback?.comment} limit={96} />
                      </div>
                    </div>
                  </>
                )
              }
            </div>
          </AccordionDetails>
          <Box className='flex justify-end w-full gap-16 px-16 py-8 bg-primary-light/5 '>

          </Box>
        </Accordion>
      </Paper>
    </motion.div >
  );
};

export default QuestionCardItem;
