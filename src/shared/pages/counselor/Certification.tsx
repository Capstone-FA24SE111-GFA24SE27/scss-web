import { InteractiveImage, openDialog } from '@/shared/components'
import { Certification } from '@/shared/types'
import { Box } from '@mui/material'
import { useAppDispatch } from '@shared/store'
import React from 'react'

const Certification = ({ certification }: { certification: Certification }) => {
  const dispatch = useAppDispatch()
  return (
    <div key={certification.id} className="flex items-start p-8 rounded shadow gap-16">
      <InteractiveImage
        src={certification.imageUrl}
        alt={`Certification`}
      />
      <div className="flex-1">
        <p className="text-lg font-semibold">{certification.name}</p>
        <p className="">{certification.organization}</p>
      </div>
    </div>
  )
}

export default Certification