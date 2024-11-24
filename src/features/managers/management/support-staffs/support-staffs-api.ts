import {
  Appointment,
  AppointmentFeedback,
  AppointmentReportType,
  AppointmentRequest,
  SupportStaff,
  PaginationContent,
  Profile,
} from '@/shared/types';
import { ApiResponse, apiService as api } from '@shared/store';

export const addTagTypes = [
  'supportStaffs',
] as const;

export const supportStaffsMangementApi = api
  .enhanceEndpoints({
    addTagTypes,
  })
  .injectEndpoints({
    endpoints: (build) => ({
      getSupportStaffsManagement: build.query<SupportStaffsManagementApiResponse, SupportStaffsManagementApiArg>({
        query: ({ page = 1, size = 10, search = '', sortBy = 'id', sortDirection = 'ASC' }) => ({
          url: `/api/support-staff/filter`,
          params: {
            page,
            search,
            size,
            sortBy,
            sortDirection,
          },
        }),
        providesTags: ['supportStaffs'],
      }),
      getSupportStaffManagement: build.query<GetSupportStaffManagementApiResponse, GetSupportStaffManagementApiArg>({
        query: (id) => ({
          url: `/api/support-staff/${id}`,
        }),
        providesTags: (result, error, id) => [{ type: 'supportStaffs', id }],
      }),
    }),
  });

export const {
  useGetSupportStaffsManagementQuery,
  useGetSupportStaffManagementQuery
} = supportStaffsMangementApi;

export type SupportStaffsManagementApiResponse = ApiResponse<PaginationContent<SupportStaff>>

export type SupportStaffsManagementApiArg = {
  page?: number;
  search?: string;
  sortBy?: string,
  sortDirection?: string,
  size?: number,
};

export type GetSupportStaffManagementApiResponse = ApiResponse<SupportStaff>;
export type GetSupportStaffManagementApiArg = string;
