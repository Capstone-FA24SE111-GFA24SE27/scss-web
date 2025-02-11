import { ContentSearch } from '@/shared/components/filter/SearchField';
import {
  Typography
} from '@mui/material';
import { ChangeEvent, useState } from 'react';
import { useGetAllPublicQuestionCardsQuery } from './public-qna-api';
import PublicQnaItem from './PublicQnaItem';
import { motion } from 'framer-motion';
import { motionVariants } from '@/shared/configs';
import {
  CheckboxField,
  ContentLoading,
  FilterTabs,
  Pagination,
  SearchField,
  SelectField
} from '@/shared/components';

const PublicQna = () => {

  const [tabValue, setTabValue] = useState(0);

  const [searchTerm, setSearchTerm] = useState('');

  const [selectedType, setSelectedType] = useState('');

  const [page, setPage] = useState(1);

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


  const handleSelectType = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedType(event.target.value);
  };

  const typeOptions = [
    { label: 'All', value: '' },
    { label: 'Academic', value: 'ACADEMIC' },
    { label: 'Non-Academic', value: 'NON_ACADEMIC' },
  ];
  const { data: publicQnasData, isLoading, isFetching } = useGetAllPublicQuestionCardsQuery({
    keyword: searchTerm,
    type: selectedType as "ACADEMIC" | "NON_ACADEMIC",
    page: page,
  });
  const publicQnas = publicQnasData?.content?.data || [];

  if (isLoading) {
    return <ContentLoading />;
  }


  return (
    <div className='w-full py-16 px-32 container mx-auto'>
      <div className=''>
        {/* <Typography className='text-lg mb-8 text-text-secondary px-16'>
          All questions and answers Questioned by students
        </Typography> */}
      </div>
      <div className='w-full mt-16'>
        <motion.div
          variants={motionVariants.container}
          initial='hidden'
          animate='show'
          className='container w-full space-y-16'
        >
          <div className='flex gap-16'>
            {/* <ContentSearch onSearch={handleSearch} className='w-full' /> */}
            <SearchField onSearch={handleSearch} className='w-full' />
            <SelectField
              label='Type'
              options={typeOptions}
              value={selectedType}
              onChange={handleSelectType}
              className='w-200 outline-none'
            />

          </div>

          <div className='space-y-16 mt-16'>
            {
              isLoading
                ? <ContentLoading className='h-md' />
                : !publicQnas?.length ? (
                  <Typography variant='h5' color='textSecondary' className='px-8'>
                    No Q&As found.
                  </Typography>
                ) : (
                  publicQnas.map((publicQna) => {
                    return (
                      <PublicQnaItem key={publicQna.id} publicQna={publicQna} />
                    )
                  })
                )
            }
            <Pagination
              page={page}
              count={publicQnasData?.content.totalPages}
              handleChange={handlePageChange}
            />
          </div>
        </motion.div>


        {/* <ContentSearch onSearch={handleSearch} className='' /> */}

      </div>
    </div>

  )
}

export default PublicQna