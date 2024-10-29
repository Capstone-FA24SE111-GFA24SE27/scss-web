import { Role } from '@/shared/types';
import { ArrowForward, CheckCircleOutlineOutlined, ExpandMore, HelpOutlineOutlined, Search, ThumbDownOutlined, ThumbUpOutlined } from '@mui/icons-material';
import { Accordion, AccordionDetails, AccordionSummary, Avatar, Box, Button, Chip, FormControlLabel, IconButton, InputAdornment, ListItem, MenuItem, Paper, Switch, TextField, Typography } from '@mui/material';
import { selectAccount, useAppSelector } from '@shared/store';
import { motion } from 'framer-motion';
import { useGetCounselorQuestionsQuery, useTakeQuestionMutation } from '../qna-api';
import { useNavigate } from 'react-router-dom';
import { SyntheticEvent, useState } from 'react'
import { CheckboxField, ContentLoading, ExpandableText, Heading, SearchField, SelectField } from '@/shared/components';
import { useGetAcademicTopicsQuery, useGetNonAcademicTopicsQuery } from '@/shared/services';
import { extractCounselingTypeFromRole } from '@/shared/utils';

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
  const account = useAppSelector(selectAccount)


  const [openAnswers, setOpenAnswers] = useState(false);

  const [takeQuestion, { isLoading: isTakingQuestion }] = useTakeQuestionMutation()

  const [expanded, setExpanded] = useState<number | boolean>(false);

  const [searchTerm, setSearchTerm] = useState('');

  const [searchStudentCode, setSearchStudentCode] = useState('');

  const [selectedTopic, setSelectedTopic] = useState('');

  const [isClosed, setIsClosed] = useState(false);

  const handleSearch = (searchTerm: string) => {
    setSearchTerm(searchTerm);
  };

  const { data: academicTopicsData } = useGetAcademicTopicsQuery()
  const { data: nonacademicTopicsData } = useGetNonAcademicTopicsQuery()
  const academicTopics = academicTopicsData?.content
  const nonAcademicTopics = nonacademicTopicsData?.content
  const academicTopicOptions = academicTopics?.map(topic => ({
    label: topic.name,
    value: topic.id
  }))

  const nonAcademicTopicOptions = nonAcademicTopics?.map(topic => ({
    label: topic.name,
    value: topic.id
  }))

  const topicOptions = account?.role ?
    extractCounselingTypeFromRole(account?.role) === 'ACADEMIC' ? academicTopicOptions : nonAcademicTopicOptions
    : []
    

  const handleSelectTopic = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedTopic(event.target.value);
  };

  const handleCheckboxClose = (event: React.ChangeEvent<HTMLInputElement>) => {
    setIsClosed(event.target.checked);
  };

  const handleSearchStudentCode = (searchStudentCode: string) => {
    setSearchStudentCode(searchStudentCode);
  };

  const { data: questionData, isLoading } = useGetCounselorQuestionsQuery({
    role: account?.role,
    studentCode: searchStudentCode,
    keyword: searchTerm,
    topicId: selectedTopic,

  })
  const questionList = questionData?.content?.data

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


  return (
    <div className=''>
      <div className='p-32 bg-background-paper'>
        <Heading title='Question Board' description='List of verified questions for counselors to answer' />
      </div>


      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className='p-32 space-y-16'
      >
        <div className='flex gap-16'>
          <SearchField
            label='Question keyword'
            placeholder='Enter question keyword'
            onSearch={handleSearch}
            className='w-xs'
          />
          <SelectField
            label="Topic"
            options={topicOptions}
            value={selectedTopic}
            onChange={handleSelectTopic}
            className='w-200'
            showClearOptions
          />
          <SearchField
            onSearch={handleSearchStudentCode}
            label='Student code'
            placeholder='SE110000'
            className='!w-144'
          />

        </div>
        <div className='grid grid-cols-2 lg:grid-cols-3 gap-16'>
          {
            !questionList?.length ?
              <div className='text-center p-32'>
                <Typography variant='h5' className='text-text-disabled'>No questions found</Typography>
              </div>
              : questionList.map((question) => (
                <motion.div
                  variants={item}
                  key={question.id}
                >
                  <Paper className='bg-background-paper flex justify-between p-16 items-start shadow'>
                    <div className='flex flex-col gap-8'>
                      <Chip label={question.topic.name} size='small' />
                      <div className='flex gap-16 items-start'>
                        <Button>
                          <Avatar
                            className='size-32'
                            alt={question.content}
                            src={question.student?.profile.avatarLink}
                          />
                        </Button>
                        <div>
                          {/* <Typography className='font-semibold'>{question.student?.profile.fullName}<span className='text-text-disabled font-normal text-sm pl-8'>11 hours ago</span></Typography> */}

                          <Typography className='font-semibold'>{question.student?.profile.fullName}</Typography>
                          {/* <Typography className='text-sm text-start' color='textSecondary'>{question.content}</Typography> */}
                          <ExpandableText text={question.content} limit={300} />
                        </div>
                      </div>
                    </div>

                    <Box className=''>
                      <Button
                        color='secondary'
                        size='small'
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
    </div >
  )
}

export default QuestionBoard