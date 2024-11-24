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
			postCreateTimeSlot: build.mutation<
				postCreateTimeSlotResponse,
				postCreateTimeSlotArgs
			>({
				query: ({
                    slotCode,
                    name,
                    startTime,
                    endTime,
                }) => ({
					url: `/api/manage/counselors/counselling-slots`,
					method: 'POST',
					body: {
                        slotCode,
                        name,
                        startTime : {
                            hour: startTime.hour,
                            minute: startTime.minute,
                            second: 0,
                            nano: 0
                        },
                        endTime : {
                            hour: endTime.hour,
                            minute: endTime.hour,
                            second: 0,
                            nano: 0
                        },
                    }
				}),
				invalidatesTags: ['time-slots'],
			}),

			putUpdateTimeSlot: build.mutation<
				putUpdateTimeSlotResponse,
				putUpdateTimeSlotArgs
			>({
				query: (arg) => ({
					url: `/api/manage/counselors/counselling-slots/${arg}`,
					method: 'PUT',
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
    usePutUpdateTimeSlotMutation
} = timeSlotsApi;

type getTimeSlotsArgs = {}

type getTimeSlotsResponse = ApiResponse<TimeSlot[]>;

type putUpdateTimeSlotArgs = number | string;
type putUpdateTimeSlotResponse = ApiResponse<TimeSlot>;

type deleteTimeSlotArgs = number | string;
type deleteTimeSlotResponse = ApiResponse<TimeSlot>;

type postCreateTimeSlotResponse = ApiMessage;
type postCreateTimeSlotArgs = {
	slotCode: string;
	name: string;
	startTime: {
		hour: number;
		minute: number;
		second: number;
		nano: number;
	};
	endTime: {
		hour: number;
		minute: number;
		second: number;
		nano: number;
	};
};
