import * as React from "react";
import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";

const ClassAttributeField = ({
    field,
    attribute,
    index,
    setAttributes,
    attribute_list
}) => {
    const handleChange = (event) => {
        setAttributes(field, event.target.value, index);
    };

    return (
        <Box>
            <FormControl variant="standard" sx={{ width: 300 }} fullWidth>
                <InputLabel id="demo-simple-select-standard-label">
                    Class type
                </InputLabel>
                <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={attribute.toUpperCase()}
                    onChange={handleChange}
                >
                    {attribute_list.map((attribute_option) => (
                        <MenuItem
                            key={attribute_option}
                            value={attribute_option}
                        >
                            {attribute_option}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
        </Box>
    );
};

export default ClassAttributeField;
