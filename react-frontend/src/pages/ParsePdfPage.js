import React, { useEffect, useState, useRef } from "react";
import Button from '@mui/material/Button';
import UploadPdfButton from '../components/pdfUpload/UploadPdfButton'
import { DropZone } from "../components/pdfUpload/DropZone";

export const ParsePdfPage = () => {
  const [pdfFile, setPdfFile] = useState(null);
  const [pdfFileError, setPdfFileError] = useState("");
  const [openPdf, setOpenPdf] = useState(false);

  const handlePdfFileChange = (selectedFile) => {
    // let selectedFile = e.target.files[0];
    selectedFile = selectedFile[0]
    if (selectedFile) {
      if (selectedFile && selectedFile.type === "application/pdf") {
        // console.log(selectedFile)
        setPdfFile(selectedFile);
        setOpenPdf(true);
        setPdfFileError("");
      } else {
        setPdfFile(null);
        setPdfFileError("Please select valid pdf file");
      }
    } else {
      console.log("select your file");
    }
  };

  // const ref = useRef();

  return (
    <div className='flex items-center justify-center flex-col'>
        <h1 className=" text-7xl m-8 font-extrabold tracking-wide bg-gradient-to-r bg-clip-text  text-transparent 
            from-indigo-500 via-green-500 to-indigo-500
            animate-text"> 
          Parse PDF 
        </h1>
        <DropZone handlePdfFileChange={handlePdfFileChange}/>
        {pdfFileError && <div className="error-msg">{pdfFileError}</div>}
        
        {pdfFile? 
          <div>
            <UploadPdfButton openPdf={openPdf} setOpenPdf={setOpenPdf} pdfFile={pdfFile} setPdfFile={setPdfFile}/>
          </div> : ""
        }
    </div>
  );
};

export default ParsePdfPage;
