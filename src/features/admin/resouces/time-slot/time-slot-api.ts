import { Account, PaginationContent, Role } from '@/shared/types';
import { TimeSlot } from '@/shared/types/admin';
import { apiService, ApiResponse, ApiMessage } from '@shared/store';
import { url } from 'inspector';

const addTagTypes = ['time-slots'] as const;

export const timeSlotsApi = apiService
	.enhanceEndpoints({
		addTagTypes,
	})
	.injectEndpoints({
		endpoints: (build) => ({
			getTimeSlots: build.query<getTimeSlotsResponse, getTimeSlotsArgs>({
				query: () => ({
					url: `/api/manage/counselors/counselling-slots`,
				}),
				providesTags: ['time-slots'],
			}),
			getTimeSlotById: build.query<
				ApiResponse<TimeSlot>,
				number | string
			>({
				query: (id) => ({
					url: `/api/manage/counselors/counselling-slots/${id}`,
				}),
				providesTags: ['time-slots'],
			}),
			postCreateTimeSlot: build.mutation<
				postCreateTimeSlotResponse,
				postCreateTimeSlotArgs
			>({
				query: ({ slotCode, name, startTime, endTime }) => ({
					url: `/api/manage/counselors/counselling-slots`,
					method: 'POST',
					body: {
						slotCode,
						name,
						startTime,
						endTime,
					},
				}),
				invalidatesTags: ['time-slots'],
			}),

			putUpdateTimeSlot: build.mutation<
				putUpdateTimeSlotResponse,
				putUpdateTimeSlotArgs
			>({
				query: ({ id, slotCode, name, startTime, endTime }) => ({
					url: `/api/manage/counselors/counselling-slots/${id}`,
					method: 'PUT',
					body: {
						slotCode,
						name,
						startTime,
						endTime,
					},
				}),
				invalidatesTags: ['time-slots'],
			}),
			deleteTimeSlot: build.mutation<
				deleteTimeSlotResponse,
				deleteTimeSlotArgs
			>({
				query: (arg) => ({
					url: `/api/manage/counselors/counselling-slots/${arg}`,
					method: 'DELETE',
				}),
				invalidatesTags: ['time-slots'],
			}),
		}),
	});

export const {
	useDeleteTimeSlotMutation,
	useGetTimeSlotsQuery,
	usePostCreateTimeSlotMutation,
	usePutUpdateTimeSlotMutation,
	useGetTimeSlotByIdQuery,
} = timeSlotsApi;

type getTimeSlotsArgs = {};

type getTimeSlotsResponse = ApiResponse<TimeSlot[]>;

type putUpdateTimeSlotArgs = {
	id: number | string;
	slotCode: string;
	name: string;
	startTime: string;
	endTime: string;
};
type putUpdateTimeSlotResponse = ApiResponse<TimeSlot>;

type deleteTimeSlotArgs = number | string;
type deleteTimeSlotResponse = ApiResponse<TimeSlot>;

type postCreateTimeSlotResponse = ApiMessage;
type postCreateTimeSlotArgs = {
	slotCode: string;
	name: string;
	startTime: string;
	endTime: string;
};
