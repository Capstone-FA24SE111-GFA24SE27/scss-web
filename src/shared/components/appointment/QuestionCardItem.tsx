import { UserLabel } from '@/shared/components';
import { Question } from '@/shared/types';
import {
  CheckCircleOutlineOutlined,
  ExpandMore,
  HelpOutlineOutlined
} from '@mui/icons-material';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Chip,
  Paper,
  Typography
} from '@mui/material';
import { motion } from 'framer-motion';
import { SyntheticEvent } from 'react';

import { statusColor } from '@/shared/constants';

type Props = {
  qna: Question;
};
const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

const QuestionCardItem = (props: Props) => {
  const { qna } = props;

  return (
    <motion.div variants={item}>
      <Paper className='overflow-hidden shadow'>
        <Accordion
          className='shadow'
        >
          <AccordionSummary expandIcon={<ExpandMore />}>
            <div className='flex flex-col gap-8'>
              <div className='flex gap-8'>
                <Chip
                  label={
                    qna.questionType === 'ACADEMIC'
                      ? 'Academic'
                      : 'Non-Academic'
                  }
                  color={'info'}
                  size='small'
                />
                <Chip
                  label={qna.status}
                  color={statusColor[qna.status as string]}
                  size='small'
                />

                {qna.closed && (
                  <Chip
                    label={'Closed'}
                    variant='outlined'
                    color={'error'}
                    size='small'
                  />
                )}
              </div>
              <div className='flex items-center flex-1 gap-8'>
                {/* <Divider orientation='vertical' /> */}
                {qna.answer ? (
                  <CheckCircleOutlineOutlined color='success' />
                ) : (
                  <HelpOutlineOutlined color='disabled' />
                )}

                <Typography className='w-full pr-8 font-semibold'>
                  {qna.content}
                </Typography>
              </div>

              <UserLabel
                profile={qna?.student?.profile}
                label='Asked by'
                email={qna?.student.email}
                onClick={() => {
                  // dispatch(
                  //   openStudentView(qna?.student.id.toString())
                  // );
                }}
              />
            </div>
            
          </AccordionSummary>

          <AccordionDetails className='flex'>
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
                  <Typography className='px-8'>
                    {qna.answer}
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
            </div>
          </AccordionDetails>
          <Box className='flex justify-end w-full gap-16 px-16 py-8 bg-primary-light/5 '>

          </Box>
        </Accordion>
      </Paper>
    </motion.div>
  );
};

export default QuestionCardItem;
