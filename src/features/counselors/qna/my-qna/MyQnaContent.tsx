import { CheckboxField, ContentLoading, Heading, NavLinkAdapter, Pagination, SearchField, SelectField } from '@/shared/components';
import { motion } from 'framer-motion';
import { ChangeEvent, SyntheticEvent, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { useAnswerQuestionMutation, useGetMyCounselorQuestionsQuery } from '../qna-api';
import MyQnaItem from './MyQnaItem';
import { useGetAcademicTopicsQuery, useGetNonAcademicTopicsQuery } from '@/shared/services';
import { selectAccount, useAppSelector } from '@shared/store';
import { extractCounselingTypeFromRole } from '@/shared/utils';
import { Typography } from '@mui/material';


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
    <div className='w-full h-full'>
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className='w-full p-32 space-y-16'
      >
        <div className='flex gap-16'>
          <SearchField
            label='Question keyword'
            placeholder='Enter question keyword'
            onSearch={handleSearch}
            className='w-xs'
          />
          {/* <SelectField
            label="Topic"
            options={topicOptions}
            value={selectedTopic}
            onChange={handleSelectTopic}
            showClearOptions
            className='w-200'
          /> */}
          <SearchField
            onSearch={handleSearchStudentCode}
            label='Student code'
            placeholder='SE1001'
            className='!w-192'
          />
          <div className='flex justify-end flex-1 w-full'>
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
              ? <div className='p-32 text-center'>
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