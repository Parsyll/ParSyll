import React, { useEffect, useState, useRef } from "react";
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import CourseTab from "../components/CourseTab";
import CourseDisplay from "../components/CourseDisplay";
import courseList from "../helper/course";
import axios from 'axios'
import parseApp from "../api/Axios";

const CoursePage = () => {
    const [courses, setCourses] = useState([])
    const [course, setCourse] = useState(0)
    const [hasBeenEdited, setHasBeenEdited] = useState(false)
    
    useEffect(() => {
        getUserInformation()
    }, [hasBeenEdited]) 

    const getUserInformation = async () => {
        let res = await parseApp
        .get("http://localhost:8000/users/get_current_user")
        .then(res => {
            let userData = res.data
            // console.log(userData.courses)
            setCourses(userData.courses)
            setCourse(userData.courses.length - 1)
        })
        return res
    }

    return (
        <div className="grid grid-cols-8">
            <div className=" col-start-1 col-end-2 col-span-1">
                <CourseTab courses={courses} setCourse={setCourse} course={course}/>
            </div>
            <div className="col-start-2 col-end-8 col-span-2">
                {courses ? 
                    <CourseDisplay course={courses[course]}  hasBeenEdited={hasBeenEdited} setHasBeenEdited={setHasBeenEdited}/>
                    : <h1>BRUH</h1>
                }
            </div>
        </div>
    )

}

export default CoursePage