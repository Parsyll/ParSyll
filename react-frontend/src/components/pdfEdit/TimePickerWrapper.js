import { useEffect, useState } from "react";
import dayjs from 'dayjs';
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

export const TimePickerWrapper = ({ label, index, time, times, setTimes }) => {
    
    const handleParseTime = (datetimeString) => {
        const datetime = new Date(datetimeString);
        let parsedTime = datetime.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
        });

        return parsedTime;
    }

    const getTimeStamp = (timeString) => {
        if (!timeString || timeString == "0") {
            //Same default value as backend
            timeString = "12:00 AM";
        }

        const [hours, minutesWithMeridian] = timeString.split(':');
        const meridian = timeString.slice(-2);
        const minutes = minutesWithMeridian.slice(0, 2);
        const timestamp = Date.parse(`01/01/1970 ${hours}:${minutes} ${meridian}`);

        return timestamp;
    }

    const handleChangeTimeinArray = (time) => {
        time = handleParseTime(time.toString());
        let copied_times = [...times];
        copied_times[index] = time;
        setTimes(copied_times);
        time = times[index];
    };


    return (
        <div className="mt-5 p-3 inline-flex items-baseline ">
            <div className="flex">
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <TimePicker
                        label={label}
                        value={dayjs(getTimeStamp(time))}
                        onChange={(newTime) => handleChangeTimeinArray(newTime)}
                    />
                </LocalizationProvider>
            </div>
        </div>
    );
};

export default TimePickerWrapper;
