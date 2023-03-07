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
                {/* <ProfessorCard professor={course.professor} /> */}
                
                <h1 className=" pl-3 pt-4 text-3xl font-bold">Teaching Assistants:</h1>
                {/* <div className={`grid grid-cols-${Math.min(course.tas.length, 3)} p-4 mt-6"`}>
                    {course.tas.map( (ta, index) => (
                        <TaCard key={index} ta={ta} index={index}/>
                    ))}
                </div> */}

                <h1 className=" pl-3 pt-4 text-3xl font-bold">Lecture times: </h1>
                {/* <div className={`grid grid-cols-${Math.min(course.classTimes.length, 3)} p-4`}>
                    {course.classTimes.map( (time, index) => (
                        <ClassHourCard time={time} key={index}/>
                    ))}

                </div> */}
                <Button variant="text">Download ICS</Button>
            </div>
            : 
            <h1 className=" text-5xl text-center font-bold">Wow, such empty</h1>
        }
        </div>
    )

}

export default CourseDisplay