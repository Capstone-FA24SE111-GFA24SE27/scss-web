import { Role } from '@/shared/types';
import { ArrowForward, CheckCircleOutlineOutlined, ExpandMore, HelpOutlineOutlined, Search, ThumbDownOutlined, ThumbUpOutlined } from '@mui/icons-material';
import { Accordion, AccordionDetails, AccordionSummary, Avatar, Box, Button, FormControlLabel, IconButton, InputAdornment, ListItem, MenuItem, Paper, Switch, TextField, Typography } from '@mui/material';
import { selectAccount, useAppSelector } from '@shared/store';
import { motion } from 'framer-motion';
import { useGetQuestionsQuery, useTakeQuestionMutation } from '../qna-api';
import { useNavigate } from 'react-router-dom';
import { SyntheticEvent, useState } from 'react'
import { ContentLoading, ExpandableText, Heading } from '@/shared/components';

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

const QuestionBoard = () => {
  const role: Role = useAppSelector(selectAccount)?.role
  const { data: questionData, isLoading } = useGetQuestionsQuery({ role })
  const questionList = questionData?.content?.data

  const [openAnswers, setOpenAnswers] = useState(false);
  const [takeQuestion, { isLoading: isTakingQuestion }] = useTakeQuestionMutation()

  const [expanded, setExpanded] = useState<number | boolean>(false);

  const toggleAccordion = (panel: number) => (_: SyntheticEvent, _expanded: boolean) => {
    setExpanded(_expanded ? panel : false);
  };
  const navigate = useNavigate()
  const hanldeTakeQuestion = (questionId: number) => {
    takeQuestion(questionId)
  }

  if (isLoading) {
    return <ContentLoading />
  }

  if (!questionList?.length) {
    return (
      <div className='text-center p-32'>
        <Typography variant='h5' className='text-text-disabled'>No questions found</Typography>
      </div>

    )
  }
  return (
    <div className=''>
      <div className='p-32 bg-background-paper'>
        <Heading title='Question Board' description='List of verified questions for counselors to answer' />
      </div>
      {
        questionList?.length > 0 && (
          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className='p-32 space-y-16'
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

            <div className='grid grid-cols-3 gap-16'>
              {questionList.map((question) => (
                <motion.div
                  variants={item}
                  key={question.id}
                >
                  <Paper className='bg-background-paper flex justify-between p-16 items-start shadow'>
                    <div className='flex gap-16 items-start'>
                      <Avatar
                        className='size-32'
                        alt={question.content}
                        src={question.student?.profile.avatarLink}
                      />
                      <div>
                        <Typography className='font-semibold'>{question.student?.profile.fullName}<span className='text-text-disabled font-normal text-sm pl-8'>11 hours ago</span></Typography>
                        {/* <Typography className='text-sm text-start' color='textSecondary'>{question.content}</Typography> */}
                        <ExpandableText text={question.content} limit={300} />
                      </div>
                    </div>
                    <Box className='w-96'>
                      <Button
                        color='secondary'
                        className=''
                        disabled={isTakingQuestion}
                        onClick={() => hanldeTakeQuestion(question.id)}
                      >Take to answer</Button>
                    </Box>
                  </Paper>

                </motion.div>
              ))
              }
            </div >
          </motion.div >
        )
      }
    </div >
  )
}

export default QuestionBoard