

import { CheckboxField, ContentLoading, FilterTabs, NavLinkAdapter, Pagination, SearchField, SelectField } from '@/shared/components';
import { ArrowForward, ArrowRightAlt, ChatBubble, ChatBubbleOutline, CheckCircleOutlineOutlined, Close, Delete, Edit, ExpandMore, HelpOutlineOutlined, ThumbDown, ThumbDownOutlined, ThumbUp, ThumbUpOutlined } from '@mui/icons-material';
import { Accordion, AccordionDetails, AccordionSummary, Avatar, Box, Button, Chip, Divider, FormControlLabel, IconButton, MenuItem, Paper, Switch, TextField, Typography } from '@mui/material';
import { motion } from 'framer-motion';
import { ChangeEvent, SyntheticEvent, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { Question, useCloseQuestionStudentMutation, useDeleteQuestionStudentMutation, useGetStudentQuestionsQuery, useReadMessageMutation } from './qna-api';
import { selectAccount, useAppSelector } from '@shared/store';
import { statusColor } from '@/shared/constants';
import { useGetAcademicTopicsQuery, useGetNonAcademicTopicsQuery } from '@/shared/services';


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
  const [openAnswers, setOpenAnswers] = useState(false);

  const [expanded, setExpanded] = useState<number | boolean>(false);

  const [tabValue, setTabValue] = useState(0);

  const [searchTerm, setSearchTerm] = useState('');

  const [selectedType, setSelectedType] = useState('');

  const [selectedTopic, setSelectedTopic] = useState('');

  const [isClosed, setIsClosed] = useState(false);

  const [isTaken, setIsTaken] = useState(false);

  const [page, setPage] = useState(1);

  const account = useAppSelector(selectAccount)
  const navigate = useNavigate()

  const toggleAccordion = (panel: number) => (_: SyntheticEvent, _expanded: boolean) => {
    setExpanded(_expanded ? panel : false);
  };

  const handleChangeTab = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleSearch = (searchTerm: string) => {
    setSearchTerm(searchTerm);
  };

  const handlePageChange = (event: ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };

  const statusTabs = [
    { label: 'All', value: '' },
    { label: 'Verified', value: 'VERIFIED' },
    { label: 'Pending', value: 'PENDING' },
    { label: 'Flagged', value: 'FLAGGED' },
    { label: 'Rejected', value: 'REJECTED' },
  ];

  const [closeQuestion] = useCloseQuestionStudentMutation()

  const handleSelectType = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedType(event.target.value);
    setSelectedTopic('')
  };

  const typeOptions = [
    { label: 'All', value: '' },
    { label: 'Academic', value: 'ACADEMIC' },
    { label: 'Non-Academic', value: 'NON_ACADEMIC' },
  ];



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

  const topicOptions = selectedType == 'ACADEMIC' ? academicTopicOptions : nonAcademicTopicOptions || []

  const handleSelectTopic = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedTopic(event.target.value);
  };

  const handleCheckboxClose = (event: React.ChangeEvent<HTMLInputElement>) => {
    setIsClosed(event.target.checked);
  };

  const handleCheckboxTaken = (event: React.ChangeEvent<HTMLInputElement>) => {
    setIsTaken(event.target.checked);
  };


  const { data: qnaData, refetch, isLoading } = useGetStudentQuestionsQuery({
    status: statusTabs[tabValue].value,
    keyword: searchTerm,
    type: selectedType,
    topicId: selectedTopic,
    isClosed: isClosed || '',
    isTaken: isTaken || '',
    page: page,
  })
  const qnaList = qnaData?.content?.data || [] as Question[]

  const [readMessage] = useReadMessageMutation()

  const [deleteQuestion, { isLoading: isDeletingQuestion }] = useDeleteQuestionStudentMutation()

  const handleSelectChat = (qna: Question) => {
    readMessage(qna.chatSession.id)
    navigate(`conversations/${qna.id}`)
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

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className='p-32 w-full space-y-16'
    >
      <div className='flex gap-16'>
        <SearchField
          onSearch={handleSearch}
          className='w-xs'
        />
        <SelectField
          label="Type"
          options={typeOptions}
          value={selectedType}
          onChange={handleSelectType}
          className='w-144'
        />
        <SelectField
          disabled={!selectedType}
          label="Topic"
          options={topicOptions}
          value={selectedTopic}
          onChange={handleSelectTopic}
          className='w-200'
        />
        <div className='flex-1 flex justify-end w-full'>
          <FormControlLabel
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

      </div>
      <div>
        <div className='flex justify-between'>
          <FilterTabs tabs={statusTabs} tabValue={tabValue} onChangeTab={handleChangeTab} />
          <div className='flex gap-16'>
            <CheckboxField
              label="Is Taken"
              checked={isTaken}
              onChange={handleCheckboxTaken}
            />
            <CheckboxField
              label="Is Close"
              checked={isClosed}
              onChange={handleCheckboxClose}
            />
          </div>
        </div>
      </div>

      <div className='space-y-16'>
        {
          !qnaList?.length ?
            <Typography variant='h5' color='textSecondary'>No questions found.</Typography>
            : qnaList.map((qna) => {
              return (
                <motion.div
                  variants={item}
                  key={qna.id}
                >
                  <Paper className='overflow-hidden shadow'>
                    <Accordion
                      className='shadow'
                      expanded={expanded === qna.id || openAnswers}
                      onChange={toggleAccordion(qna.id)}
                    >
                      <AccordionSummary expandIcon={<ExpandMore />}>
                        <div className='flex flex-col gap-8'>
                          <div className='flex gap-8'>
                            <div>Id: {qna.id}</div>
                            <Chip label={qna.questionType === 'ACADEMIC' ? 'Academic' : 'Non-Academic'} color={'info'} size='small' />
                            <Chip label={qna.status} color={statusColor[qna.status as string]} size='small' />
                            {/* <Chip label={qna.topic?.name} size='small' /> */}
                            {/* {qna.taken && <Chip label={`Taken by ${qna?.counselor.profile.fullName}`} variant='outlined' color={'success'} size='small' />} */}
                            {qna.closed && <Chip label={'Closed'} variant='outlined' color={'error'} size='small' />}
                            {countUnreadMessages(qna) ? <Chip label={countUnreadMessages(qna)} size='small' variant='filled' color='secondary' /> : ''}
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
                          {qna.counselor && <div className='flex items-center px-32 text-sm'>
                            Answered by
                            <Button className='flex gap-8 items-center ml-4'
                              component={NavLinkAdapter}
                              to={`counselor/${qna?.counselor?.profile?.id}`}
                            >
                              <Avatar
                                className='size-24'
                                alt={qna.counselor?.profile.fullName}
                                src={qna.counselor?.profile.avatarLink}
                              />
                              <div>
                                <Typography className='font-semibold'>{qna.counselor?.profile.fullName}</Typography>
                              </div>
                            </Button>
                          </div>
                            // <Button className='flex gap-16 items-center justify-start w-fit px-16'>
                            //   <Avatar
                            //     className='size-32'
                            //     alt={qna.counselor?.profile.fullName}
                            //     src={qna.counselor?.profile.avatarLink} />
                            //   <div>
                            //     <Typography className='font-semibold text-sm'>{qna.counselor?.profile.fullName}</Typography>
                            //     <Typography className='text-sm text-start' color='textSecondary'>{qna.counselor?.expertise?.name || qna.counselor?.specialization?.name}</Typography>
                            //   </div>
                            // </Button>
                          }
                          {!qna.counselor
                            ? <Typography className="px-8 italic" color='textDisabled'>{'No counselor has taken this question'}</Typography>
                            : qna.answer ?
                              <div>
                                {/* <Typography className='text-sm italic px-8' color='textDisabled'>Answered at 4:20 11/10/2024</Typography> */}
                                <Typography className="px-8">{qna.answer}</Typography>
                              </div>
                              : <div>
                                <Typography className="px-8 italic" color='textDisabled'>{'The counselor has not answer yet'}</Typography>
                              </div>}
                        </div>
                      </AccordionDetails>
                      <Box
                        className='bg-primary-light/5 w-full py-8 flex justify-end px-16 gap-16 '
                      >
                        {/* <div className='w-112 flex items-start'>
                          <IconButton><ThumbUpOutlined /></IconButton>
                          <IconButton><ThumbDownOutlined /></IconButton>
                        </div> */}
                        {
                          qna.status == 'PENDING' ?
                            <Button
                              variant='outlined'
                              color='secondary'
                              startIcon={<Delete />}
                              disabled={isDeletingQuestion}
                              onClick={() => deleteQuestion(qna.id)}
                            >
                              Delete
                            </Button>
                            : qna.status == 'VERIFIED' && !qna?.closed
                              ? < Button
                                variant='outlined'
                                color='secondary'
                                startIcon={<Close />}
                                onClick={() => closeQuestion(qna.id)}
                              >
                                Close
                              </Button>
                              : <></>
                        }
                        {
                          qna.status == 'PENDING' ?
                            <Button
                              variant='contained'
                              color='secondary'
                              component={NavLinkAdapter}
                              to={`edit/${qna.id}`}
                              startIcon={<Edit />}
                            >
                              Edit
                            </Button>
                            : <Button
                              variant='contained'
                              color='secondary'
                              startIcon={<ChatBubbleOutline />}
                              onClick={() => handleSelectChat(qna)}
                              disabled={!qna.counselor}
                            >
                              Chat
                            </Button>
                        }

                      </Box>
                    </Accordion>
                  </Paper>
                </motion.div>
              );
            })
        }
        <Pagination
          page={page}
          count={qnaData?.content.totalPages}
          handleChange={handlePageChange}
        />
      </div >

    </motion.div >
  )
}


export default QnaList