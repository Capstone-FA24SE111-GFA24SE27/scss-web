import { Account, PaginationContent } from '@shared/types';
import { ApiResponse, apiService as api } from '@shared/store'


export const addTagTypes = [
  'appointments'
] as const;


export const reportApi = api
  .enhanceEndpoints({
    addTagTypes
  })
  .injectEndpoints({
    endpoints: (build) => ({
      createCounselingReport: build.mutation<void, CreateReportApiArg>({
        query: (arg) => ({
          method: 'POST',
          url: `/api/appointments/report/${arg.appointmentId}`,
          body: arg.report
        }),
      }),

    })
  })

export const {
  useCreateCounselingReportMutation
} = reportApi

type CreateReportApiArg = {
  appointmentId: string,
  report: Report
}

type Report = {
  consultationGoal?: {
    specificGoal?: string;
    reason?: string;
  };
  consultationContent?: {
    summaryOfDiscussion?: string;
    mainIssues?: string;
    studentEmotions?: string;
    studentReactions?: string;
  };
  consultationConclusion?: {
    counselorConclusion?: string;
    followUpNeeded?: boolean;
    followUpNotes?: string;
  };
  intervention?: {
    type?: string;
    description?: string;
  };
};