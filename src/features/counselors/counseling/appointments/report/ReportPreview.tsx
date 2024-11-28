import { renderHTML } from '@/shared/components';
import { DialogContent, DialogTitle, Typography } from '@mui/material';
import 'react-quill/dist/quill.snow.css';
import { z } from 'zod';
import { ReportFormValues } from './ReportCreate';


const ReportPreview = ({ report }: { report: ReportFormValues }) => {
  return (
    <div className='w-[56rem] overflow-auto'>
      <DialogTitle id="alert-dialog-title">Report Preview</DialogTitle>
      <DialogContent id="alert-dialog-description" className='overflow-hidden'>
        <section className="mb-16">
          <Typography variant="h6" className="font-semibold mb-4 bg-primary-main pb-2 text-primary-contrastText px-8">
            Consultation Goal
          </Typography>
          <div className="mt-4 space-y-8 mx-8">
            {report.consultationGoal?.specificGoal && (
              <div>
                <Typography className="font-semibold text-lg text-primary-light">
                  Specific Goal:
                </Typography>
                {renderHTML(report.consultationGoal.specificGoal)}
              </div>
            )}
            {report.consultationGoal?.reason && (
              <div>
                <Typography className="font-semibold text-lg text-primary-light">
                  Reason:
                </Typography>
                {renderHTML(report.consultationGoal.reason)}
              </div>
            )}
          </div>
        </section>

        {/* Consultation Content */}
        <section className="mb-16">
          <Typography variant="h6" className="font-semibold mb-4 bg-primary-main pb-2 text-primary-contrastText px-8">
            Consultation Content
          </Typography>
          <div className="mt-4 space-y-8 mx-8">
            {report.consultationContent?.summaryOfDiscussion && (
              <div>
                <Typography className="font-semibold text-lg text-primary-light">
                  Summary of Discussion:
                </Typography>
                {renderHTML(report.consultationContent.summaryOfDiscussion)}
              </div>
            )}
            {report.consultationContent?.mainIssues && (
              <div>
                <Typography className="font-semibold text-lg text-primary-light">
                  Main Issues:
                </Typography>
                {renderHTML(report.consultationContent.mainIssues)}
              </div>
            )}
            {report.consultationContent?.studentEmotions && (
              <div>
                <Typography className="font-semibold text-lg text-primary-light">
                  Student Emotions:
                </Typography>
                {renderHTML(report.consultationContent.studentEmotions)}
              </div>
            )}
            {report.consultationContent?.studentReactions && (
              <div>
                <Typography className="font-semibold text-lg text-primary-light">
                  Student Reactions:
                </Typography>
                {renderHTML(report.consultationContent.studentReactions)}
              </div>
            )}
          </div>
        </section>

        {/* Consultation Conclusion */}
        <section className="mb-16">
          <Typography variant="h6" className="font-semibold mb-4 bg-primary-main pb-2 text-primary-contrastText px-8">
            Consultation Conclusion
          </Typography>
          <div className="mt-4 space-y-8 mx-8">
            {report.consultationConclusion?.counselorConclusion && (
              <div>
                <Typography className="font-semibold text-lg text-primary-light">
                  Counselor Conclusion:
                </Typography>
                {renderHTML(report.consultationConclusion.counselorConclusion)}
              </div>
            )}
            <div className='flex gap-8'>
              <Typography className="font-semibold text-lg text-primary-light">
                Follow-up Needed:
              </Typography>
              <Typography className='text-lg'>{report.consultationConclusion?.followUpNeeded ? 'Yes' : 'No'}</Typography>
            </div>
            {report.consultationConclusion?.followUpNotes && (
              <div>
                <Typography className="font-semibold text-lg text-primary-light">
                  Follow-up Notes:
                </Typography>
                {renderHTML(report.consultationConclusion.followUpNotes)}
              </div>
            )}
          </div>
        </section>

        {/* Intervention */}
        <section>
          <Typography variant="h6" className="font-semibold mb-4 bg-primary-main pb-2 text-primary-contrastText px-8">
            Intervention
          </Typography>
          <div className="mt-4 space-y-4 mx-8">
            {report.intervention?.type && (
              <div>
                <Typography className="font-semibold text-lg text-primary-light">
                  Type:
                </Typography>
                {renderHTML(report.intervention.type)}
              </div>
            )}
            {report.intervention?.description && (
              <div>
                <Typography className="font-semibold text-lg text-primary-light">
                  Description:
                </Typography>
                {renderHTML(report.intervention.description)}
              </div>
            )}
          </div>
        </section>
      </DialogContent>
    </div>
  );
}

export default ReportPreview