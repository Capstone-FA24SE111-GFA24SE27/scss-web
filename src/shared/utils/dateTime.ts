export function isDateRangeOverlapping(
	startDate1: Date,
	endDate1: Date,
	startDate2: Date,
	endDate2: Date
): boolean {
	// Ensure start dates are before end dates
	console.log('date : ', startDate1);
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

