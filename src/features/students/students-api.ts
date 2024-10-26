import { Student } from '@/shared/types';
import { ApiResponse, apiService as api } from '@shared/store'


export const addTagTypes = [
  'students'
] as const;


export const studentsApi = api
  .enhanceEndpoints({
    addTagTypes
  })
  .injectEndpoints({
    endpoints: (build) => ({
      createStudentDocument: build.mutation<void, CreateStudentCounselingDocumentApiArg>({
        query: (arg) => ({
          url: `/api/students/document/info`,
          method: 'POST',
          body: arg
        }),
        invalidatesTags: ['students']
      }),
      getStudentDocument: build.query<GetStudentDocumentApiResponse, void>({
        query: () => ({
          url: `/api/students/document/info`,
        }),
        providesTags: ['students']
      }),
    })
  })

export const {
  useCreateStudentDocumentMutation,
  useGetStudentDocumentQuery
} = studentsApi


export type CreateStudentCounselingDocumentApiArg = StudentCounselingDocumentInfo
export type GetStudentDocumentApiResponse = ApiResponse<StudentDocument>

export type StudentDocument = {
  studentProfile: Student,
  counselingProfile: StudentCounselingDocumentInfo
  counselingAppointment: []
}

export type StudentCounselingDocumentInfo = {
  introduction: string;
  currentHealthStatus: string;
  psychologicalStatus: string;
  stressFactors: string;
  academicDifficulties: string;
  studyPlan: string;
  careerGoals: string;
  partTimeExperience: string;
  internshipProgram: string;
  extracurricularActivities: string;
  personalInterests: string;
  socialRelationships: string;
  financialSituation: string;
  financialSupport: string;
  desiredCounselingFields: string;
};