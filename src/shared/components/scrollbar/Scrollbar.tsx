import React, { ReactNode } from 'react'
import './scrollbar.css'

const Scrollbar = ({ children }: { children: ReactNode }) => {
  return (
    <div className="custom-scrollbar">
      {children}
    </div>
  )
}

export default Scrollbar