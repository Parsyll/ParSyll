import InstructorField from "../pdfEdit/InstructorField";
import { useEffect, useState } from "react";
import AddButton from "../pdfEdit/AddButton";
import parseApp from "../../api/Axios";
import { useNavigate } from "react-router-dom";
import { useUser } from "../../hooks/useUser";
import ClassTimeField from "../pdfEdit/ClassTimeField";
import CategoryField from "../pdfEdit/CategoryField";
import { Button } from "@mui/material";
import MiscellaneousField from "../pdfEdit/MiscellaneousField";
import SingleFieldInput from "../pdfEdit/SingleFieldInput";
import GradingSchemeField from "../pdfEdit/GradingSchemeField";

export const PdfEdit = ({ course, handleClose }) => {
    //i'm so sorry, it was the only way
    const [name, setName] = useState(course.name ? course.name : "");
    const [instructors, setInstructors] = useState(
        course.instructors ? course.instructors : []
    );
    const [syllabus, setSyllabus] = useState(
        course.syllabus ? course.syllabus : ""
    );
    const [officeHours, setOfficeHours] = useState(
        course.office_hrs ? course.office_hrs : []
    );
    const [icsFile, setIcsFile] = useState(
        course.ics_file ? course.ics_file : []
    );
    const [textbook, setTextBook] = useState(
        course.textbook ? course.textbook : ""
    );
    const [classTimes, setClassTimes] = useState(
        course.class_times ? course.class_times : []
    );
    const [school, setSchool] = useState(course.school ? course.school : "");
    const [creditHrs, setCreditHrs] = useState(
        course.credit_hrs ? course.credit_hrs : 3
    );
    const [gradingScheme, setGradingScheme] = useState(
        course.grading_scheme ? course.grading_scheme : []
    );
    const [id, setId] = useState(course.id ? course.id : "");

    const [miscs, setMiscs] = useState(course.miscs ? course.miscs : []) // hardcoded for now

    const [creditHours, setCreditHours] = useState(course.CreditHours ? course.CreditHours : 0)

    const navigate = useNavigate();

    const setFields = () => {
        setName(course.name);
        setInstructors(course.instructors);
        setSyllabus(course.syllabus);
        setOfficeHours(course.office_hrs);
        setIcsFile(course.ics_file);
        setTextBook(course.textbook);
        setClassTimes(course.class_times);
        setSchool(course.school);
        setCreditHrs(course.credit_hrs);

        if (course.grading_scheme) {
            setGradingScheme(course.grading_scheme);
        } else {
            setGradingScheme([]);
        }
        setId(course.id);
    };

    useEffect(() => {
        setFields();
    }, [course]);

    let { user } = useUser();
    let uid = user.uid;

    const handlePDFParseSubmission = (e) => {
        e.preventDefault();

        let userBody = {
            name: name,
            instructors: instructors,
            syllabus: syllabus,
            office_hrs: officeHours,
            ics_file: icsFile,
            textbook: textbook,
            class_times: classTimes,
            school: school,
            credit_hrs: creditHrs,
            grading_scheme: gradingScheme,
            id: id,
        };

        parseApp.put(`/courses/${uid}/${course.id}`, userBody).then((res) => {
            console.log("Updated course with: ");
            console.log(res);
            handleClose(e);
            navigate("/dashboard/courses");
        });
    };

    return (
        <div
            style={{ backgroundColor: "white", overflowY: "scroll" }}
            className=" sm:mx-32 lg:mx-32 xl:mx-72 rounded-lg p-5"
        >
            <div className="flex justify-between container mx-auto">
                <div className="w-full">
                    <div className="mt-4 px-4">
                        <div className="fixed right-96 shadow-md bg-gray-300 bg-opacity-50 rounded-xl p-1">
                            <Button
                                onClick={handleClose}
                                variant="text"
                            >
                                Close
                            </Button>
                        </div>

                        <h1 className="font-thinner flex text-4xl pt-10 px-5">
                            Just a few more steps...
                        </h1>

                        <form className="mx-5 my-5">
                            <SingleFieldInput 
                                header={"Class Information"}
                                label={"Course name"}
                                value={name} 
                                setValue={setName}
                                placeholder={"Input name of class"}
                            />

                            <SingleFieldInput 
                                // header={"Credit Hours"}
                                label={"Credit hours"}
                                value={creditHours} 
                                setValue={setCreditHours}
                                placeholder={"Input credit hours"}
                            />

                            <SingleFieldInput 
                                // header={"Credit Hours"}
                                label={"School"}
                                value={school} 
                                setValue={setSchool}
                                placeholder={"Input school name"}
                            />

                            <InstructorField
                                setInstructors={setInstructors}
                                instructors={instructors}
                            />

                            <ClassTimeField
                                setClassTimes={setClassTimes}
                                classTimes={classTimes}
                            />

                            <MiscellaneousField
                                setMiscs={setMiscs}
                                miscs={miscs}
                            />

                            <GradingSchemeField 
                                gradingScheme={gradingScheme}
                                setGradingScheme={setGradingScheme}
                            />




                            {/* <h1 className="text-2xl font-semibold mt-3">
                                Office Hours:
                                <span>
                                    <AddButton />
                                </span>
                            </h1>

                            {officeHours
                                ? officeHours.map((officeHour, index) => (
                                      <officeHoursField
                                          officeHours={officeHour}
                                          key={index}
                                      />
                                  ))
                                : ""} */}
                            {/* 
                            <h1 className="text-2xl font-semibold mt-10">
                                Miscellaneous:
                                <span>
                                    <AddButton />
                                </span>
                            </h1>
                            <label
                                className="relative block p-3 border-2 mt-5 border-black rounded w-11/12"
                                htmlFor="name"
                            >
                                <span
                                    className="text-md font-semibold text-zinc-900"
                                    htmlFor="name"
                                >
                                    Textbook
                                </span>
                                <input
                                    className="w-full   p-0 text-sm border-none bg-transparent text-gray-500 focus:outline-none"
                                    type="text"
                                    placeholder="Enter Textbook name"
                                    onChange={(e) =>
                                        setTextBook(e.target.value)
                                    }
                                    vaue={textbook}
                                />
                            </label> */}

                            {/* Not Functional yet */}
                            {/* <CategoryField /> */}

                            <button
                                className="mt-5 border-2 px-5 py-2 rounded-lg border-black 
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
};

export default PdfEdit;
