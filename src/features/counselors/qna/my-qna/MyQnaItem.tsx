import { NavLinkAdapter, UserLabel } from '@/shared/components';
import { ArrowForward, ArrowRightAlt, ChatBubble, ChatBubbleOutline, CheckCircleOutlineOutlined, Close, Edit, EditNote, ExpandMore, HelpOutlineOutlined, ThumbDown, ThumbDownOutlined, ThumbUp, ThumbUpOutlined } from '@mui/icons-material';
import { Accordion, AccordionDetails, AccordionSummary, Avatar, Box, Button, Chip, Divider, FormControlLabel, IconButton, MenuItem, Paper, Switch, TextField, Typography } from '@mui/material';
import { motion } from 'framer-motion';
import { ChangeEvent, SyntheticEvent, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { useAnswerQuestionMutation, useCloseQuestionCounselorMutation } from '../qna-api';
import { Question } from '@/shared/types';
import { useAppDispatch } from '@shared/store';
import { openStudentView } from '../../counselors-layout-slice';


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

  const [closeQuestion] = useCloseQuestionCounselorMutation()
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

  const handleSelectChat = () => {
    navigate(`/qna/conversations/${qna.id}`)
  }

  const handleChat = () => {
    navigate(`${qna.id}`)
  }

  const dispatch = useAppDispatch()

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
              {/* <Typography className='font-semibold w-112' color={qna.questionType === 'ACADEMIC' ? 'info' : 'warning'}>{qna.questionType === 'ACADEMIC' ? 'Academic' : 'Non-Academic'}</Typography> */}
              {
                qna.answer
                  ? <CheckCircleOutlineOutlined color='success' />
                  : <HelpOutlineOutlined color='disabled' />
              }
              <Typography className="pr-8">{qna.content}</Typography>
              {qna.closed && <Chip label={'Closed'} variant='outlined' color={'error'} size='small' />}
            </div>
          </AccordionSummary>

          <AccordionDetails className='flex flex-col justify-start gap-16'>
            <UserLabel
              profile={qna?.student?.profile}
              label='Assigned by'
              email={qna?.student.email}
              onClick={()=> {
                dispatch(openStudentView(qna?.student.id.toString()))
              }}
            />
            <div className='flex flex-col w-full gap-8 mt-4'>
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
                      <div className='flex justify-end w-full gap-8'>
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
                      {/* <Typography className='px-8 text-sm italic' color='textDisabled'>Answered at 4:20 11/10/2024</Typography> */}
                      <div className='flex items-center'>
                        <Typography className="px-8">{qna.answer}</Typography>
                        <IconButton size='small' onClick={() => setEditMode(true)}>
                          <EditNote />
                        </IconButton>
                      </div>
                    </div>

                  : <div>
                    <TextField
                      disabled={qna?.closed}
                      label="My answer"
                      placeholder="Enter answer for the question..."
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
                    <div className='flex justify-end w-full'>
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
            className='flex justify-end w-full gap-16 px-16 py-8 cursor-pointer bg-primary-light/5'
          >
            {!qna?.closed &&
              <Button
                variant='outlined'
                color='secondary'
                startIcon={<Close />}
                onClick={() => {
                  setExpanded(false)
                  closeQuestion(qna.id)
                }
                }
              >
                Close
              </Button>
            }
            <Button
              variant='contained'
              color='secondary'
              onClick={handleChat}
              disabled={!qna?.answer}
              endIcon={<ChatBubbleOutline />}
            >
              Chat
            </Button>
            <Button
              variant='contained'
              color='primary'
              onClick={handleSelectChat}
              endIcon={<ArrowForward />}
              disabled={qna?.closed}
            >
              Go to conversations
            </Button>
          </Box>
        </Accordion>
      </Paper >
    </motion.div>


  );
}


export default MyQnaItem