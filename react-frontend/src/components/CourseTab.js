import * as React from "react";
import PropTypes from "prop-types";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";

function a11yProps(index) {
    return {
        id: `vertical-tab-${index}`,
        "aria-controls": `vertical-tabpanel-${index}`,
    };
}

export default function CourseTab({ courses, setCourse, course }) {
    const [value, setValue] = React.useState(course);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    const handleSetCourse = (index) => {
        setCourse(index);
    };

    return (
        <Box sx={{ flexGrow: 1, bgcolor: "background.paper", display: "flex" }}>
            <Tabs
                orientation="vertical"
                // variant="scrollable"
                value={value}
                onChange={handleChange}
                aria-label="Vertical tabs example"
                sx={{ borderRight: 1, borderColor: "divider" }}
            >
                {courses.map((course, index) => (
                    <Tab
                        key={index}
                        label={course.name ? course.name : `course ${index + 1}`}
                        {...a11yProps(index)}
                        onClick={() => {
                            handleSetCourse(index);
                        }}
                    />
                ))}
            </Tabs>
        </Box>
    );
}
