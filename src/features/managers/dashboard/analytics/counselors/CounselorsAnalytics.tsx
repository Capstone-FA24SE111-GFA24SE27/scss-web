import React from 'react'
import CounselorAppointmentsAnalytics from './CounselorAppointmentsAnalytics'
import CounselorQuestionsAnalytics from './CounselorQuestionsAnalytics'

const CounselorsAnalytics = ({ isAcademic }: { isAcademic: boolean }) => {
  return (
    <div className='p-24 space-y-32'>
      <CounselorAppointmentsAnalytics isAcademic={isAcademic} />
      <CounselorQuestionsAnalytics isAcademic={isAcademic} />
    </div>
  )
}

export default CounselorsAnalytics