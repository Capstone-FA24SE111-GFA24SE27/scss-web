import { CheckboxField, SearchField, SelectField } from '@/shared/components'
import { Psychology } from '@mui/icons-material'
import { useAppDispatch, useAppSelector } from '@shared/store'
import { useState } from 'react'
import StudentListFilterButton from './StudentListFilterButton'
import { selectFilter, setIsIncludeBehavior, setPromptForBehavior, setSemesterIdForBehavior } from './student-list-slice'

const StudentListHeader = () => {
  const filter = useAppSelector(selectFilter)
  const dispatch = useAppDispatch()

  const handleIsIncludeBehavior = (event: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setIsIncludeBehavior(!filter.isIncludeBehavior))
    dispatch(setPromptForBehavior(''))
  };

  const handlePromptForBehavior = (searchTerm) => {
    dispatch(setPromptForBehavior(searchTerm))
  };
  const semesterOptions = [
    { label: ' 1', value: '1' },
    { label: ' 2', value: '2' },
    { label: ' 3', value: '3' },
    { label: ' 4', value: '4' },
    { label: ' 5', value: '5' },
    { label: ' 6', value: '6' },
    { label: ' 7', value: '7' },
    { label: ' 8', value: '8' },
    { label: ' 9', value: '9' },
  ];

  const handleSelectSemester = (event: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setSemesterIdForBehavior(Number(event.target.value)))
    dispatch(setPromptForBehavior(''))
  };

  return (
    <div className="flex flex-1 items-center bg-background">
      <div className="w-full p-24 flex flex-col gap-16">
        <div className='flex gap-32'>
          <SearchField
            onSearch={handlePromptForBehavior}
            label='Behavior tags'
            className='Student behavior'
            startIcon={<Psychology />}
            placeholder='Student behavior'
            disabled={!filter.isIncludeBehavior}
          />
          <SelectField
            label="Semester"
            options={semesterOptions}
            value={filter.semesterIdForBehavior?.toString()}
            onChange={handleSelectSemester}
            showClearOptions
            className='w-200'
            disabled={!filter.isIncludeBehavior}
          />
          <CheckboxField
            label="Including Behavior"
            checked={filter.isIncludeBehavior}
            onChange={handleIsIncludeBehavior}
          />
          <div className='pl-16'>
            {!filter.open && <StudentListFilterButton />}
          </div>
        </div>

      </div>
    </div >

  )
}

export default StudentListHeader