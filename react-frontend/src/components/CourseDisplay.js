import React, { useEffect, useState, useRef } from "react";
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Button from '@mui/material/Button';
import ProfessorCard from "./coursePage/ProfessorCard";
import TaCard from "./coursePage/TaCard";
import ClassHourCard from "./coursePage/ClassHourCard";

const CourseDisplay = ({course}) => {
    // const [courseName, setCourseName] = useState(course.courseName)
    // const [classTimes, setClassTimes] = useState(course.classTimes)
    // const [professor, setProfessor] = useState(course.professor)
    // const [tas, setTAs] = useState(course.tas)
    // const [location, setLocation] = useState("Wetherill Lab of Chemistry 172")
    // const [credits, setCredits] = useState(3)

    return (
        <div className=" flex flex-col align-middle justify-center mt-6 items-center pl-3">
        {course ? 
            <div>
                <h1 className=" text-5xl text-center font-bold">{course.name}</h1>
                {/* <ProfessorCard professor={course.instructors} /> */}
                
                <h1 className=" pl-3 pt-4 text-3xl font-bold">Location: {course.locations}</h1>
                <h1 className=" pl-3 pt-4 text-3xl font-bold">Instructors:</h1>
                <div className={`grid grid-cols-${Math.min(course.instructors.length, 3)} p-4 mt-6"`}>
                    {course.instructors.map( (instructor, index) => (
                        <TaCard key={index} instructor={instructor} index={index}/>
                    ))}
                </div>

                <h1 className=" pl-3 pt-4 text-3xl font-bold">Lecture times: </h1>
                <div className={`grid grid-cols-${Math.min(course.days_of_week.length, 3)} p-4`}>
                    {course.days_of_week.map( (weekday, index) => (
                        <ClassHourCard weekday={weekday} startTime={course.class_start} endTime={course.class_end} key={index}/>
                    ))}

                </div>
                <Button variant="text">Download ICS</Button>
            </div>
            : 
            <h1 className=" text-5xl text-center font-bold">Wow, such empty</h1>
        }
        </div>
    )

}

export default CourseDisplay