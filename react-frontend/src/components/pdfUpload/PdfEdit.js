import InstructorField from "../pdfEdit/InstructorField";
import { useContext, useEffect, useState } from "react";
import DaysOfWeekField from "../pdfEdit/DaysOfWeekField";
import LocationsField from "../pdfEdit/LocationsField";
import TimePicker from "../pdfEdit/TimePicker";
import AddButton from "../pdfEdit/AddButton";
import parseApp from "../../api/Axios";
import { AuthContext } from "../../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import MinusButton from "../pdfEdit/MinusButton";

export const PdfEdit = ({course, fileInfo}) => {
    const [classStart, setClassStart] = useState("")
    const [classEnd, setClassEnd] = useState("")
    const [daysOfWeek, setDaysOfWeek] = useState([])
    const [instructors, setInstructors] = useState([])
    const [locations, setLocations] = useState([])
    const [name, setName] = useState("")
    const [officeHours, setOfficeHours] = useState([])
    const [textbook, setTextBook] = useState("")
    const [courseId, setCourseId] = useState("")
    const [icsFile, setIcsFile] = useState([])
    const [syllabus, setSyllabus] = useState("")
    const [id, setId] = useState("")

    let navigate = useNavigate()

    useEffect(() => {
        setClassStart(course.class_start)
        setClassEnd(course.class_end)
        setDaysOfWeek(course.days_of_week)
        setInstructors(course.instructors)
        setLocations(course.locations)
        setName(course.name)
        setOfficeHours(course.office_hrs)
        setTextBook(course.textbook)
        setCourseId(course.id)
        setIcsFile(course.ics_file)
        setSyllabus(course.syllabus)
        setId(course.id)
    }, [course])

    let {user} = useContext(AuthContext);
    let uid = user.uid

    const handlePDFParseSubmission = (e) => {
        e.preventDefault()

        let userBody = {
            name: name,
            instructors: instructors,
            locations: locations,
            syllabus: syllabus,
            class_start: classStart,
            class_end: classEnd,
            days_of_week: daysOfWeek,
            office_hrs: officeHours,
            ics_file: icsFile,
            textbook: textbook,
            id: id
        }


        parseApp.put(`/courses/${uid}/${fileInfo.course_id}`, userBody)
        .then((res) => {
            console.log(res)
            navigate("/dashboard/courses")

        })
    }

    return (
    <div style={{backgroundColor : 'white', overflowY:'scroll'}} className=" sm:mx-32 lg:mx-32 xl:mx-72 rounded-lg p-5">
    <div className="flex justify-between container mx-auto">
        <div className="w-full">
        <div className="mt-4 px-4">
            <h1 className="font-thinner flex text-4xl pt-10 px-5">Just a few more steps...</h1>
            <form className="mx-5 my-5">

            <h1 className="text-2xl font-semibold mt-10 mb-3">Class Information :</h1>
            <label className="relative block p-3 border-2 border-black rounded mb-4 w-11/12" htmlFor="name">
                <span className="text-md font-semibold text-zinc-900" htmlFor="name">
                Name of Class
                </span>
                <input className="w-full bg-transparent p-0 text-sm  text-gray-500 focus:outline-none" id="name" 
                type="text" placeholder="Class Name" value={name} onChange={(e)=> setName(e.target.value)}/>
            </label>
            <h1 className="text-2xl font-semibold mt-10 mb-3">Instructors: 
                <span>
                    <AddButton originalValue={instructors} insertValue="" setValue={setInstructors}/>
                </span>
            </h1>
            {
                instructors?
                instructors.map((instructor, index) => (
                    <div className=" flex flex-row align-middle justify-between" key={index}>
                        <InstructorField instructor={instructor} index={index} 
                        setInstructors={setInstructors} instructors={instructors}/>
                        <MinusButton index={index} originalValue={instructors} setValue={setInstructors}/>
                    </div>
                )):""
            }
            
            <h1 className="text-2xl font-semibold mt-10 mb-3">Locations: 
                <span>
                    <AddButton originalValue={locations} insertValue="" setValue={setLocations}/>
                </span>
            </h1>
            {
                locations?
                locations.map((location, index) => (
                    <div className=" flex flex-row align-middle justify-between" key={index}>
                        <LocationsField location={location} key={index} index={index}
                        setLocations={setLocations} locations={locations}/>
                        <MinusButton index={index} originalValue={locations} setValue={setLocations}/>
                    </div>
                )):""
            }
            <h1 className="text-2xl font-semibold mt-10">Class Times :</h1>
            <TimePicker label={"Start-Time"}/> <TimePicker label={"End-Time"}/>
            <DaysOfWeekField daysOfWeek={daysOfWeek} setDaysOfWeek={setDaysOfWeek}/>
            
            <h1 className="text-2xl font-semibold mt-3">Office Hours:
                <span>
                    <AddButton /> 
                </span>
            </h1>

            {
                officeHours?
                officeHours.map((officeHour, index) => (
                    <officeHoursField officeHours={officeHour} key={index} />
                )):""
            }

            <h1 className="text-2xl font-semibold mt-10">Miscellaneous: 
                <span>
                    <AddButton /> 
                </span>
            </h1>
            <label className="relative block p-3 border-2 mt-5 border-black rounded w-11/12" htmlFor="name">
                <span className="text-md font-semibold text-zinc-900" htmlFor="name">
                Textbook
                </span>
                <input className="w-full   p-0 text-sm border-none bg-transparent text-gray-500 focus:outline-none" 
                type="text" placeholder="Enter Textbook name" onChange={(e) => setTextBook(e.target.value)} vaue={textbook}/>
            </label>
           
            <h1 className="text-2xl font-semibold mt-10">Category :</h1>
            <p className="text-black text-sm font-normal flex gap gap-2 pt-2">
                <button className="border-2 border-black rounded-md border-b-4 border-l-4 font-black px-2">Business</button>
                <button className="border-2 border-black rounded-md border-b-4 border-l-4 font-black px-2">Creative</button>
                <button className="border-2 border-black rounded-md border-b-4 border-l-4 font-black px-2">Education</button>
            </p>
            <p className="text-black text-sm font-normal flex gap gap-2 pt-2">
                <button className="border-2 border-black rounded-md border-b-4 border-l-4 font-black px-2">Tech</button>
                <button className="border-2 border-black rounded-md border-b-4 border-l-4 font-black px-2">Entertainment</button>
                <button className="border-2 border-black rounded-md border-b-4 border-l-4 font-black px-2">Other</button>
            </p>
            <button className="mt-5 border-2 px-5 py-2 rounded-lg border-black 
            'border-b-4 font-black translate-y-2 border-l-4"
                onClick={handlePDFParseSubmission}
            >
                Submit
            </button>
            </form>
        </div>
        </div>
    </div>
    </div>
    );
}

export default PdfEdit