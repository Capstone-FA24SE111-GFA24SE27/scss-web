import React from 'react'
import { Breadcrumbs as MUIbreadcrumbs, Typography } from "@mui/material";
import { Link } from 'react-router-dom';

type PageItem = {
  label: string,
  url: string
}
type Props = {
  parents: PageItem[],
  currentPage: string
  className?: string
}
const Breadcrumbs = ({ parents, currentPage, className = '' }: Props) => {
  return (
    <div className={className}>
      <MUIbreadcrumbs aria-label="breadcrumb">
        {parents.map(item =>
          <Link to={item.url} className='hover:!underline'>
            {item.label}
          </Link>
        )}
        <Typography color="text.primary.main">{currentPage}</Typography>
      </MUIbreadcrumbs>
    </div >
  )
}

export default Breadcrumbs