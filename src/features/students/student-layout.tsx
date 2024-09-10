import React from 'react'
import { Outlet} from 'react-router-dom';
const StudentLayout = () => {
  return (
    <div className='border border-green-500'>
      <h1>This is for layout for student feature</h1>
      <Outlet />
    </div>
  )
}

export default StudentLayout