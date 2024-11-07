import React, { forwardRef, ReactNode } from 'react'
import './scrollbar.css'
import clsx from 'clsx';

type Props = {
  children: ReactNode, className?: string 
}

const Scrollbar = forwardRef<HTMLDivElement, Props>((props , ref) => {
  const {children, className} = props
  return (
    <div ref={ref} className={clsx(className, 'custom-scrollbar')}>
      {children}
    </div>
  )
})

export default Scrollbar