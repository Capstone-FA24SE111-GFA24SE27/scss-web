import { InteractiveImage, openDialog } from '@/shared/components'
import { Qualification } from '@/shared/types'
import { Box } from '@mui/material'
import { useAppDispatch } from '@shared/store'
import React from 'react'

const Qualification = ({ qualification }: { qualification: Qualification }) => {
  const dispatch = useAppDispatch()

  return (
    <div key={qualification.id} className="flex items-start p-8 rounded shadow gap-16">
      <InteractiveImage
        src={qualification.imageUrl}
        alt={`Qualification`}
      />
      <div className="flex-1">
        <p className="text-lg font-semibold">{qualification.institution}</p>
        <p className="">{qualification.degree} • {qualification.fieldOfStudy}</p>
        <p className="text-text-secondary">Graduated: {qualification.yearOfGraduation}</p>
      </div>
    </div>
  )
}

export default Qualification