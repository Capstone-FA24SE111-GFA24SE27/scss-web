import dayjs from "dayjs";
import { Appointment } from "../types";

export const groupAppointmentsByDate = (appointments: Appointment[] = []) => {
  const today = dayjs();
  const tomorrow = dayjs().add(1, 'day');

  // Sort appointments by startDateTime
  const sortedAppointments = [...(appointments)].sort((a, b) =>
    dayjs(a.startDateTime).diff(dayjs(b.startDateTime))
  );

  // Group sorted appointments by date
  return sortedAppointments.reduce((groups, appointment) => {
    const startDate = dayjs(appointment.startDateTime);
    let dateLabel;

    if (startDate.isSame(today, 'day')) {
      dateLabel = 'Today';
    } else if (startDate.isSame(tomorrow, 'day')) {
      dateLabel = 'Tomorrow';
    } else {
      dateLabel = startDate.format('YYYY/MM/DD');
    }

    if (!groups[dateLabel]) {
      groups[dateLabel] = [];
    }
    groups[dateLabel].push(appointment);
    return groups;
  }, {});
};
