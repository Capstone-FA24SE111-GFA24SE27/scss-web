import { useAppDispatch } from '@shared/store'
import React from 'react'
import clsx from 'clsx'
import { openDialog } from '..'
type InteractiveImageProps = {
  src: string,
  alt?: string,
  classname?: string,
}
const InteractiveImage = ({ src, alt = `SCSS Image`, classname = `` }: InteractiveImageProps) => {
  const dispatch = useAppDispatch()
  return (
    <img
      src={src}
      alt={alt}
      onClick={() => {
        dispatch(openDialog({
          children: (
            <img
              className='min-h-sm min-w-sm'
              src={src}
              alt={alt}
            />
          )
        }))
      }}
      className={clsx("size-72 object-cover border hover:opacity-80 cursor-pointer rounded", classname)}
    />
  )
}

export default InteractiveImage