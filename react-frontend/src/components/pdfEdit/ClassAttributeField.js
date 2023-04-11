import * as React from "react";
import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";

// const attribute_list = ["lec", "rec", "lab", "office hours", "exam"];
const attribute_list = ["lec", "rec", "lab"];

const ClassAttributeField = ({
    attribute,
    index,
    attributes,
    setAttributes,
}) => {
    const handleChange = (event) => {
        let copied_attributes = [...attributes];
        copied_attributes[index] = event.target.value;
        setAttributes(copied_attributes);
        attribute = attributes[index];
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
                    value={attribute}
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
