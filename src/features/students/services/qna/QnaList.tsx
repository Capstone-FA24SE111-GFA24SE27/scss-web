

import { NavLinkAdapter } from '@/shared/components';
import { ArrowForward, ArrowRightAlt, ChatBubble, ChatBubbleOutline, CheckCircleOutlineOutlined, ExpandMore, HelpOutlineOutlined, ThumbDown, ThumbDownOutlined, ThumbUp, ThumbUpOutlined } from '@mui/icons-material';
import { Accordion, AccordionDetails, AccordionSummary, Avatar, Box, Button, Chip, Divider, FormControlLabel, IconButton, MenuItem, Paper, Switch, TextField, Typography } from '@mui/material';
import { motion } from 'framer-motion';
import { SyntheticEvent, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { Question, useGetQuestionsQuery, useReadMessageMutation } from './qna-api';
import { selectAccount, useAppSelector } from '@shared/store';
import { statusColor } from '@/shared/constants';


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

  useEffect(()=>{
    console.log(qnaData)
  },[qnaData])

  return (
    qnaList?.length > 0 && (
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className='w-full p-32 space-y-16'
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
            className='flex justify-end flex-1'
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
                          <Chip label={qna.status} color={statusColor[qna.status]} size='small' />
                          {qna.closed && <Chip label={'Closed'} color={'warning'} size='small' />}
                        </div>
                        <div className="flex items-center flex-1 gap-8">
                          {/* <Divider orientation='vertical' /> */}
                          {qna.answer
                            ? <CheckCircleOutlineOutlined color='success' />
                            : <HelpOutlineOutlined color='disabled' />}

                          <Typography className="w-full pr-8 font-semibold">{qna.content}</Typography>
                        </div>
                      </div>

                    </AccordionSummary>

                    <AccordionDetails className='flex'>
                      <div className='flex flex-col gap-8'>
                        {qna.counselor &&
                          <Button className='flex items-center justify-start gap-16 px-16 w-fit'>
                            <Avatar
                              className='size-32'
                              alt={qna.counselor?.profile.fullName}
                              src={qna.counselor?.profile.avatarLink} />
                            <div>
                              <Typography className='text-sm font-semibold'>{qna.counselor?.profile.fullName}</Typography>
                              <Typography className='text-sm text-start' color='textSecondary'>{qna.counselor?.expertise?.name}</Typography>
                            </div>
                          </Button>}
                        {qna.answer ?
                          <div>
                            <Typography className='px-8 text-sm italic' color='textDisabled'>Answered at 4:20 11/10/2024</Typography>
                            <Typography className="px-8">{qna.answer}</Typography>
                          </div>
                          : <div>
                            <Typography className="px-8 italic" color='textDisabled'>{'The counselor has not answer yet'}</Typography>
                          </div>}
                      </div>
                    </AccordionDetails>
                    <Box
                      className='flex justify-between w-full px-16 py-8 bg-primary-light/5 '
                    >
                      <div className='flex items-start w-112'>
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