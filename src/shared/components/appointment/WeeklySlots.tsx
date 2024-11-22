import { daysOfWeek } from "@/shared/constants";
import { CounselingSlot } from "@/shared/types";
import { Paper } from "@mui/material";
import dayjs from "dayjs";
import React from "react";


const WeeklySlots = ({ slots }: { slots: CounselingSlot[] }) => {
  if (!slots?.length) {
    return <></>
  }
  console.log(slots)
  const slotNames = Array.from(
    new Set(slots.map((slot) => slot.name))
  ).sort(); // Extract and sort unique slot names

  // Map slots into a lookup by day and slot
  const slotLookup = (day: string, slotName: string) => {
    return slots.find(
      (slot) => slot.dayOfWeek === day && slot.name === slotName
    );
  };

 

  return (
    <div className="flex flex-col items-center">
      <div className="overflow-hidden rounded">
        <table className="table-auto border-collapse border overflow-hidden">
          <thead>
            <tr className="">
              <th className="border p-8  bg-primary-main/5">
              </th>
              {daysOfWeek.map((day) => (
                <th
                  key={day}
                  className="border p-8 px-12 bg-primary-main/5 "
                >
                  {day}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {slotNames.map((slotName) => (
              <tr key={slotName}>
                <td className="border p-8 text-center px-12 font-semibold">
                  {slotName}
                </td>
                {daysOfWeek.map((day) => {
                  const slot = slotLookup(day, slotName);
                  return (
                    <td
                      key={`${day}-${slotName}`}
                      className="border p-8 text-center"
                    >
                      {slot ? (
                        <div className="">
                          <p className="">{dayjs(slot.startTime, 'HH:mm:ss').format('HH:mm')}</p>
                          <p className="">{dayjs(slot.endTime, 'HH:mm:ss').format('HH:mm')}</p>
                        </div>
                      ) : (
                        "-"
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default WeeklySlots;
