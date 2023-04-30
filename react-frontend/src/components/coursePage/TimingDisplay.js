import ClassHourCard from "./ClassHourCard"
import { useState } from "react"
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import { IconButton } from '@mui/material';

const dayMapping = {
    "monday":0,
    "tuesday":1,
    "wednesday":2,
    "thursday":3,
    "friday":4,
    "saturday":5,
    "sunday":6,
}

const TimingDisplay = ({timings, header, headerColour}) => {
    const [hidden, setHidden] = useState(false)

    const handleChangeButtonState = (e) => {
        e.preventDefault()
        setHidden(!hidden)
    }

    const compareFn = (a, b) => {
        const aEnum = dayMapping[a.day_of_week.toLowerCase()]
        const bEnum = dayMapping[b.day_of_week.toLowerCase()]

        if (aEnum > bEnum) return 1;
        if (aEnum < bEnum) return -1;
        return 0;
    }

    return (
        <>
        {(timings.length > 0) ?
            <>
            <div className="flex flex-row justify-between mb-3">
                <h1 className={`pl-3 pt-4 text-3xl font-bold ${headerColour}`}>
                    {header}{" "}
                </h1>
                <IconButton aria-label="show" size="small" onClick={handleChangeButtonState} disableRipple>
                    {hidden ? 
                        <AddIcon fontSize="small" /> :
                        <RemoveIcon fontSize="small" />
                }
                </IconButton>
            
            </div>
            <div
            className={`grid grid-cols-${Math.min(
                timings.length,
                3
            )} p-4 ${hidden? "hidden" : ""}`}
            >
                {timings.sort(compareFn).map((timing, index) => {
                    return (
                            <ClassHourCard
                                weekday={timing.day_of_week}
                                startTime={timing.start}
                                endTime={timing.end}
                                location={timing.location}
                                attribute={timing.attribute}
                                key={index}
                                index={index}
                            />
                        )
                }
                )}
            </div>
            </>:""
        }
        </>
    )


}

export default TimingDisplay