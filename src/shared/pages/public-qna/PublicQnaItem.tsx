import { ExpandableText, NavLinkAdapter, UserLabel, openDialog, RenderHTML } from '@/shared/components';
import { roles, statusColor } from '@/shared/constants';
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
import { useAppDispatch, useAppSelector } from '@shared/store';
import { CounselorView } from '..';
import { Question } from '@/shared/types';
import dayjs from 'dayjs';
import { selectAccount } from '@shared/store';
import { openCounselorView } from '@/features/students/students-layout-slice';


export const StyledAccordionSummary = styled(AccordionSummary)({
  display: 'flex',
  alignItems: 'flex-start',  // Align content at the top
});

type Props = {
  publicQna: Question;
};
const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};


const PublicQnaItem = (props: Props) => {
  const { publicQna } = props;
  const dispatch = useAppDispatch()
  const account = useAppSelector(selectAccount)
  const isStudent = account.role === roles.STUDENT

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
                    publicQna.questionType === 'ACADEMIC'
                      ? 'Academic'
                      : 'Non-academic'
                  }
                  color={'secondary'}
                  size='small'
                  variant='outlined'
                />

                <span className='text-text-secondary' >Created at</span>
                <Typography color='textSecondary'>{`${dayjs(publicQna.createdDate).format('YYYY-MM-DD HH:mm:ss')}`}</Typography>

              </div>
              <div>
                <UserLabel
                  label='Published by'
                  profile={publicQna.counselor.profile}
                  email={publicQna.counselor?.email}
                  onClick={() => {
                    if (isStudent) {
                      dispatch(openCounselorView(publicQna?.counselor?.profile.id.toString()))
                      return
                    }
                    dispatch(openDialog({
                      children: <CounselorView
                        id={publicQna.counselor.id.toString()}
                        shouldShowBooking={false}
                      />
                    }))
                  }}
                />
              </div>
              <div className='flex items-center flex-1 gap-8'>
                <Typography className='w-full pr-8 font-semibold'>
                  {publicQna.title}
                </Typography>
              </div>
            </div>
          </AccordionSummary>

          <AccordionDetails className='flex flex-col gap-8'>
            {RenderHTML(publicQna.content)}
            <Divider />
            <Typography className='font-semibold' color='textSecondary'>Answer</Typography>
            {RenderHTML(publicQna.answer)}
          </AccordionDetails>
          <Box className='flex justify-end w-full gap-8 px-16 py-8 bg-primary-light/5 '>
            <Button variant='outlined' size='small' color='secondary' startIcon={<Flag />}>Report</Button>
            <Button variant='outlined' size='small' color='secondary' startIcon={<Feedback />}>Give feedback</Button>
          </Box>
        </Accordion>
      </Paper>
    </motion.div>
  );
};

export default PublicQnaItem;
