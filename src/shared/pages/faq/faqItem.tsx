import { ExpandableText, NavLinkAdapter, UserLabel, openDialog, RenderHTML, BackdropLoading, openDrawer } from '@/shared/components';
import { counselingTypeLabel, roles, statusColor } from '@/shared/constants';
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
  Divider,
  Paper,
  Typography,
  styled
} from '@mui/material';
import { motion } from 'framer-motion';
import { ContributedQuestionCard, useDeleteContributedQuestionCardByIdMutation } from './faq-api';
import { selectAccount, useAppDispatch, useAppSelector } from '@shared/store';
import { CounselorView } from '..';
import dayjs from 'dayjs';
import { useAlertDialog, useConfirmDialog } from '@/shared/hooks';
import { openCounselorView } from '@/features/students/students-layout-slice';


export const StyledAccordionSummary = styled(AccordionSummary)({
  display: 'flex',
  alignItems: 'flex-start',  // Align content at the top
});

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};


const FaqItem = ({ contributedQuestion }: { contributedQuestion: ContributedQuestionCard }) => {
  const dispatch = useAppDispatch()
  const account = useAppSelector(selectAccount)
  const isMyQna = account.profile.id === contributedQuestion.counselor.id;
  const isStudent = account.role === roles.STUDENT
  const [deleteQuestion, { isLoading: isDeletingQuestion }] = useDeleteContributedQuestionCardByIdMutation();

  const handleDeleteQuestion = () => {
    useConfirmDialog({
      title: 'Confirm deleting the question?',
      content: 'This action will permanently delete the question and cannnot be undone',
      confirmButtonFunction: () => {
        deleteQuestion(contributedQuestion.id)
          .unwrap()
          .then(() => {
            useAlertDialog({
              title: 'Question was deleted successfully',
              dispatch: dispatch,
              color: 'success'
            });
          })
          .catch(() => {
            useAlertDialog({
              title: 'Failed to delete question',
              dispatch: dispatch,
              color: 'error'
            });
          })
      },
      dispatch,
    });
  }


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
              <div className='flex items-center flex-1 gap-8'>
                <Typography className='w-full text-lg font-semibold'>
                  {contributedQuestion.title}
                </Typography>
              </div>
              <div className='flex items-center gap-8'>
                <UserLabel
                  label='Contributed by'
                  profile={contributedQuestion.counselor.profile}
                  email={contributedQuestion.counselor?.email}
                  onClick={() => {
                    dispatch(openDrawer({
                      children: <CounselorView
                        id={contributedQuestion.counselor.id.toString()}
                        shouldShowBooking={false}
                      />,
                    }))
                  }}
                />
                <span className='text-text-secondary' >•</span>
                <Typography color='textSecondary'>{`${dayjs(contributedQuestion.createdDate).format('YYYY-MM-DD HH:mm:ss')}`}</Typography>
              </div>
              <div className='flex gap-8'>
                <Chip
                  label={counselingTypeLabel[contributedQuestion.category.type  ]}
                  color={'secondary'}
                  size='small'
                  variant='outlined'
                />
                <Chip
                  label={contributedQuestion.category.name}
                  color={'secondary'}
                  size='small'
                />

              </div>

            </div>
          </AccordionSummary>

          <AccordionDetails className='flex flex-col gap-8'>
            {RenderHTML(contributedQuestion.question)}
            <Divider />
            <Typography className='font-semibold' color='textSecondary'>Answer</Typography>
            {RenderHTML(contributedQuestion.answer)}
          </AccordionDetails>

          <div>
            {
              isMyQna ?
                <Box className='flex justify-end w-full gap-8 px-16 py-8 bg-primary-light/5 '>
                  <Button variant='outlined' size='small' color='secondary' startIcon={<Delete />}
                    onClick={handleDeleteQuestion}
                  >
                    Delete
                  </Button>
                  <Button variant='contained' size='small' color='secondary' startIcon={<Edit />}
                    component={NavLinkAdapter}
                    to={`edit/${contributedQuestion.id}`}
                  >
                    Edit
                  </Button>
                </Box>
                : <Box className='flex justify-end w-full gap-8 px-16 py-8 bg-primary-light/5 '>
                  {/* <Button variant='outlined' size='small' color='secondary' startIcon={<Flag />}>Report</Button>
                  <Button variant='outlined' size='small' color='secondary' startIcon={<Feedback />}>Give feedback</Button> */}
                </Box>
            }
          </div>

        </Accordion>
      </Paper>
      {isDeletingQuestion && <BackdropLoading />}
    </motion.div>
  );
};

export default FaqItem;
