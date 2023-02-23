import React, { useEffect, useState, useRef } from "react";
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import CourseTab from "../components/CourseTab";
import CourseDisplay from "../components/CourseDisplay";
import courseList from "../helper/course";

const CoursePage = () => {
    const [courses, setCourses] = useState(courseList)
    const [course, setCourse] = useState(0)

    return (
        <div className="grid grid-cols-8">
            <div className=" col-start-1 col-end-2 col-span-1">
                <CourseTab courses={courses} setCourse={setCourse}/>
            </div>
            <div className="col-start-2 col-end-8 col-span-2">
                <CourseDisplay course={courseList[course]}/>
            </div>
        </div>
    )

}

export default CoursePage