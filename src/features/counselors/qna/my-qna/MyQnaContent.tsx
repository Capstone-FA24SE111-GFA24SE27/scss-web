import { CheckboxField, ContentLoading, Heading, NavLinkAdapter, Pagination, SearchField, SelectField } from '@/shared/components';
import { ArrowForward, ArrowRightAlt, CheckCircleOutlineOutlined, ExpandMore, HelpOutlineOutlined, Search, ThumbDown, ThumbDownOutlined, ThumbUp, ThumbUpOutlined } from '@mui/icons-material';
import { Accordion, AccordionDetails, AccordionSummary, Avatar, Box, Button, Chip, Divider, FormControlLabel, IconButton, InputAdornment, MenuItem, Switch, TextField, Typography } from '@mui/material';
import { motion } from 'framer-motion';
import { ChangeEvent, SyntheticEvent, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { useAnswerQuestionMutation, useGetMyCounselorQuestionsQuery } from '../qna-api';
import MyQnaItem from './MyQnaItem';
import { useGetAcademicTopicsQuery, useGetNonAcademicTopicsQuery } from '@/shared/services';
import { selectAccount, useAppSelector } from '@shared/store';
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

const MyQnaContent = () => {


  const account = useAppSelector(selectAccount)

  const [openAnswers, setOpenAnswers] = useState(true);

  const [expanded, setExpanded] = useState<number | boolean>(false);

  const toggleAccordion = (panel: number) => (_: SyntheticEvent, _expanded: boolean) => {
    setExpanded(_expanded ? panel : false);
  };
  const navigate = useNavigate()

  const [answer, setAnswer] = useState('')

  const [searchTerm, setSearchTerm] = useState('');

  const [searchStudentCode, setSearchStudentCode] = useState('');

  const [selectedTopic, setSelectedTopic] = useState('');

  const [isClosed, setIsClosed] = useState(false);

  const [page, setPage] = useState(1);

    const handleSearch = (searchTerm: string) => {
    setSearchTerm(searchTerm);
  };

 

  const { data: qnaData, isLoading } = useGetMyCounselorQuestionsQuery({
    isClosed: isClosed || '',
    studentCode: searchStudentCode,
    keyword: searchTerm,
    topicId: selectedTopic,
    page: page
  })
  const qnaList = qnaData?.content?.data || []


  const [answerQuestion, { isLoading: submitingAnswer }] = useAnswerQuestionMutation()


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

  const handlePageChange = (event: ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };

  if (isLoading) {
    return <ContentLoading />
  }



  return (
    <div className='w-full'>
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className='p-32 w-full space-y-16'
      >
        <div className='flex gap-16'>
          <SearchField
            label='Question keyword'
            placeholder='Enter question keyword'
            onSearch={handleSearch}
            className='w-xs'
          />
          <SelectField
            label="Choose topic"
            options={topicOptions}
            value={selectedTopic}
            onChange={handleSelectTopic}
            includeClearOption
            className='w-200'
          />
          <SearchField
            onSearch={handleSearchStudentCode}
            label='Student code'
            placeholder='SE110000'
            className='!w-144'
          />
          <div className='flex-1 flex justify-end w-full'>
            <CheckboxField
              label="Is Close"
              checked={isClosed}
              onChange={handleCheckboxClose}
            />
          </div>

        </div>

        <div className='space-y-16'>
          {
            !qnaList.length
              ? <div className='text-center p-32'>
                <Typography variant='h5' className='text-text-disabled'>No questions found</Typography>
              </div>
              : qnaList.map((qna) => (
                <MyQnaItem
                  key={qna.id}
                  qna={qna}
                />
              ))
          }
        </div >
        <Pagination
          page={page}
          count={qnaData?.content.totalPages}
          handleChange={handlePageChange}
        />
      </motion.div >
    </div>
  );

}


export default MyQnaContent