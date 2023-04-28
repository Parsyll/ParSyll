import * as React from "react";
import { useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";

const days = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
];

function getStyles(name, personName, theme) {
    return {
        fontWeight:
            personName.indexOf(name) === -1
                ? theme.typography.fontWeightRegular
                : theme.typography.fontWeightMedium,
    };
}

export default function DaysOfWeekField({
    dayOfWeek,
    index,
    setDaysOfWeek,
}) {
    const theme = useTheme();

    const handleChange = (event) => {
        setDaysOfWeek("day_of_week", event.target.value, index);
    };

    return (
        <Box>
            <FormControl variant="standard" sx={{ width: 300 }} fullWidth>
                <InputLabel id="demo-simple-select-standard-label">
                    Day of week
                </InputLabel>
                <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={dayOfWeek}
                    onChange={handleChange}
                >
                    {days.map((day) => (
                        <MenuItem
                            key={day}
                            value={day}
                            style={getStyles(day, [], theme)}
                        >
                            {day}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
        </Box>
    );
}
