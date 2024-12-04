import dayjs from "dayjs";
import { monthsOfYear } from "../constants";
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'

export function isDateRangeOverlapping(
	startDate1: Date,
	endDate1: Date,
	startDate2: Date,
	endDate2: Date
): boolean {
	// Ensure start dates are before end dates
	// console.log('date : ', startDate1);
	if (startDate1 > endDate1 || startDate2 > endDate2) {
		throw new Error('Start date must be before end date.');
	}

	// Check for overlap
	return (
		(startDate1 <= startDate2 && endDate1 >= startDate2) ||
		(startDate1 >= startDate2 && startDate1 <= endDate2)
	);
}

export function dateMsToString(time: number) {
	// Example timestamp in milliseconds
	const timestamp = 1695763200000;

	// Convert to a Date object
	const date = new Date(timestamp);

	// Get local time as a string
	const localTime = date.toLocaleString();

	return localTime
}

export const formatDateTime = (inputDate) => {
	dayjs.extend(utc)
	dayjs.extend(timezone)
	const today = dayjs();
	const userTimezone = dayjs.tz.guess()
	const date = dayjs(inputDate).tz(userTimezone);

	if (date.isSame(today, 'day')) {
		return date.format('h:mm A');
	} else if (date.isSame(today, 'year')) {
		return date.format('MMM D [at] h:mm A');
	} else {
		return date.format('MMM D, YYYY [at] h:mm A');
	}
};

export const getCurrentMonthYear = () => {
	const currentDate = new Date();
	const currentMonth = monthsOfYear[currentDate.getMonth()];
	const currentYear = currentDate.getFullYear();

	return `${currentMonth}, ${currentYear}`;
}


export const getMonthYearFromDate = (date: string) => {
  const dayjsDate = dayjs(date);

  const currentMonth = monthsOfYear[dayjsDate.month()];
  const currentYear = dayjsDate.year(); 

  return `${currentMonth}, ${currentYear}`;
};