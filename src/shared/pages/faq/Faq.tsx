import { CheckboxField, ContentLoading, FilterTabs, Pagination, SelectField } from '@/shared/components';
import SearchField, { ContentSearch } from '@/shared/components/filter/SearchField';
import {
  Typography
} from '@mui/material';
import { selectAccount, useAppSelector } from '@shared/store';
import { ChangeEvent, useState } from 'react';
import { useGetAllCategoriesQuery, useSearchContributedQuestionCardsQuery } from './faq-api';
import FaqItem from './FaqItem'

const Faq = () => {
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const account = useAppSelector(selectAccount)
  const isCounselor = [`ACADEMIC_COUNSELOR`, `NON_ACADEMIC_COUNSELOR`].includes(account.role)
  const [selectedType, setSelectedType] = useState<string>('');
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


  const typeOptions = [
    { label: 'All', value: '' },
    { label: 'Academic', value: 'ACADEMIC' },
    { label: 'Non-Academic', value: 'NON_ACADEMIC' },
  ];

  const categoryOptions = categories?.filter(category => !typeOptions[tabValue].value || category.type === typeOptions[tabValue].value)
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

  const handleSelectType = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedType(event.target.value);
  };



  const { data: contributedQuestionsData, isLoading, isFetching } = useSearchContributedQuestionCardsQuery({
    query: searchTerm,
    counselorId: isShowingOnlyMyQna ? account?.profile.id : undefined,
    categoryId: Number(selectedCategory) || undefined,
    page: page,
  });
  const contributedQuestions = contributedQuestionsData?.content?.data || [];


  return (
    <div className='w-full p-16'>
      <div>
        {/* <Typography className='px-16 mb-8 text-lg text-text-secondary'>
          List of questions and answers contributed by our counselors
        </Typography> */}
      </div>
      <div className='flex justify-center gap-16'>
        <div className='flex flex-col mt-80 '>
          {/* Show category here */}
        </div>
        <div className='container flex flex-col w-full mt-16'>
          <SearchField onSearch={handleSearch} className='w-full' />
          {/* <ContentSearch onSearch={handleSearch} /> */}
          <div className='flex justify-between w-full mt-16'>

            <div className='flex gap-16'>
              <SelectField
                label='Type'
                options={typeOptions}
                value={selectedType}
                onChange={handleSelectType}
                className='pr-8 outline-none w-200'
                size={isCounselor ? 'small' : 'medium'}
                showClearOptions
              />
              <SelectField
                label='Category'
                options={categoryOptions}
                value={selectedCategory}
                onChange={handleSelectCategory}
                className='pr-8 outline-none w-400'
                size={isCounselor ? 'small' : 'medium'}
                showClearOptions
              />
            </div>
            <div className='flex justify-end w-full px-8'>
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
          </div>

          <div className='mt-16 space-y-16'>
            {
              isFetching || isLoading
                ? <ContentLoading className='h-md' />
                : !contributedQuestions?.length ? (
                  <Typography variant='h5' color='textSecondary' className='p-16'>
                    No questions found.
                  </Typography>
                ) : (
                  contributedQuestions?.map((contributedQuestion) => {
                    return (
                      <FaqItem key={contributedQuestion.id} contributedQuestion={contributedQuestion} />
                    )
                  })
                )
            }
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