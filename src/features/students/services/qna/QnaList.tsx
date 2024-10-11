

import { NavLinkAdapter } from '@/shared/components';
import { ArrowForward, ArrowRightAlt, CheckCircleOutlineOutlined, ExpandMore, HelpOutlineOutlined, ThumbDown, ThumbDownOutlined, ThumbUp, ThumbUpOutlined } from '@mui/icons-material';
import { Accordion, AccordionDetails, AccordionSummary, Avatar, Box, Button, Chip, Divider, FormControlLabel, IconButton, MenuItem, Switch, TextField, Typography } from '@mui/material';
import { motion } from 'framer-motion';
import { SyntheticEvent, useState } from 'react'
import { useNavigate } from 'react-router-dom';

const qnaData = [
  { question: "What is the capital of France?", answer: "Paris", type: 'Non-academic' },
  { question: "What is 2 + 2?", answer: "4" , answered: true },
  { question: "Who wrote 'To Kill a Mockingbird'?", answer: "Harper Lee", type: 'Non-academic', answered: true },
  { question: "What is the boiling point of water?", answer: "100°C" },
  { question: "What is the largest planet in our solar system?", answer: "Jupiter", type: 'Non-academic', answered: true },
  { question: "Who painted the Mona Lisa?", answer: "Leonardo da Vinci" },
];

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
  const [hideCompleted, setHideCompleted] = useState(false);

  const [expanded, setExpanded] = useState<string | boolean>(false);

  const toggleAccordion = (panel: string) => (_: SyntheticEvent, _expanded: boolean) => {
    setExpanded(_expanded ? panel : false);
  };
  const navigate = useNavigate()

  return (
    qnaData?.length > 0 && (
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
            label="Choose counseling type"
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
            label="Answered Only"
            control={
              <Switch
                onChange={(ev) => {
                  setHideCompleted(ev.target.checked);
                }}
                checked={hideCompleted}
                name="hideCompleted"
              />
            }
          />
        </div>

        <div className='space-y-16'>
          {qnaData.map((qna) => (
            <motion.div
              variants={item}
              key={qna.question}
            >
              <Accordion
                className='shadow'
                expanded={expanded === qna.question}
                onChange={toggleAccordion(qna.question)}
              >
                <AccordionSummary expandIcon={<ExpandMore />}>
                  <div className="flex items-center gap-8">
                    {/* <Chip label={qna.type === 'Non-academic' ? 'Non-Academic' : 'Academic'} color={qna.type === 'Non-academic' ? 'info' : 'success'} className='w-112'/> */}
                    <Typography className='w-112 font-semibold' color={qna.type === 'Non-academic' ? 'info' : 'warning'}>{qna.type === 'Non-academic' ? 'Non-Academic' : 'Academic'}</Typography>
                    <Divider orientation='vertical' />
                    {
                      qna.answered
                        ? <CheckCircleOutlineOutlined color='success'/>
                        : <HelpOutlineOutlined color='disabled' />
                    }
                    <Typography className="pr-8 font-medium">{qna.question}</Typography>
                  </div>
                </AccordionSummary>

                <AccordionDetails className='flex'>
                  <div className='w-112 flex items-start'>
                    <IconButton><ThumbUpOutlined /></IconButton>
                    <IconButton><ThumbDownOutlined /></IconButton>
                  </div>
                  <div className='flex flex-col gap-8'>
                    <Button className='flex gap-16 items-center'>
                      <Avatar
                        className='size-32'
                        alt={qna.question}
                        src="https://material-ui.com/static/images/avatar/1.jpg"
                      />
                      <div>
                        <Typography className='font-semibold text-sm'>{'Some counselor Abc'}</Typography>
                        <Typography className='text-sm text-start' color='textSecondary'>{'Tâm lý học'}</Typography>
                      </div>
                    </Button>
                    <Typography className='text-sm italic px-8' color='textDisabled'>Answered at 4:20 11/10/2024</Typography>
                    <Typography className="px-8">{qna.answer}</Typography>
                  </div>
                </AccordionDetails>
                <Box
                  className='bg-primary-main/5 w-full py-8 flex justify-end px-16 cursor-pointer'
                  onClick={() => navigate('1')}
                >
                  <Button
                    color='secondary'
                    endIcon={<ArrowForward />}
                  >
                    Start a conversation
                  </Button>
                </Box>
              </Accordion>
            </motion.div>
          ))
          }
        </div >
      </motion.div >
    )

  );
}


export default QnaList