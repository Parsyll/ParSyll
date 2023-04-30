import React, { useEffect, useState, useRef } from "react";
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import CourseTab from "../components/CourseTab";
import CourseDisplay from "../components/CourseDisplay";
import courseList from "../helper/course";
import axios from 'axios'
import parseApp from "../api/Axios";
import { useParams } from "react-router";
import loadingRunner from "../assets/loading.gif";

const CoursePage = () => {
    const [courses, setCourses] = useState([])
    const [course, setCourse] = useState(0) // index to course
    const [hasBeenEdited, setHasBeenEdited] = useState(false)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        getUserInformation()
    }, [hasBeenEdited]) 

    let {course_id} = useParams()

    const getUserInformation = async () => {
        let res = await parseApp
        .get("http://localhost:8000/users/get_current_user")
        .then(res => {
            let userData = res.data
            setCourses(userData.courses)
            setCourse(userData.courses.length - 1)
            setLoading(false)
        })
        return res
    }

    return (
        <>
        
            { !loading ?
                <div className="grid grid-cols-8">
                    <div className=" col-start-1 col-end-2 col-span-1">
                        <CourseTab courses={courses} setCourse={setCourse} course={course} course_id={course_id}/>
                    </div>
                    <div className="col-start-2 col-end-8 col-span-2">
                        {courses ? 
                            <CourseDisplay course={courses[course]}  hasBeenEdited={hasBeenEdited} setHasBeenEdited={setHasBeenEdited}/>
                            : ""
                        }
                    </div>
                </div> :
                    <div className=" flex flex-col align-middle p-5 items-center content-center justify-center snap-center">
                        <img
                            src={loadingRunner}
                            alt="loading..."
                            className=" w-2/12 h-1/6 align-middle"
                        />
                    </div>

            }
        </>
    )

}

export default CoursePage