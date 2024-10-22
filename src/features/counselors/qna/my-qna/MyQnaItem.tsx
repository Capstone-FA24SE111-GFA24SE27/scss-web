import { NavLinkAdapter } from '@/shared/components';
import { ArrowForward, ArrowRightAlt, ChatBubble, ChatBubbleOutline, CheckCircleOutlineOutlined, Edit, EditNote, ExpandMore, HelpOutlineOutlined, ThumbDown, ThumbDownOutlined, ThumbUp, ThumbUpOutlined } from '@mui/icons-material';
import { Accordion, AccordionDetails, AccordionSummary, Avatar, Box, Button, Chip, Divider, FormControlLabel, IconButton, MenuItem, Paper, Switch, TextField, Typography } from '@mui/material';
import { motion } from 'framer-motion';
import { ChangeEvent, SyntheticEvent, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { Question, useAnswerQuestionMutation, useGetMyQuestionsQuery, useReadMessageMutation } from '../qna-api';


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

const MyQnaItem = ({ qna }: { qna: Question }) => {

  const [expanded, setExpanded] = useState<number | boolean>(!qna.answer);

  const toggleAccordion = (panel: number) => (_: SyntheticEvent, _expanded: boolean) => {
    setExpanded(_expanded ? panel : false);
  };
  const navigate = useNavigate()

  const [answer, setAnswer] = useState('')

  const [editedAnswer, setEditedAnswer] = useState(qna.answer || '')

  const [editMode, setEditMode] = useState(false)

  const [answerQuestion, { isLoading: submitingAnswer }] = useAnswerQuestionMutation()
  const [editAnswer, { isLoading: editingAnswer }] = useAnswerQuestionMutation()

  const handleAnswerQuestion = (questionId: number) => {
    answerQuestion({
      questionCardId: questionId,
      content: answer
    })
  }

  const editAnswerQuestion = (questionId: number) => {
    editAnswer({
      questionCardId: questionId,
      content: editedAnswer
    })
    setAnswer(editedAnswer)
    setEditedAnswer(editedAnswer || '')
    setEditMode(false)
  }

  const [readMessage] = useReadMessageMutation()
  const handleSelectChat = () => {
    readMessage(qna.chatSession.id)
    navigate(`/qna/conversations/${qna.id}`)
  }

  const handleChat = () => {
    readMessage(qna.chatSession.id)
    navigate(`${qna.id}`)
  }
  return (
    <motion.div
      variants={item}
    >
      <Paper className='overflow-hidden'>
        <Accordion
          className='shadow'
          expanded={expanded === qna.id || expanded === true}
          onChange={toggleAccordion(qna.id)}
        >
          <AccordionSummary expandIcon={<ExpandMore />} className=''>
            <div className="flex items-center gap-8">
              {/* <Chip label={qna.type === 'Non-academic' ? 'Non-Academic' : 'Academic'} color={qna.type === 'Non-academic' ? 'info' : 'success'} className='w-112'/> */}
              {/* <Typography className='w-112 font-semibold' color={qna.questionType === 'ACADEMIC' ? 'info' : 'warning'}>{qna.questionType === 'ACADEMIC' ? 'Academic' : 'Non-Academic'}</Typography> */}
              <Button className='flex gap-16 items-center'>
                <Avatar
                  className='size-32  '
                  alt={qna.student?.profile.fullName}
                  src={qna.student?.profile.avatarLink}
                />
                <div>
                  <Typography className='font-semibold'>{qna.student?.profile.fullName}</Typography>
                </div>
              </Button>
              {
                qna.answer
                  ? <CheckCircleOutlineOutlined color='success' />
                  : <HelpOutlineOutlined color='disabled' />
              }
              <Typography className="pr-8">{qna.content}</Typography>
            </div>
          </AccordionSummary>

          <AccordionDetails className='flex'>
            <div className='flex flex-col gap-8 w-full px-16'>
              {
                qna.answer ?
                  editMode ?
                    <div>
                      <TextField
                        label="My answer"
                        placeholder="Enter a keyword..."
                        variant="outlined"
                        value={editedAnswer}
                        onChange={(event: ChangeEvent<HTMLInputElement>) => {
                          setEditedAnswer(event.target.value);
                        }}
                        multiline
                        minRows={4}
                        fullWidth
                        slotProps={{
                          inputLabel: {
                            shrink: true,
                          }
                        }}
                      />
                      <div className='w-full flex justify-end gap-8'>
                        <Button
                          variant='outlined'
                          className='mt-8'
                          color='primary'
                          size='small'
                          onClick={() => setEditMode(false)}
                        >
                          Cancel
                        </Button>
                        <Button
                          variant='contained'
                          color='secondary'
                          className='mt-8'
                          size='small'
                          disabled={editingAnswer || !editedAnswer.length || editedAnswer == answer}
                          onClick={() => editAnswerQuestion(qna.id)}>
                          Submit
                        </Button>
                      </div>
                    </div>
                    : <div>
                      <Typography className='text-sm italic px-8' color='textDisabled'>Answered at 4:20 11/10/2024</Typography>
                      <div className='flex items-center'>
                        <Typography className="px-8">{qna.answer}</Typography>
                        <IconButton size='small' onClick={() => setEditMode(true)}>
                          <EditNote />
                        </IconButton>
                      </div>
                    </div>

                  : <div>
                    <TextField
                      label="My answer"
                      placeholder="Enter a keyword..."
                      variant="outlined"
                      value={answer}
                      onChange={(event: ChangeEvent<HTMLInputElement>) => {
                        setAnswer(event.target.value);
                      }}
                      multiline
                      minRows={4}
                      fullWidth
                      slotProps={{
                        inputLabel: {
                          shrink: true,
                        }
                      }}
                    />
                    <div className='w-full flex justify-end'>
                      <Button
                        variant='contained'
                        color='secondary'
                        className='mt-8'
                        size='small'
                        disabled={submitingAnswer || !answer.length}
                        onClick={() => handleAnswerQuestion(qna.id)}>
                        Submit
                      </Button>
                    </div>
                  </div>
              }
            </div>
          </AccordionDetails>
          <Box
            className='bg-primary-light/5 w-full py-8 flex justify-end px-16 cursor-pointer gap-16'
          >
            <Button
              variant='outlined'
              color='secondary'
              onClick={handleSelectChat}
              endIcon={<ArrowForward />}
            >
              Go to conversations
            </Button>
            <Button
              variant='contained'
              color='secondary'
              onClick={handleChat}
              endIcon={<ChatBubbleOutline />}
            >
              Chat
            </Button>
          </Box>
        </Accordion>
      </Paper >
    </motion.div>


  );
}


export default MyQnaItem