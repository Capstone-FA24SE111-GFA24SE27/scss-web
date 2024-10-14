import { Role } from '@/shared/types';
import { ArrowForward, CheckCircleOutlineOutlined, ExpandMore, HelpOutlineOutlined, ThumbDownOutlined, ThumbUpOutlined } from '@mui/icons-material';
import { Accordion, AccordionDetails, AccordionSummary, Avatar, Box, Button, FormControlLabel, IconButton, ListItem, MenuItem, Paper, Switch, TextField, Typography } from '@mui/material';
import { selectAccount, useAppSelector } from '@shared/store';
import { motion } from 'framer-motion';
import { useGetQuestionsQuery, useTakeQuestionMutation } from '../qna-api';
import { useNavigate } from 'react-router-dom';
import { SyntheticEvent, useState } from 'react'
import { ExpendableText } from '@/shared/components';

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
  const { data: questionData } = useGetQuestionsQuery({ role })
  const [openAnswers, setOpenAnswers] = useState(false);
  const [takeQuestion, { isLoading: isTakingQuestion }] = useTakeQuestionMutation()

  const [expanded, setExpanded] = useState<number | boolean>(false);

  const toggleAccordion = (panel: number) => (_: SyntheticEvent, _expanded: boolean) => {
    setExpanded(_expanded ? panel : false);
  };
  const navigate = useNavigate()
  const questionList = questionData?.content?.data
  const hanldeTakeQuestion = (questionId: number) => {
    takeQuestion(questionId)
  }
  return (
    <div className='grid grid-col-3'>
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
                        <ExpendableText text={question.content} limit={300} />
                      </div>
                    </div>
                    <Box className=''>
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
    </div>
  )
}

export default QuestionBoard