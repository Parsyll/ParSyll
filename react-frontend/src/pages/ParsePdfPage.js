import React, { useEffect, useState } from "react";
import Button from '@mui/material/Button';
import UploadPdfButton from '../components/pdfUpload/UploadPdfButton'
import { DropZone } from "../components/pdfUpload/DropZone";
import ErrorMessage from "../components/ErrorMessage";

export const ParsePdfPage = () => {
  const [pdfFile, setPdfFile] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [openPdf, setOpenPdf] = useState(false);

  const handleErrorMessage = (text) => {
    setErrorMessage(text)
    setTimeout(() => {
      setErrorMessage("")
    }, 2000)
  }

  const handlePdfFileChange = (selectedFile) => {
    // let selectedFile = e.target.files[0];
    selectedFile = selectedFile[0]
    if (selectedFile) {
      if (selectedFile && selectedFile.type === "application/pdf") {
        // console.log(selectedFile)
        setPdfFile(selectedFile);
        setOpenPdf(true);
        setErrorMessage("");
      } else {
        setPdfFile(null);
        handleErrorMessage("Please select a valid PDF file")
      }
    }
  };

  return (
    <div className="flex items-center 
    justify-center flex-col">
        <h1 className=" text-7xl m-8 font-extrabold tracking-wide bg-gradient-to-r bg-clip-text  text-transparent 
            from-indigo-500 via-green-500 to-indigo-500
            animate-text"> 
          Parse PDF 
        </h1>
        <DropZone handlePdfFileChange={handlePdfFileChange}/>
        {errorMessage ? <ErrorMessage text={errorMessage} /> : ""}
        
        {pdfFile? 
          <div>
            <UploadPdfButton openPdf={openPdf} setOpenPdf={setOpenPdf} pdfFile={pdfFile} setPdfFile={setPdfFile} handleErrorMessage={handleErrorMessage}/>
          </div> : ""
        }
    </div>
  );
};

export default ParsePdfPage;
