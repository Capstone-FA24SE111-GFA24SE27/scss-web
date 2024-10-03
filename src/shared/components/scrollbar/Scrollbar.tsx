import React, { ReactNode } from 'react'
import './scrollbar.css'
import clsx from 'clsx';

const Scrollbar = ({ children, className }: { children: ReactNode, className?: string }) => {
  return (
    <div className={clsx(className, 'custom-scrollbar')}>
      {children}
    </div>
  )
}

export default Scrollbar