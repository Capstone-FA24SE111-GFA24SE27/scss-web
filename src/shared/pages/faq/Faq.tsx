import { CheckboxField, ContentLoading, FilterTabs, Pagination, SelectField } from '@/shared/components';
import { ContentSearch } from '@/shared/components/filter/SearchField';
import {
  Typography
} from '@mui/material';
import { selectAccount, useAppSelector } from '@shared/store';
import { ChangeEvent, useState } from 'react';
import { useGetAllCategoriesQuery, useSearchContributedQuestionCardsQuery } from './faq-api';
import ContributedQuestionItem from './faqItem';

const Faq = () => {
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const account = useAppSelector(selectAccount)
  const isCounselor = [`ACADEMIC_COUNSELOR`, `NON_ACADEMIC_COUNSELOR`].includes(account.role)
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [isShowingOnlyMyQna, setIsShowingOnlyMyQna] = useState(false);
  const [tabValue, setTabValue] = useState(0);


  const { data: categoriesData, isLoading: loadingCategories } = useGetAllCategoriesQuery();
  const categories = categoriesData?.content || []

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


  const categoryTypeTab = [
    { label: 'All', value: '' },
    { label: 'Academic', value: 'ACADEMIC' },
    { label: 'Non-Academic', value: 'NON_ACADEMIC' },
  ];

  const categoryOptions = categories?.filter(category => !categoryTypeTab[tabValue].value || category.type === categoryTypeTab[tabValue].value)
    .map(category => ({
      label: category.name,
      value: category.id,
    }))


  const handleChangeTab = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleSelectCategory = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedCategory(event.target.value);
  };



  const { data: contributedQuestionsData, isLoading, isFetching } = useSearchContributedQuestionCardsQuery({
    query: searchTerm,
    counselorId: isShowingOnlyMyQna ? account?.profile.id : undefined,
    categoryId: Number(selectedCategory) || undefined
  });
  const contributedQuestions = contributedQuestionsData?.content?.data || [];


  return (
    <div className='w-full p-16'>
      <div>
        <Typography className='text-lg mb-8 text-text-secondary px-16'>
          List of questions and answers contributed by our counselors
        </Typography>
      </div>
      <div className='flex justify-center gap-16'>
        <div className='mt-80 flex flex-col '>
          {/* Show category here */}
        </div>
        <div className='w-full mt-16 max-w-xl flex flex-col'>
          <ContentSearch onSearch={handleSearch} />
          <div className='flex justify-between w-full mt-16'>
            <FilterTabs
              tabs={categoryTypeTab}
              tabValue={tabValue}
              onChangeTab={handleChangeTab}
            />
            <SelectField
              label='Category'
              options={categoryOptions}
              value={selectedCategory}
              onChange={handleSelectCategory}
              className='w-200 outline-none pr-8'
              size='medium'
              showClearOptions
            />
          </div>
          <div className='flex px-8 justify-end w-full'>
            {
              isCounselor && (
                <CheckboxField
                  label='Show my Q&A only'
                  checked={isShowingOnlyMyQna}
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

export default Faq