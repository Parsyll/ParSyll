import * as React from "react";
import PropTypes from "prop-types";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";

import { useNavigate } from "react-router-dom";

function a11yProps(index) {
    return {
        id: `vertical-tab-${index}`,
        "aria-controls": `vertical-tabpanel-${index}`,
    };
}

export default function CourseTab({ courses, setCourse, course, course_id }) {
    const [value, setValue] = React.useState(course);

    const navigate = useNavigate();

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    React.useEffect(() => {
        if(!courses || courses.length <= 0) return;

        let i = 0;

        for(i = 0; i < courses.length; i++) {
            if(courses[i].id === course_id) {
                break;
            }
        }
        if(i == courses.length) {
            console.log(courses)
            navigate(`/dashboard/courses/${courses[0].id}`)
        } else {
            setCourse(i)
            setValue(i)
        }

    }, [courses, course_id])

    const handleSetCourse = (index, course) => {
        navigate(`/dashboard/courses/${course.id}`) 
    };

    return (
        <Box sx={{ flexGrow: 1, bgcolor: "background.paper", display: "flex" }}>
            <Tabs
                orientation="vertical"
                value={value}
                onChange={handleChange}
                aria-label="Vertical tabs example"
                sx={{ borderRight: 1, borderColor: "divider" }}
            >
                {courses.map((course, index) => (
                    <Tab
                        key={course.id}
                        label={course.name ? course.name : `course ${index + 1}`}
                        {...a11yProps(index)}
                        onClick={() => {
                            handleSetCourse(index, course);
                        }}
                    />
                ))}
            </Tabs>
        </Box>
    );
}
