import { ExpandableText, NavLinkAdapter, UserLabel, openDialog, RenderHTML } from '@/shared/components';
import { statusColor } from '@/shared/constants';
import {
  ChatBubbleOutline,
  CheckCircleOutlineOutlined,
  Close,
  Delete,
  Edit,
  ExpandMore,
  Feedback,
  Flag,
  HelpOutlineOutlined,
  Share,
} from '@mui/icons-material';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Chip,
  Paper,
  Typography,
  styled
} from '@mui/material';
import { motion } from 'framer-motion';
import { ContributedQuestionCard } from './question-board-api';
import { useAppDispatch } from '@shared/store';
import { CounselorView } from '..';


export const StyledAccordionSummary = styled(AccordionSummary)({
  display: 'flex',
  alignItems: 'flex-start',  // Align content at the top
});

type Props = {
  contributedQuestion: ContributedQuestionCard;
};
const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};


const ContributedQuestionItem = (props: Props) => {
  const { contributedQuestion } = props;
  const dispatch = useAppDispatch()

  return (
    <motion.div variants={item}>
      <Paper className='overflow-hidden shadow'>
        <Accordion
          className='shadow'
        >
          <AccordionSummary
            expandIcon={<ExpandMore sx={{ fontSize: '3rem', height: '6rem' }} />}
          >
            <div className='flex flex-col gap-8'>
              <div className='flex gap-8'>
                <Chip
                  label={
                    contributedQuestion.category.type === 'ACADEMIC'
                      ? 'ACADEMIC'
                      : 'NON-ACADEMIC'
                  }
                  color={'secondary'}
                  size='small'
                  variant='outlined'
                />
                <Chip
                  label={contributedQuestion.category.name}
                  color={'secondary'}
                  size='small'
                />
                <Chip
                  label={contributedQuestion.status}
                  color={statusColor[contributedQuestion.status as string]}
                  size='small'
                />

              </div>
              <div>
                <UserLabel
                  label='Contributed by'
                  profile={contributedQuestion.counselor.profile}
                  email={contributedQuestion.counselor?.email}
                  onClick={() => {
                    dispatch(openDialog({
                      children: <CounselorView
                        id={contributedQuestion.counselor.id.toString()}
                        shouldShowBooking={false}
                      />
                    }))
                  }}
                />
              </div>
              <div className='flex items-center flex-1 gap-8'>
                <Typography className='w-full pr-8 font-semibold'>
                  {/* {contributedQuestion.content} */}
                  {RenderHTML(contributedQuestion.question)}
                </Typography>
              </div>
            </div>
          </AccordionSummary>

          <AccordionDetails className='flex'>
            <div className='flex flex-col gap-8'>
              {!contributedQuestion.counselor ? (
                <Typography
                  className='px-8 italic'
                  color='textDisabled'
                >
                  {'No counselor has taken this question'}
                </Typography>
              ) : contributedQuestion.answer ? (
                <div>
                  {/* <Typography className='px-8 text-sm italic' color='textDisabled'>Answered at 4:20 11/10/2024</Typography> */}
                  <ExpandableText
                    className='flex flex-wrap w-full overflow-hidden break-all text-wrap'
                    text={contributedQuestion.answer}
                    limit={100}
                  />
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
          <Box className='flex justify-end w-full gap-8 px-16 py-8 bg-primary-light/5 '>
            <Button variant='outlined' size='small' color='secondary' startIcon={<Flag />}>Report</Button>
            <Button variant='outlined' size='small' color='secondary' startIcon={<Share />}>Share</Button>
            <Button variant='outlined' size='small' color='secondary' startIcon={<Feedback />}>Give feedback</Button>
          </Box>
        </Accordion>
      </Paper>
    </motion.div>
  );
};

export default ContributedQuestionItem;
