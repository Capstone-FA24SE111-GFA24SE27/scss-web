import { ExpandMore, Search } from '@mui/icons-material'
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Avatar,
  Box,
  Button,
  Chip,
  Input,
  Paper,
  Typography,
  styled,
} from '@mui/material';
import { useSearchContributedQuestionCardsQuery } from './question-board-api';
import { ChangeEvent, useState } from 'react';
import ContributedQuestionItem from './ContributedQuestionItem';
import { Pagination, SearchField } from '@/shared/components';
import { ContentSearch } from '@/shared/components/filter/SearchField';

const QuestionBoard = () => {
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');

  const handlePageChange = (event: ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };

  const handleSearch = (searchTerm: string) => {
    setSearchTerm(searchTerm);
  };

  const { data: contributedQuestionsData, isLoading, isFetching } = useSearchContributedQuestionCardsQuery({
    query: searchTerm,
  });
  const contributedQuestions = contributedQuestionsData?.content?.data || [];

  return (
    <div>
      <div className='px-32 mt-16'>
        <Typography className='text-lg font-semibold mb-8'>List of questions and answers contributed by our counselors</Typography>
      </div>
      <div className='w-full mt-16 max-w-xl mx-auto'>
        <ContentSearch onSearch={handleSearch} className='' />
        <div className='space-y-16 mt-16'>
          {!contributedQuestions?.length ? (
            <Typography variant='h5' color='textSecondary' className='p-16'>
              No questions found.
            </Typography>
          ) : (
            contributedQuestions.map((contributedQuestion) => {
              return (
                <ContributedQuestionItem key={contributedQuestion.id} contributedQuestion={contributedQuestion} />
              )
            })
          )}
          <Pagination
            page={page}
            count={contributedQuestionsData?.content.totalPages}
            handleChange={handlePageChange}
          />
        </div>
      </div>
    </div>

  )
}

export default QuestionBoard