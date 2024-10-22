import { ContentLoading, Heading, NavLinkAdapter } from '@/shared/components';
import { ArrowForward, ArrowRightAlt, CheckCircleOutlineOutlined, ExpandMore, HelpOutlineOutlined, Search, ThumbDown, ThumbDownOutlined, ThumbUp, ThumbUpOutlined } from '@mui/icons-material';
import { Accordion, AccordionDetails, AccordionSummary, Avatar, Box, Button, Chip, Divider, FormControlLabel, IconButton, InputAdornment, MenuItem, Switch, TextField, Typography } from '@mui/material';
import { motion } from 'framer-motion';
import { ChangeEvent, SyntheticEvent, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { useAnswerQuestionMutation, useGetMyQuestionsQuery } from '../qna-api';
import MyQnaItem from './MyQnaItem';


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

const MyQnaContent = () => {
  const { data: qnaData, isLoading } = useGetMyQuestionsQuery({})
  const qnaList = qnaData?.content?.data || []

  const [openAnswers, setOpenAnswers] = useState(true);

  const [expanded, setExpanded] = useState<number | boolean>(false);

  const toggleAccordion = (panel: number) => (_: SyntheticEvent, _expanded: boolean) => {
    setExpanded(_expanded ? panel : false);
  };
  const navigate = useNavigate()

  const [answer, setAnswer] = useState('')


  const [answerQuestion, { isLoading: submitingAnswer }] = useAnswerQuestionMutation()

  const handleAnswerQuestion = (questionId: number) => {
    answerQuestion({
      questionCardId: questionId,
      content: answer
    })
  }

  if (isLoading) {
    return <ContentLoading />
  }

  if (!qnaList?.length) {
    return (
      <div className='text-center p-32'>
        <Typography variant='h5' className='text-text-disabled'>No questions found</Typography>
      </div>

    )
  }


  return (
    <div className='w-full'>
      {
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
              {/* <TextField
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
            <MenuItem value="NON_ACADEMIC">Non-Academic</MenuItem>
          </TextField> */}
            </div>

            <div className='space-y-16'>
              {qnaList.map((qna) => (
                <MyQnaItem
                  key={qna.id}
                  qna={qna}
                />
              ))
              }
            </div >
          </motion.div >
        )
      }
    </div>
  );

}


export default MyQnaContent