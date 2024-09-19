export function isDateRangeOverlapping(startDate1: Date, endDate1: Date, startDate2: Date, endDate2: Date): boolean {
    // Ensure start dates are before end dates
    console.log('date : ', startDate1)
    if (startDate1 > endDate1 || startDate2 > endDate2) {
      throw new Error('Start date must be before end date.');
    }
  
    // Check for overlap
    return (startDate1 <= startDate2 && endDate1 >= startDate2) ||
           (startDate1 >= startDate2 && startDate1 <= endDate2);
  }