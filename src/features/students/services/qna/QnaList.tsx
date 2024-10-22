

import { ContentLoading, NavLinkAdapter } from '@/shared/components';
import { ArrowForward, ArrowRightAlt, ChatBubble, ChatBubbleOutline, CheckCircleOutlineOutlined, ExpandMore, HelpOutlineOutlined, Search, ThumbDown, ThumbDownOutlined, ThumbUp, ThumbUpOutlined } from '@mui/icons-material';
import { Accordion, AccordionDetails, AccordionSummary, Avatar, Box, Button, Chip, Divider, FormControlLabel, IconButton, InputAdornment, MenuItem, Paper, Switch, TextField, Typography } from '@mui/material';
import { motion } from 'framer-motion';
import { SyntheticEvent, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { Question, useGetQuestionsQuery, useReadMessageMutation } from './qna-api';
import { selectAccount, useAppSelector } from '@shared/store';


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
  const { data: qnaData, isLoading, refetch } = useGetQuestionsQuery()
  const qnaList = qnaData?.content?.data || []

  const account = useAppSelector(selectAccount)

  const [openAnswers, setOpenAnswers] = useState(false);

  const [expanded, setExpanded] = useState<number | boolean>(false);

  const toggleAccordion = (panel: number) => (_: SyntheticEvent, _expanded: boolean) => {
    setExpanded(_expanded ? panel : false);
  };
  const navigate = useNavigate()
  const [readMessage] = useReadMessageMutation()

  const handleSelectChat = (qnaItem: Question) => {
    readMessage(qnaItem.chatSession?.id)
    navigate(`conversations/${qnaItem.id}`)
  }


  const countUnreadMessages = (qnaItem: Question) => {
    const readMessages = qnaItem?.chatSession?.messages.filter((message) => message.sender.id !== account.id && !message.read)
    return readMessages?.length
  }

  useEffect(() => {
    refetch()
  }, []);


  if (isLoading) {
    return <ContentLoading />
  }

  if (!qnaList.length) {
    return (
      <div className='text-center p-32 text-text-disabled'>
        <Typography variant='h5' className='text-text-disabled'>No questions found</Typography></div>
    )
  }

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
              },
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <Search />
                  </InputAdornment>
                )
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

        <div className='space-y-16 relative'>
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

                        <div className='flex w-full gap-16'>
                          <Chip label={qna.questionType === 'ACADEMIC' ? 'Academic' : 'Non-Academic'} color={qna.questionType === 'ACADEMIC' ? 'info' : 'warning'} size='small' />
                          <Chip label={'Verified'} color={'success'} size='small' />
                          {qna.closed && <Chip label={'Closed'} color={'warning'} size='small' />}
                          {
                            countUnreadMessages(qna) ? <Chip label={countUnreadMessages(qna)} size='small' color='secondary' /> : ''
                          }
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
                          <div className='flex gap-16 items-center justify-start w-fit '>
                            <Avatar
                              className='size-32'
                              alt={qna.counselor?.profile.fullName}
                              src={qna.counselor?.profile.avatarLink} />
                            <div>
                              <Typography className='font-semibold text-sm'>{qna.counselor?.profile.fullName}</Typography>
                              <Typography className='text-sm text-start' color='textSecondary'>{qna.counselor?.expertise?.name || qna.counselor?.specialization?.name}</Typography>
                            </div>
                          </div>}
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
                        variant='contained'
                        color='secondary'
                        startIcon={<ChatBubbleOutline />}
                        onClick={() => handleSelectChat(qna)}
                        disabled={!qna.counselor}
                        className='space-x-4'
                      >
                        Chat
                        {
                          countUnreadMessages(qna) ? <Chip label={countUnreadMessages(qna)} size='small' color='secondary' /> : ''
                        }
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