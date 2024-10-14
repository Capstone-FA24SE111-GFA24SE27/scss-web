

import { NavLinkAdapter } from '@/shared/components';
import { ArrowForward, ArrowRightAlt, ChatBubble, ChatBubbleOutline, CheckCircleOutlineOutlined, ExpandMore, HelpOutlineOutlined, ThumbDown, ThumbDownOutlined, ThumbUp, ThumbUpOutlined } from '@mui/icons-material';
import { Accordion, AccordionDetails, AccordionSummary, Avatar, Box, Button, Chip, Divider, FormControlLabel, IconButton, MenuItem, Paper, Switch, TextField, Typography } from '@mui/material';
import { motion } from 'framer-motion';
import { SyntheticEvent, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { useGetQuestionsQuery } from './qna-api';


const container = {
  show: {
    transition: {
      staggerChildren: 0.04
    }
  }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

const QnaList = () => {
  const [openAnswers, setOpenAnswers] = useState(false);

  const [expanded, setExpanded] = useState<number | boolean>(false);

  const toggleAccordion = (panel: number) => (_: SyntheticEvent, _expanded: boolean) => {
    setExpanded(_expanded ? panel : false);
  };
  const navigate = useNavigate()

  const { data: qnaData } = useGetQuestionsQuery()
  const qnaList = qnaData?.content?.data || []

  return (
    qnaList?.length > 0 && (
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className='p-32 w-full space-y-16'
      >
        <div className='flex gap-16'>
          <TextField
            label="Search for questions"
            placeholder="Enter a keyword..."
            className="w-320"
            variant="outlined"
            slotProps={{
              inputLabel: {
                shrink: true,
              }
            }}
          />
          <TextField
            select
            label="Choose type"
            className="w-200"
            slotProps={{
              inputLabel: {
                shrink: true,
              }
            }}
          >
            <MenuItem value="ALL">All</MenuItem>
            <MenuItem value="ACADEMIC">Academic</MenuItem>
            <MenuItem value="NON-ACADEMIC">Non-Academic</MenuItem>
          </TextField>
          <FormControlLabel
            className='flex-1 flex justify-end'
            label="Open Answers"
            control={
              <Switch
                onChange={(ev) => {
                  setOpenAnswers(ev.target.checked);
                }}
                checked={openAnswers}
                name="hideCompleted"
              />
            }
          />
        </div>

        <div className='space-y-16'>
          {qnaList.map((qna) => {
            return (
              <motion.div
                variants={item}
                key={qna.id}
              >
                <Paper className='overflow-hidden shadow'>
                  <Accordion
                    className='shadow'
                    expanded={openAnswers || expanded === qna.id}
                    onChange={toggleAccordion(qna.id)}
                  >
                    <AccordionSummary expandIcon={<ExpandMore />}>
                      <div className='flex flex-col gap-8'>

                        <div className='flex gap-8'>
                          <Chip label={qna.questionType === 'ACADEMIC' ? 'Academic' : 'Non-Academic'} color={qna.questionType === 'ACADEMIC' ? 'info' : 'warning'} size='small' />
                          <Chip label={'Verified'} color={'success'} size='small' />
                          {qna.closed && <Chip label={'Closed'} color={'warning'} size='small' />}
                        </div>
                        <div className="flex flex-1 items-center gap-8">
                          {/* <Divider orientation='vertical' /> */}
                          {qna.answer
                            ? <CheckCircleOutlineOutlined color='success' />
                            : <HelpOutlineOutlined color='disabled' />}

                          <Typography className="pr-8 font-semibold w-full">{qna.content}</Typography>
                        </div>
                      </div>

                    </AccordionSummary>

                    <AccordionDetails className='flex'>
                      <div className='flex flex-col gap-8'>
                        {qna.counselor &&
                          <Button className='flex gap-16 items-center justify-start w-fit px-16'>
                            <Avatar
                              className='size-32'
                              alt={qna.counselor?.profile.fullName}
                              src={qna.counselor?.profile.avatarLink} />
                            <div>
                              <Typography className='font-semibold text-sm'>{qna.counselor?.profile.fullName}</Typography>
                              <Typography className='text-sm text-start' color='textSecondary'>{qna.counselor?.expertise?.name}</Typography>
                            </div>
                          </Button>}
                        {qna.answer ?
                          <div>
                            <Typography className='text-sm italic px-8' color='textDisabled'>Answered at 4:20 11/10/2024</Typography>
                            <Typography className="px-8">{qna.answer}</Typography>
                          </div>
                          : <div>
                            <Typography className="px-8 italic" color='textDisabled'>{'The counselor has not answer yet'}</Typography>
                          </div>}
                      </div>
                    </AccordionDetails>
                    <Box
                      className='bg-primary-light/5 w-full py-8 flex justify-between px-16 '
                    >
                      <div className='w-112 flex items-start'>
                        <IconButton><ThumbUpOutlined /></IconButton>
                        <IconButton><ThumbDownOutlined /></IconButton>
                      </div>
                      <Button
                        variant='outlined'
                        color='secondary'
                        startIcon={<ChatBubbleOutline />}
                        onClick={() => navigate(`conversations/${qna.id}`)}
                        disabled={!qna.counselor}
                      >
                        Start a conversation
                      </Button>
                    </Box>
                  </Accordion>
                </Paper>
              </motion.div>
            );
          })
          }
        </div >
      </motion.div >
    )

  );
}


export default QnaList