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
import { useGetAllCategoriesQuery, useSearchContributedQuestionCardsQuery } from './question-board-api';
import { ChangeEvent, useState } from 'react';
import ContributedQuestionItem from './ContributedQuestionItem';
import { CategorySelect, CheckboxField, ContentLoading, Pagination, SearchField } from '@/shared/components';
import { ContentSearch } from '@/shared/components/filter/SearchField';
import { selectAccount, useAppSelector } from '@shared/store';

const QuestionBoard = () => {
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const account = useAppSelector(selectAccount)
  const isCounselor = [`ACADEMIC_COUNSELOR`, `NON_ACADEMIC_COUNSELOR`].includes(account.role)
  const [selectedCategory, setSelectedCategory] = useState<string | number>('');
  const [IsShowingOnlyMyQna, setIsShowingOnlyMyQna] = useState(false);

  const handleCategoryChange = (value: string | number) => {
    setSelectedCategory(value);
  };

  const handlePageChange = (event: ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };

  const handleSearch = (searchTerm: string) => {
    setSearchTerm(searchTerm);
  };

  const handleCheckboxClose = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setIsShowingOnlyMyQna(event.target.checked);
  };



  // const { data: categoriesData, isLoading: loadingCategories } = useGetAllCategoriesQuery();
  // const categories = categoriesData?.content || []

  const { data: contributedQuestionsData, isLoading, isFetching } = useSearchContributedQuestionCardsQuery({
    query: searchTerm,
    counselorId: IsShowingOnlyMyQna ? account?.profile.id : undefined
  });
  const contributedQuestions = contributedQuestionsData?.content?.data || [];


  return (
    <div>
      <div className='px-32 mt-16'>
        <Typography className='text-lg font-semibold mb-8' color='textSecondary'>List of questions and answers contributed by our counselors</Typography>
      </div>
      <div className='flex justify-center gap-16'>
        <div className='mt-80 flex flex-col '>
          {/* Show category here */}
        </div>
        <div className='w-full mt-16 max-w-xl'>
          <ContentSearch onSearch={handleSearch} className='' />
          <div className='flex px-8 justify-end w-full'>
            {
              isCounselor && (
                <CheckboxField
                  label='Show my Q&A only'
                  checked={IsShowingOnlyMyQna}
                  onChange={handleCheckboxClose}
                />
              )
            }
          </div>
          <div className='space-y-16 mt-16'>
            {
              isFetching || isLoading
                ? <ContentLoading />
                : !contributedQuestions?.length ? (
                  <Typography variant='h5' color='textSecondary' className='p-16'>
                    No questions found.
                  </Typography>
                ) : (
                  contributedQuestions?.map((contributedQuestion) => {
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
    </div>

  )
}

export default QuestionBoard