import { firstDayOfMonth, lastDayOfMonth, lastDayOfWeek, today } from "./date";

export const statusLabel = {
  VERIFIED: 'Verified',
  PENDING: 'Pending',
  FLAGGED: 'Flagged',
  REJECTED: 'Rejected',
};

export const counselingTypeLabel = {
  ACADEMIC: 'Academic',
  NON_ACADEMIC: 'Non-Academic',
}

export const counselingTypeDescription = {
  ACADEMIC: 'Get guidance on your educational path, course selection, and career planning,...',
  NONE_ACADEMIC: 'Receive support for mental well-being, personal growth, relationship,...',
}

export const dateRangeLabel = {
  'month': `${firstDayOfMonth} - ${lastDayOfMonth}`,
  'week': `${lastDayOfWeek} - ${today}`,
  'day': `${today}`,
}