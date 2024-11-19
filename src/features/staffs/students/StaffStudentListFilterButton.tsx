import { Tune } from '@mui/icons-material'
import { IconButton, Tooltip } from '@mui/material'
import { useAppDispatch } from '@shared/store';
import { ReactElement } from 'react'
import clsx from 'clsx'

const StaffStudentListFilterButton = (props: { className?: string, children?: ReactElement, onClick: () => void }) => {
  const {
    className = '',
    children = (
      <Tune fontSize='large' />
    ),
    onClick = () => {}
  } = props;

  const dispatch = useAppDispatch();
  return (
    <div className={clsx('flex ', className)}>
      <div className='flex'>
        <Tooltip title={'Toggle Filter'}
        >
          <IconButton
            color='inherit'
            onClick={onClick}

          >
            {children}
          </IconButton>
        </Tooltip>
      </div>
    </div>
  )
}


export default StaffStudentListFilterButton