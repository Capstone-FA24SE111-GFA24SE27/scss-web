import { Tune } from '@mui/icons-material'
import { IconButton, Tooltip } from '@mui/material'
import { useAppDispatch } from '@shared/store';
import { ReactElement } from 'react'
import clsx from 'clsx'
import { filterToggle } from './student-list-slice';

const StudentListFilterButton = (props: { className?: string, children?: ReactElement }) => {
  const {
    className = '',
    children = (
      <Tune fontSize='large' />
    )
  } = props;

  const dispatch = useAppDispatch();

  return (
    <div className={clsx('flex flex-1 ', className)}>
      <div className='flex'>
        <Tooltip title={'Toggle Filter'}
        >
          <IconButton
            color='inherit'
            onClick={() => dispatch(filterToggle())}

          >
            {children}
          </IconButton>
        </Tooltip>
      </div>
    </div>
  )
}


export default StudentListFilterButton