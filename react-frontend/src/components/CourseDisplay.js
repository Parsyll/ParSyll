import React, { useEffect, useState, useRef, useContext } from "react";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Button from "@mui/material/Button";
import ProfessorCard from "./coursePage/ProfessorCard";
import TaCard from "./coursePage/TaCard";
import ClassHourCard from "./coursePage/ClassHourCard";
import MiscCard from "./coursePage/MiscCard";
import parseApp from "../api/Axios";
import { AuthContext } from "../hooks/useAuth";
import loadingRunner from "../assets/slither_1.gif";
import { Modal } from "@mui/material";
import PdfViewer from "./pdfUpload/PdfViewer";

import { useNavigate } from "react-router-dom";
import { useUser } from "../hooks/useUser";

import PdfEdit from "./pdfUpload/PdfEdit";
import TimingDisplay from "./coursePage/TimingDisplay";

const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    bgcolor: "background.paper",
    border: "2px solid #000",
    overflow: "scroll",
    boxShadow: 24,
    p: 4,
};

const headerColour = "text-stone-700"

const CourseDisplay = ({ course, hasBeenEdited, setHasBeenEdited }) => {
    const [viewPdf, setViewPdf] = useState(false);
    const [editPdf, setEditPdf] = useState(false);
    const [pdfFile, setPdfFile] = useState("");
    const [loading, setLoading] = useState(true);
    let { user } = useUser();
    let uid = user.uid;
    let navigate = useNavigate();

    const handleDownloadIcsFile = (e) => {
        let fileBody = course.ics_file.join("");
        e.preventDefault();
        var element = document.createElement("a");
        element.setAttribute(
            "href",
            "data:text/plain;charset=utf-8," + encodeURIComponent(fileBody)
        );
        element.setAttribute("download", course.name + ".ics");

        element.style.display = "none";
        document.body.appendChild(element);

        element.click();

        document.body.removeChild(element);
    };

    const handleDeleteCourse = (e) => {
        e.preventDefault();
        parseApp.delete(`/courses/${uid}/${course.id}`).then((res) => {
            setHasBeenEdited(!hasBeenEdited);
            console.log(res);
        });
    };

    const handleEditCourse = (e) => {
        e.preventDefault();
        setEditPdf(true);
    };

    const handleGetSyllabus = (e) => {
        e.preventDefault();
        parseApp
            .get(`/pdfs/${uid}/${course.syllabus}`, {
                headers: { "Content-Type": "application/pdf" },
                responseType: "blob",
            })
            .then((res) => {
                const blob = new Blob([res.data], {type: res.headers['content-type']});
                blob.name = res.headers['content-disposition'];
                const url = URL.createObjectURL(blob);
                window.open(url);
            });
    };

    const handleCloseModal = (e) => {
        e.preventDefault();
        setEditPdf(false);
        setHasBeenEdited(!hasBeenEdited);
    };

    const loadingLogic = () => {
        if(!course) {
            return (
                <div className=" flex flex-col align-middle p-5">
                    <h1 className=" text-5xl text-center font-bold mb-10">
                        Wow, such empty
                    </h1>
                    <img
                        src={loadingRunner}
                        alt="loading..."
                        className="mb-10"
                    />
                    <Button
                        variant="contained"
                        color="primary"
                        size="large"
                        onClick={() => navigate("/dashboard/upload_pdf")}
                    >
                        Parse PDF
                    </Button>
                </div>
            )
        } else {
            return (
                <div> Nothing yet</div>
            )
        }
    }

    // Sort days of week
    let dayDic = {
        Monday: 0,
        Tuesday: 1,
        Wednesday: 2,
        Thursday: 3,
        Friday: 4,
        Saturday: 5,
        Sunday: 6,
    };

    if (course && course.day_of_week) {
        course.day_of_week.sort((a, b) => dayDic[a] - dayDic[b]);
    }

    return (
        <div className=" flex align-middle justify-center m-6 pl-3 w-10/12">
            {course ? (
                <div className="align-middle w-10/12 bg-white p-2">
                    <h1 className={`${headerColour} text-5xl text-center font-bold text-stone-700`}>
                        {course.name}
                    </h1>
                    <h1 className={` text-gray-600 text-xl text-center font-bold mt-3`}>
                        {course.school}
                    </h1>

                    <h1 className={`${headerColour} pl-3 my-3 text-3xl font-bold`}>
                        Credit hours:
                        <span className="">
                            {course.credit_hrs ? ` ${course.credit_hrs}` : ""}
                        </span>
                    </h1>

                    <h1 className={`${headerColour} pl-3 pt-4 mb-3 text-3xl font-bold`}>
                        Instructors:
                    </h1>
                    <div className="p-4">
                        {course.instructors.map((instructor, index) =>
                            instructor.isProf ? (
                                <ProfessorCard
                                    key={`prof-${index}`}
                                    professor={instructor}
                                    index={index}
                                />
                            ) : ""
                        )}
                    </div>
                        <div
                            className={`grid grid-cols-${Math.min(
                                course.instructors.filter((i)=> i.isProf === false).length,
                                3
                            )} p-4 mt-0"`}
                        >
                            {course.instructors.filter((i) => i.isProf === false).map((instructor, index) =>
                                <div className={`col-start-${(index + 1) % 4} col-span-1`} key={index}>
                                    <TaCard
                                        key={`TA-${index}`}
                                        instructor={instructor}
                                        index={index}
                                    />
                                </div>
                            )}
                    </div>
                    
                    <TimingDisplay timings={course.class_times.filter((t) => t.attribute.toLowerCase() === "lec")} header={"Lecture Timing :"} headerColour={headerColour} />
                    <TimingDisplay timings={course.class_times.filter((t) => t.attribute.toLowerCase() === "rec")} header={"Recitation Timing :"} headerColour={headerColour}/>
                    <TimingDisplay timings={course.class_times.filter((t) => t.attribute.toLowerCase() === "lab")} header={"Lab Timing :"} headerColour={headerColour}/>
                    <TimingDisplay timings={course.class_times.filter((t) => t.attribute.toLowerCase() === "oh")} header={"Office Hour Timing :"} headerColour={headerColour}/>


                    <MiscCard miscs={course.miscs} headerColour={headerColour}/>

                    <div className="flex flex-row justify-around align-middle mt-10">
                        <Button
                            variant="outlined"
                            color="secondary"
                            onClick={handleDownloadIcsFile}
                        >
                            Download ICS
                        </Button>
                        <Button variant="outlined" onClick={handleGetSyllabus}>
                            View Syllabus
                        </Button>
                        <Button variant="outlined" onClick={handleEditCourse}>
                            Edit Course
                        </Button>
                        <Button
                            variant="outlined"
                            color="error"
                            onClick={handleDeleteCourse}
                        >
                            Delete Course
                        </Button>
                    </div>

                    {editPdf ? (
                        <div className="border-4 flex flex-row pb-10 mb-10">
                            <Modal
                                style={{ overflow: "scroll" }}
                                disableEnforceFocus
                                open={editPdf}
                                onClose={handleCloseModal}
                                aria-labelledby="modal-modal-title"
                                aria-describedby="modal-modal-description"
                            >
                                {editPdf ? (
                                    <Box>
                                        <PdfEdit
                                            course={course}
                                            handleClose={handleCloseModal}
                                        />
                                    </Box>
                                ) : (
                                    <Box sx={style}></Box>
                                )}
                            </Modal>
                        </div>
                    ) : (
                        <div></div>
                    )}
                </div>
            ) : (
                <div className=" flex flex-col align-middle p-5">
                    <h1 className=" text-5xl text-center font-bold mb-10">
                        Wow, such empty
                    </h1>
                    <img
                        src={loadingRunner}
                        alt="loading..."
                        className="mb-10"
                    />
                    <Button
                        variant="contained"
                        color="primary"
                        size="large"
                        onClick={() => navigate("/dashboard/upload_pdf")}
                    >
                        Parse PDF
                    </Button>
                </div>
            )}
        </div>
    );
};

export default CourseDisplay;
