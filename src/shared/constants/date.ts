import dayjs from "dayjs";

export const daysOfWeek = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY'];
export const monthsOfYear = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

export const today = dayjs().format('YYYY-MM-DD');
export const yesterday = dayjs().subtract(1, 'day').format('YYYY-MM-DD');
export const lastDayOfWeek = dayjs().subtract(7, 'day').format('YYYY-MM-DD');

export const firstDayOfMonth = dayjs().startOf('month').format('YYYY-MM-DD')
export const lastDayOfMonth = dayjs().endOf('month').format('YYYY-MM-DD');

export const firstDayPreviousMonth = dayjs().subtract(1, 'month').startOf('month').format('YYYY-MM-DD');
export const lastDayOfPreviousMonth = dayjs().subtract(1, 'month').endOf('month').format('YYYY-MM-DD');

export const firstDay2PreviousMonth = dayjs().subtract(2, 'month').startOf('month').format('YYYY-MM-DD');
export const lastDayOf2PreviousMonth = dayjs().subtract(2, 'month').endOf('month').format('YYYY-MM-DD');

export const firstDay3PreviousMonth = dayjs().subtract(3, 'month').startOf('month').format('YYYY-MM-DD');
export const lastDayOf3PreviousMonth = dayjs().subtract(3, 'month').endOf('month').format('YYYY-MM-DD');

export const firstDay4PreviousMonth = dayjs().subtract(3, 'month').startOf('month').format('YYYY-MM-DD');
export const lastDayOf4PreviousMonth = dayjs().subtract(3, 'month').endOf('month').format('YYYY-MM-DD');


export const periodDateRange: Record<string, DateRange> = {
  month: {
    from: firstDayOfMonth,
    to: lastDayOfMonth,
  },
  week: {
    from: lastDayOfWeek,
    to: today,
  },
  day: {
    from: today,
    to: today,
  },
};

type DateRange = {
  from: string;
  to: string;
};
