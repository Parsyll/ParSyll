import * as React from "react";
import { useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import Chip from "@mui/material/Chip";

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
    PaperProps: {
        style: {
            maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
            width: 250,
        },
    },
};

const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

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
    daysOfWeek,
    setDaysOfWeek,
}) {
    const theme = useTheme();

    const handleChange = (event) => {
        let copied_daysOfWeek = [...daysOfWeek];
        copied_daysOfWeek[index] = event.target.value;
        setDaysOfWeek(copied_daysOfWeek);
        dayOfWeek = daysOfWeek[index];
    };

    return (
        <div>
            <Box>
                <FormControl variant="filled" sx={{ width: 300 }} fullWidth>
                    <InputLabel id="demo-simple-select-label">
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
                                style={getStyles(day, daysOfWeek, theme)}
                            >
                                {day}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </Box>
        </div>
    );
}
