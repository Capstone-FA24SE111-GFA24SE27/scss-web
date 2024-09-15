import React from 'react'
import { Outlet} from 'react-router-dom';
const StudentLayout = () => {
  return (
    <div className='p-4'>
      <h1>This is for layout for student feature</h1>
      <Outlet />
    </div>
  )
}

export default StudentLayout